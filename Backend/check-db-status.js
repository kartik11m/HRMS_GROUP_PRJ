const pool = require('./config/database');

async function checkDatabase() {
    try {
        console.log('Testing database connection...');
        const client = await pool.connect();
        console.log('✅ Database connected successfully');

        console.log('Checking tables...');
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log('Found tables:', res.rows.map(r => r.table_name));

        const requiredTables = ['users', 'conversations', 'conversation_participants', 'messages'];
        const missingTables = requiredTables.filter(t => !res.rows.some(r => r.table_name === t));

        if (missingTables.length > 0) {
            console.log('❌ Missing tables:', missingTables);
        } else {
            console.log('✅ All required tables found');
        }

        client.release();
    } catch (err) {
        console.error('❌ Database check failed!');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        if (err.detail) console.error('Error detail:', err.detail);
    } finally {
        await pool.end();
    }
}

checkDatabase();
