const { Client } = require('pg');
require('dotenv').config();

async function alterTable() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await client.connect();

        // Increase avatar column length
        await client.query('ALTER TABLE users ALTER COLUMN avatar TYPE VARCHAR(255)');
        console.log('✅ Updated avatar column length to 255');

    } catch (err) {
        console.error('❌ Error altering table:', err);
    } finally {
        await client.end();
    }
}

alterTable();
