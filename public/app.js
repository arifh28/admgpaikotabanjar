async function prosesLogin(usernameInput, passwordInput) {
  try {
    const kirimForm = await fetch("/.netlify/functions/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
        device: "Chrome Windows Web" // Deteksi otomatis lewat navigator.userAgent lebih baik
      })
    });

    const hasil = await kirimForm.json();

    if (kirimForm.status === 200 && hasil.success) {
      // 1. Simpan data user ke Session Browser
      localStorage.setItem("user_session", JSON.stringify(hasil.user));

      // 2. Arahkan halaman / Render UI berdasarkan Role
      const roleUser = hasil.user.Role; // Mengambil data kolom 'Role' dari Sheets
      
      if (roleUser === "Guru") {
        alert(`Selamat Datang Guru: ${hasil.user.Nama_Lengkap}`);
        window.location.href = "/guru/"; // Buka fitur Input Pembiasaan & Cetak
      } else if (roleUser === "Kepala Sekolah") {
        alert(`Selamat Datang Kepala Sekolah: ${hasil.user.Nama_Lengkap}`);
        window.location.href = "/kepsek/"; // Menu approval / rekap
      } else if (roleUser === "Pengawas") {
        alert(`Selamat Datang Pengawas: ${hasil.user.Nama_Lengkap}`);
        window.location.href = "/pengawas/"; // Menu monitoring antar sekolah
      }
      
    } else {
      alert("Gagal Login: " + hasil.message);
    }
  } catch (err) {
    console.error("Koneksi gagal:", err);
  }
}