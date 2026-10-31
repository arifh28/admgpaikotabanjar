exports.handler = async function(event, context) {
    // Pastikan metode yang masuk adalah POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }) };
    }

    // GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT ANDA
    const GAS_URL = "https://script.google.com/macros/s/AKfycbwGbgSzR3yJmrKAfEv0pIayvnzi0MVoCwwWiL6-CiLHByuhdz6aNXSyQ-Hr6b60aTE1/exec";

    try {
        // Karena Netlify menggunakan Node 18+, fungsi fetch bawaan sudah tersedia
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: event.body
        });

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ status: "error", message: error.toString() })
        };
    }
};