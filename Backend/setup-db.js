const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    const dbName = process.env.DB_NAME;

    if (!dbName) {
        console.error('❌ DB_NAME not defined in .env');
        return;
    }

    console.log(`Using database: ${dbName}`);

    // 1. Connect to default 'postgres' database to create the new database
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres' // Default database
    });

    try {
        await client.connect();
        console.log('Connected to postgres database');

        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

        if (res.rowCount === 0) {
            console.log(`Database ${dbName} does not exist. Creating...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`✅ Database ${dbName} created successfully`);
        } else {
            console.log(`Database ${dbName} already exists`);
        }
    } catch (err) {
        console.error('❌ Error creating database:', err.message);
        // If auth failed here, we can't proceed
        if (err.code === '28P01') {
            console.error('Authentication failed. Please check DB_USER and DB_PASSWORD in .env');
            process.exit(1);
        }
    } finally {
        await client.end();
    }

    // 2. Connect to the target database and run schema
    const pool = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: dbName
    });

    try {
        await pool.connect();
        console.log(`Connected to ${dbName}`);

        const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            console.log('Running schema.sql...');
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await pool.query(schemaSql);
            console.log('✅ Schema applied successfully');
        } else {
            console.log('⚠️ schema.sql not found at', schemaPath);
        }

    } catch (err) {
        console.error('❌ Error applying schema:', err.message);
    } finally {
        await pool.end();
    }
}

setupDatabase();
