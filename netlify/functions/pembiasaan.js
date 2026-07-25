exports.handler = async (event, context) => {
    // URL Web App GAS Anda dari Langkah 1
    const GAS_URL = "https://script.google.com/macros/s/AKfycbx3_tOtMK3xYpIqI5g7zESJ59d7GwoZyh_MAqtScdUVqoksiO4iXKI2tnPj0FhSM3uf/exec"; 

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const payload = JSON.parse(event.body);

        // Teruskan data ke GAS
        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ status: "error", message: error.message })
        };
    }
};