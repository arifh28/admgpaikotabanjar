// netlify/functions/get-guru.js

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payloadFrontend = JSON.parse(event.body);
    
    // Ganti dengan URL Web App GAS Anda
    const urlGAS = "https://script.google.com/macros/s/AKfycbyq3ZQuaBMK4HNycPWu86pt2fSu7z7eZzi6N5s6V7KrCAC0fB33pyfNfJbExEjv61Xj/exec"; 

    const responseGAS = await fetch(urlGAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: "get_guru_by_kepsek",
        nip_kepsek: payloadFrontend.nip_kepsek
      }) 
    });

    const result = await responseGAS.json();

    if(result.status === "success") {
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true, data: result.data })
        };
    } else {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, message: "Gagal mengambil data dari server." })
        };
    }

  } catch (error) {
    // TAMBAHKAN LOG INI
    console.log("Error detil di Netlify Function:", error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Error di Server: " + error.message })
    };
  }
};