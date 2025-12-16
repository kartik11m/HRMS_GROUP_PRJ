const { Client } = require('pg');
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

        const query = `
            CREATE TABLE IF NOT EXISTS employee_of_the_month (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                month DATE NOT NULL,
                description TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(month)
            );

            CREATE TABLE IF NOT EXISTS eotm_team_members (
                id SERIAL PRIMARY KEY,
                eotm_id INT REFERENCES employee_of_the_month(id) ON DELETE CASCADE,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                role VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Sample Data for Testing (only if table is empty)
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM employee_of_the_month) THEN
                    -- Insert a dummy winner (assuming user_id 1 exists)
                    INSERT INTO employee_of_the_month (user_id, month, description)
                    VALUES (1, CURRENT_DATE, 'Your leadership sets the tone for excellence. The way you navigate challenges, support your team, and turn goals into achievements has truly elevated our entire workflow.');
                    
                    -- Insert sample team member (assuming user_id 2 exists)
                    INSERT INTO eotm_team_members (eotm_id, user_id, role)
                    VALUES ((SELECT id FROM employee_of_the_month LIMIT 1), 2, 'Project Manager');
                END IF;
            END $$;
        `;

        await client.query(query);
        console.log('✅ Employee of the Month schema applied successfully');

    } catch (err) {
        console.error('❌ Error applying schema:', err);
    } finally {
        await client.end();
    }
}

applySchema();
