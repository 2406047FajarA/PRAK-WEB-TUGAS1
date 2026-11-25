"use client"


import { useActionState, } from "react"
import { registerAction } from "@/actions/auth"
import Link from "next/link"


const RegisterPage = () => {
    const [state, formAction, isPending] = useActionState(registerAction, undefined)


    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Registrasi Akun</h1>
                <p className="text-sm text-slate-500">Simpan akun baru ke database</p>
            </div>
        </main>
    )
}


export default RegisterPage