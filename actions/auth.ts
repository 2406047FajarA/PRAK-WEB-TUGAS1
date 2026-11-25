"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { error } from "console";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerAction(prevState: { error?: string } | undefined, formData: FormData) {
    const name = formData.get("name") as string
     const email = formData.get("email") as string
      const password = formData.get("password") as string

    if (!name || !email || !password) {
        return {
            error: "Semua kolom wajib diisi!"
        }
    }

    if (password.length < 6) {
        return {
            error: "Password minimal 6 karakter!"
        }
    }

    const existingUser = await prisma.user.findUnique({ where: {email} })
    if (existingUser) {
        return {
            error: "Email sudah terdaftar!"
        }
    }

    const hashPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
        data: { name, email, password: hashPassword }
    })

    redirect("/login")
}

export async function loginAnction(prevState: { error?: string} | undefined, formData : FormData) {
    const email = formData.get("enmail") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return {
            error: "Email dan password wajib diisi!"
        }
    }

    const user = await prisma.user.findUnique({ where: {email} })
    if (!user) {
        return {
            error: "Email belum terdaftar di sistem!"
        }
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return {
            error: "Password salah"
        }
    }

    const sessionPayload = JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        loginAt: new Date().toISOString(),
    })


    const cookieStore = await cookies()
    cookieStore.set("praktikum_session", sessionPayload, {
        httpOnly: true,
        secure: process.env.Node_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/"
    })


    redirect("/dasboard")
}


export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete("praktikum_session")
    redirect("/login")
}