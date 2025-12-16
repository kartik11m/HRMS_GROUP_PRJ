import pool from "../db/db.js";

// Create interviews table
export const createInterviewsTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS interviews (
      id SERIAL PRIMARY KEY,
      application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
      candidate_name VARCHAR(255) NOT NULL,
      date TIMESTAMP NOT NULL,
      interviewer VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'SCHEDULED',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    try {
        await pool.query(query);
        console.log("✅ Interviews table created successfully");
    } catch (error) {
        console.error("❌ Error creating interviews table:", error);
    }
};

export const scheduleInterview = (data) => {
    const { application_id, candidate_name, date, interviewer, type } = data;
    return pool.query(
        "INSERT INTO interviews (application_id, candidate_name, date, interviewer, type) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [application_id, candidate_name, date, interviewer, type]
    );
};

export const getInterviews = () => {
    return pool.query("SELECT * FROM interviews ORDER BY date ASC");
};
