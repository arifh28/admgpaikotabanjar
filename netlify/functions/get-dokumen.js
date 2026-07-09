// netlify/functions/get-dokumen.js

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const payload = JSON.parse(event.body);
    
    // GANTI DENGAN URL GAS ANDA!
    const urlGAS = "https://script.google.com/macros/s/AKfycbyq3ZQuaBMK4HNycPWu86pt2fSu7z7eZzi6N5s6V7KrCAC0fB33pyfNfJbExEjv61Xj/exec"; 

    const responseGAS = await fetch(urlGAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: "get_dokumen_by_nip",
        nip: payload.nip
      }) 
    });

    const result = await responseGAS.json();

    if(result.status === "success") {
        return { statusCode: 200, body: JSON.stringify({ success: true, data: result.data }) };
    } else {
        return { statusCode: 400, body: JSON.stringify({ success: false, message: result.message }) };
    }

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: error.message }) };
  }
};