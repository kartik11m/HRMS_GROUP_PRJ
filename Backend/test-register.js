const axios = require('axios');
const { Client } = require('pg');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api/auth/register';

const testUser = {
    name: 'Test Recruit',
    email: `recruit_${Date.now()}@example.com`,
    password: 'password123',
    designation: 'Junior Dev',
    department: 'IT',
    phone: '+1 555-999-8888'
};

const verifyRegistration = async () => {
    console.log('🔹 Testing Registration with Employee Details...');
    try {
        // 1. Call Register API
        const response = await axios.post(API_URL, testUser);
        console.log('✅ Registration API Success:', response.data.success);

        const userId = response.data.user.id;
        console.log('   User ID:', userId);

        // 2. Verify Database
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        await client.connect();

        const res = await client.query(
            'SELECT * FROM employees WHERE user_id = $1',
            [userId]
        );

        if (res.rows.length > 0) {
            const emp = res.rows[0];
            console.log('✅ Employee Record Found:');
            console.log(`   - Designation: ${emp.designation}`);
            console.log(`   - Department: ${emp.department}`);
            console.log(`   - Phone: ${emp.phone}`);

            if (emp.designation === testUser.designation && emp.department === testUser.department) {
                console.log('🌟 SUCCESS: Data matched!');
            } else {
                console.error('❌ FAIL: Data mismatch');
            }
        } else {
            console.error('❌ FAIL: No employee record created.');
        }

        await client.query('DELETE FROM employees WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM users WHERE id = $1', [userId]);
        console.log('🧹 Cleanup: Deleted test user.');

        await client.end();

    } catch (error) {
        console.error('❌ Test Failed:', error.response?.data || error.message);
    }
};

verifyRegistration();
