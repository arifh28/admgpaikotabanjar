exports.handler = async (event, context) => {
    // URL Web App GAS Anda
    const GAS_URL = "https://script.google.com/macros/s/AKfycbx3_tOtMK3xYpIqI5g7zESJ59d7GwoZyh_MAqtScdUVqoksiO4iXKI2tnPj0FhSM3uf/exec"; 

    // 1. SURAT IZIN (CORS HEADERS)
    const headers = {
        "Access-Control-Allow-Origin": "*", // Mengizinkan semua domain, termasuk localhost
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
    };

    // 2. TANGANI PREFLIGHT REQUEST (Penting untuk Browser)
    // Browser selalu mengirim method 'OPTIONS' dulu sebelum mengirim 'POST'
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "OK" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: "Method Not Allowed" };
    }

    try {
        const payload = JSON.parse(event.body);

        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        // 3. SISIPKAN HEADERS IZIN KE RESPONSE SUKSES
        return {
            statusCode: 200,
            headers: { 
                ...headers, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        // 4. SISIPKAN HEADERS IZIN KE RESPONSE ERROR
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ status: "error", message: error.message })
        };
    }
};