const { Client } = require('pg');
require('dotenv').config();

async function updateAvatars() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await client.connect();

        const res = await client.query('SELECT id, name FROM users');
        console.log(`Found ${res.rowCount} users. Updating all avatars...`);

        for (const user of res.rows) {
            // Use a random image 1-70 from Pravatar to ensure variety
            const randomId = Math.floor(Math.random() * 70) + 1;
            const avatar = `https://i.pravatar.cc/150?img=${randomId}`;

            await client.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatar, user.id]);
            console.log(`Updated avatar for ${user.name}`);
        }

        console.log('✅ Avatar updates completed');

    } catch (err) {
        console.error('❌ Error updating avatars:', err);
    } finally {
        await client.end();
    }
}

updateAvatars();
