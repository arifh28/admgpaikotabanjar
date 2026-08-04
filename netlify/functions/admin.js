// file: netlify/functions/admin.js
exports.handler = async (event, context) => {
    // URL Web App GAS Anda
    const GAS_URL = "https://script.google.com/macros/s/AKfycbyq3ZQuaBMK4HNycPWu86pt2fSu7z7eZzi6N5s6V7KrCAC0fB33pyfNfJbExEjv61Xj/exec";

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

        // TANGKAP SEBAGAI TEKS MENTAH DULU
        const rawText = await response.text();
        let data;

        try {
            data = JSON.parse(rawText);
        } catch (parseError) {
            return {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ 
                    status: "error", 
                    message: "GAS Error/Bukan JSON: " + rawText.substring(0, 150)
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