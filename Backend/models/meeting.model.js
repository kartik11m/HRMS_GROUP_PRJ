import pool from "../db/db.js";

export const createMeetingsTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS meetings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        type VARCHAR(50) DEFAULT 'Remote',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    try {
        await pool.query(query);
        console.log("✅ Meetings table created successfully");
    } catch (error) {
        console.error("❌ Error creating meetings table:", error);
    }
};

export const createMeeting = async (title, start_time, end_time, type) => {
    const query = `
        INSERT INTO meetings (title, start_time, end_time, type)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const result = await pool.query(query, [title, start_time, end_time, type]);
    return result.rows[0];
};

export const getMeetings = async () => {
    const query = `
        SELECT * FROM meetings
        ORDER BYQT start_time ASC;
    `;
    // Ordering by start_time to show upcoming first
    // Note: In a real app we might want to filter by date >= now()
    const result = await pool.query("SELECT * FROM meetings ORDER BY start_time ASC");
    return result.rows;
};

export const deleteMeeting = async (id) => {
    const query = `DELETE FROM meetings WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
