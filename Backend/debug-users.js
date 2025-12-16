const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function listUsers() {
    try {
        const res = await pool.query('SELECT id, name, email FROM users');
        console.log('Users in database:');
        const fs = require('fs');
        fs.writeFileSync('users.json', JSON.stringify(res.rows, null, 2));
        console.log('Users written to users.json');
    } catch (err) {
        console.error('Error querying users:', err);
    } finally {
        await pool.end();
    }
}

listUsers();
