exports.handler = async function(event, context) {
  // Tambahkan Header CORS agar localhost tidak diblokir
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Mengizinkan akses dari mana saja
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Tangani preflight request (OPTIONS) dari browser
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Hanya izinkan method POST
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ message: "Method Not Allowed" }) 
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const urlGAS = "https://script.google.com/macros/s/AKfycbyq3ZQuaBMK4HNycPWu86pt2fSu7z7eZzi6N5s6V7KrCAC0fB33pyfNfJbExEjv61Xj/exec";

    if (!payload.action) {
        payload.action = "login";
        if (!payload.device) payload.device = "Web Browser";
    }

    const responseGAS = await fetch(urlGAS, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });

    const rawText = await responseGAS.text();
    const result = JSON.parse(rawText);

    if (payload.action === "login") {
        if (result.status === "success" || result.status === "sukses") {
          return {
            statusCode: 200,
            headers, // Gunakan variabel headers yang baru
            body: JSON.stringify({ success: true, message: "Otentikasi Berhasil", user: result.user || result.data })
          };
        } else {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, message: result.message })
          };
        }
    } else {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result) 
        };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: "Server Error", error: error.message })
    };
  }
};