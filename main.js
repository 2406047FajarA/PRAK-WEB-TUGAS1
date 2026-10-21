// File: main.js
// State Array Proyek
let projects = [
  {
    id: 1,
    title: "Sistem Inventaris Keuangan",
    category: "Web App",
    budget: 2500000,
    completed: true
  },
  {
    id: 2,
    title: "Sistem Kasir Digital POS",
    category: "Desktop App",
    budget: 5000000,
    completed: true
  },
  {
    id: 3,
    title: "Landing Page Profil Perusahaan",
    category: "Web App",
    budget: 1500000,
    completed: false
  },
  {
    id: 4,
    title: "Aplikasi Presensi GPS Mobile",
    category: "Mobile App",
    budget: 4500000,
    completed: false
  }
];

let activeCategory = "Semua";
let searchQuery = "";

// Helper Format Rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(angka);
};

// Pembaruan Statistik
const updateStats = (dataList) => {
  const totalProjects = dataList.length;
  const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
  const completedCount = dataList.filter(item => item.completed).length;

  document.getElementById("stat-total-projects").textContent = totalProjects;
  document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
  document.getElementById("stat-completed-projects").textContent = completedCount;
};

// Filter Gabungan (Pencarian & Kategori)
const getFilteredProjects = () => {
  return projects.filter(proj => {
    const matchCategory = activeCategory === "Semua" || proj.category === activeCategory;
    const matchSearch = proj.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });
};

// Render Kartu Proyek
const renderProjects = () => {
  const container = document.getElementById("project-list");
  if (!container) return;

  const filteredList = getFilteredProjects();

  if (filteredList.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #64748b; padding: 20px;'>Data proyek tidak ditemukan.</p>";
    return;
  }

  const htmlString = filteredList.map(proj => {
    const badgeClass = proj.completed ? "badge-success" : "badge-pending";
    const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";
    return `
      <div class="project-card">
        <div class="project-info">
          <span class="project-category">${proj.category}</span>
          <h4>${proj.title}</h4>
          <p class="project-budget">${formatRupiah(proj.budget)}</p>
        </div>
        <div>
          <span class="badge ${badgeClass}">${statusText}</span>
          <div class="card-actions">
            <button class="btn-action btn-toggle" onclick="toggleStatus(${proj.id})">Ubah Status</button>
            <button class="btn-action btn-delete" onclick="deleteProject(${proj.id})">Hapus</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = htmlString;
};

// Refresh Tampilan & Statistik
const refreshApp = () => {
  renderProjects();
  updateStats(projects);
};

// Fitur 3a: Toggle Status Proyek
window.toggleStatus = (id) => {
  projects = projects.map(proj => {
    if (proj.id === id) {
      return { ...proj, completed: !proj.completed };
    }
    return proj;
  });
  refreshApp();
};

// Fitur 3b: Hapus Proyek
window.deleteProject = (id) => {
  projects = projects.filter(proj => proj.id !== id);
  refreshApp();
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  refreshApp();

  // Fitur 1: Form Handling & Validasi
  const projectForm = document.getElementById("project-form");
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const titleInput = document.getElementById("title").value.trim();
    const categoryInput = document.getElementById("category").value;
    const budgetInput = parseFloat(document.getElementById("budget").value);
    const completedInput = document.getElementById("completed").checked;

    if (!titleInput) {
      alert("Judul proyek tidak boleh kosong!");
      return;
    }
    if (isNaN(budgetInput) || budgetInput <= 0) {
      alert("Estimasi anggaran harus angka lebih besar dari 0!");
      return;
    }

    const newProject = {
      id: Date.now(),
      title: titleInput,
      category: categoryInput,
      budget: budgetInput,
      completed: completedInput
    };

    projects.push(newProject);
    projectForm.reset();
    refreshApp();
  });

  // Fitur 2: Live Search Real-Time
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProjects();
  });

  // Filter Kategori
  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      activeCategory = e.target.getAttribute("data-category");
      renderProjects();
    });
  });
});