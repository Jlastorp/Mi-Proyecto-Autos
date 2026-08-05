const https = require('https'); // Cambiado a 'https' para soportar Render

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        }).on('error', reject);
    });
}

// Reemplaza con la URL base exacta de tu servidor en Render
const BASE_URL = 'https://mi-proyecto-autos.onrender.com';

async function test() {
    try {
        console.log(`Testing GET ${BASE_URL}/api/ventas ...`);
        const resVentas = await get(`${BASE_URL}/api/ventas`);
        console.log('Ventas Status:', resVentas.statusCode);
        console.log('Ventas Body (first 100 chars):', resVentas.body.substring(0, 100));

        console.log(`\nTesting GET ${BASE_URL}/api/autos ...`);
        const resAutos = await get(`${BASE_URL}/api/autos`);
        console.log('Autos Status:', resAutos.statusCode);
        console.log('Autos Body (first 100 chars):', resAutos.body.substring(0, 100));
    } catch (err) {
        console.error('Error contacting server:', err.message);
    }
}

test();