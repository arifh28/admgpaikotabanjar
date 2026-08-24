exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // URL GAS KHUSUS DATA GURU
    const GAS_URL = "https://script.google.com/macros/s/AKfycbwNxRVR73lbAQTGlF3qaQD4MYUYkwa5X0pOGdbOmFHZfPqoOKy_RR7AQk63zoKY-Wel/exec";

    try {
        const payload = JSON.parse(event.body);

        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
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
            body: JSON.stringify({ status: 'error', message: 'Gagal terhubung ke server data guru.' })
        };
    }
};