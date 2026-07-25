exports.handler = async (event, context) => {
    const GAS_URL = "https://script.google.com/macros/s/AKfycbx3_tOtMK3xYpIqI5g7zESJ59d7GwoZyh_MAqtScdUVqoksiO4iXKI2tnPj0FhSM3uf/exec"; 

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
    };

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

        // TANGKAP SEBAGAI TEKS MENTAH DULU (Agar tidak langsung crash jika GAS error)
        const rawText = await response.text();
        let data;

        try {
            // Coba jadikan JSON
            data = JSON.parse(rawText);
        } catch (parseError) {
            // Jika gagal jadi JSON (berarti GAS mengirim HTML/Error), laporkan error aslinya!
            return {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ 
                    status: "error", 
                    message: "GAS Error/Bukan JSON: " + rawText.substring(0, 150) // Ambil 150 huruf pertama errornya
                })
            };
        }

        return {
            statusCode: 200,
            headers: { 
                ...headers, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(data)
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ status: "error", message: error.message })
        };
    }
};