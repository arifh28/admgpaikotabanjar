exports.handler = async function(event, context) {
  // Hanya izinkan method POST
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Method Not Allowed" }) 
    };
  }

  try {
    const payload = JSON.parse(event.body);

    // Tautan Web App GAS Khusus Otentikasi & Akun
    const urlGAS = "https://script.google.com/macros/s/AKfycbyq3ZQuaBMK4HNycPWu86pt2fSu7z7eZzi6N5s6V7KrCAC0fB33pyfNfJbExEjv61Xj/exec";

    // KUNCI KOMPATIBILITAS: Jika dari halaman Login lama, payload.action biasanya kosong
    if (!payload.action) {
        payload.action = "login";
        if (!payload.device) payload.device = "Web Browser";
    }

    // Tembak ke GAS menggunakan text/plain agar tidak diblokir menjadi HTML
    const responseGAS = await fetch(urlGAS, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });

    const rawText = await responseGAS.text();
    const result = JSON.parse(rawText);

    // --- 1. JIKA AKSI ADALAH LOGIN ---
    if (payload.action === "login") {
        if (result.status === "success" || result.status === "sukses") {
          return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: true, message: "Otentikasi Berhasil", user: result.user || result.data })
          };
        } else {
          return {
            statusCode: 401,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: false, message: result.message })
          };
        }
    } 
    
    // --- 2. JIKA AKSI ADALAH CHANGE_PASSWORD ---
    else {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            // Langsung teruskan balasan murni dari GAS ke Front-End
            body: JSON.stringify(result) 
        };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: "Server Error", error: error.message })
    };
  }
};