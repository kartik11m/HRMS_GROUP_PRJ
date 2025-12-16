const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function applySchema() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        const schemaPath = path.join(__dirname, 'sql', 'schema_employee.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying employee core schema...');
        await client.query(schemaSql);
        console.log('✅ Employee Core schema applied successfully');

    } catch (err) {
        console.error('❌ Error applying schema:', err);
    } finally {
        await client.end();
    }
}

applySchema();
