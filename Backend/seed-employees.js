const { Client } = require('pg');
const pool = require('./config/database');
require('dotenv').config();

const designations = ['Software Engineer', 'Product Manager', 'HR Manager', 'Designer', 'QA Engineer'];
const departments = ['Development', 'Sales', 'HR', 'Design', 'Marketing'];

async function seedEmployees() {
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

        // Get all users
        const res = await client.query('SELECT id, name FROM users');
        const users = res.rows;

        console.log(`Found ${users.length} users. Seeding employee details...`);

        for (const user of users) {
            // Check if employee record exists
            const check = await client.query('SELECT 1 FROM employees WHERE user_id = $1', [user.id]);

            if (check.rowCount === 0) {
                const designation = designations[Math.floor(Math.random() * designations.length)];
                const department = departments[Math.floor(Math.random() * departments.length)];
                const phone = `+1 555-01${Math.floor(10 + Math.random() * 90)}`;
                const avatar = `https://i.pravatar.cc/150?u=${user.id}`;

                // Update users table with avatar if null
                await client.query(`UPDATE users SET avatar = $1 WHERE id = $2 AND avatar IS NULL`, [avatar, user.id]);

                await client.query(`
                    INSERT INTO employees (user_id, designation, department, dob, phone, skills)
                    VALUES ($1, $2, $3, CURRENT_DATE, $4, $5)
                 `, [user.id, designation, department, phone, ['Teamwork', 'Communication']]);

                console.log(`Added employee details for ${user.name}`);
            } else {
                console.log(`Employee details already exist for ${user.name}`);
            }
        }

        console.log('✅ Seeding completed');

    } catch (err) {
        console.error('❌ Error seeding:', err);
    } finally {
        await client.end();
    }
}

seedEmployees();
