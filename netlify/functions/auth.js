// netlify/functions/auth.js

exports.handler = async function(event, context) {
  // Hanya izinkan method POST untuk login
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Method Not Allowed" }) 
    };
  }

  try {
    // Ambil data kiriman dari Frontend Web
    const { username, password, device } = JSON.parse(event.body);

    // Tempelkan URL Web App dari deployment GAS Anda di sini
    const urlGAS = "https://script.google.com/macros/s/AKfycbyq3ZQuaBMK4HNycPWu86pt2fSu7z7eZzi6N5s6V7KrCAC0fB33pyfNfJbExEjv61Xj/exec";

    // Kirim data ke GAS dengan membawa payload action "login"
    const responseGAS = await fetch(urlGAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        username: username,
        password: password,
        device: device || "Web Browser"
      })
    });

    const result = await responseGAS.json();

    if (result.status === "success") {
      // Jika sukses, kembalikan status 200 dan data user (Role, Nama_Lengkap, dll.)
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          message: "Otentikasi Berhasil",
          user: result.user
        })
      };
    } else {
      // Jika salah password/tidak aktif, kembalikan status 401 Unauthorized
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: result.message })
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