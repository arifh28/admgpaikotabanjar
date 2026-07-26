exports.handler = async function(event, context) {
    // Hanya izinkan metode POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // GANTI DENGAN URL GAS ANDA YANG AKTIF
    const GAS_URL = "https://script.google.com/macros/s/AKfycbxGowmb3p7PLyuuxsXJLernv3lvbFXhW7qGgjFwBwvioqWO7klwo2f5pWSf0tFoERK2uA/exec";

    try {
        const payload = JSON.parse(event.body);

        // Teruskan request ke Google Apps Script
        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Atur CORS sesuai domain Anda
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ status: 'error', message: 'Gagal terhubung ke server dokumen.' })
        };
    }
};