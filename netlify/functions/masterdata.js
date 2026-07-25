exports.handler = async (event, context) => {
    // GANTI STRING DI BAWAH DENGAN URL EXEC DARI GAS MASTER DATA YANG BARU ANDA DEPLOY!
    const GAS_URL_MASTER = "https://script.google.com/macros/s/AKfycbwNxRVR73lbAQTGlF3qaQD4MYUYkwa5X0pOGdbOmFHZfPqoOKy_RR7AQk63zoKY-Wel/exec"; 

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

        const response = await fetch(GAS_URL_MASTER, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

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