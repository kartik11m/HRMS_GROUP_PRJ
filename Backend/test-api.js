const jwt = require('jsonwebtoken');
const { Client } = require('pg');
require('dotenv').config();
const http = require('http');

async function testApi() {
    // 1. Generate Token
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
    console.log('Generated Token:', token);

    // 2. Call API
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/employees/list',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log('Response Count:', Array.isArray(json) ? json.length : 'Not an array');
                if (Array.isArray(json) && json.length > 0) {
                    console.log('First Employee:', JSON.stringify(json[0], null, 2));
                } else {
                    console.log('Response Body:', data);
                }
            } catch (e) {
                console.log('Response (Non-JSON):', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.end();
}

testApi();
