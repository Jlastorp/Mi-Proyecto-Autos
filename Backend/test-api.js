const http = require('http');

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
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

async function test() {
    try {
        console.log('Testing GET http://localhost:3000/api/ventas ...');
        const resVentas = await get('http://localhost:3000/api/ventas');
        console.log('Ventas Status:', resVentas.statusCode);
        console.log('Ventas Body (first 100 chars):', resVentas.body.substring(0, 100));

        console.log('\nTesting GET http://localhost:3000/api/autos ...');
        const resAutos = await get('http://localhost:3000/api/autos');
        console.log('Autos Status:', resAutos.statusCode);
        console.log('Autos Body (first 100 chars):', resAutos.body.substring(0, 100));
    } catch (err) {
        console.error('Error contacting server:', err.message);
    }
}

test();
