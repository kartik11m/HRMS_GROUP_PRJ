const { Client } = require('pg');
const pool = require('../config/database');

const getEmployeeOfMonth = async (req, res) => {
    try {
        // Get the latest employee of the month
        // We order by month DESC to get the most recent one
        const query = `
            SELECT e.*, u.name, u.avatar, u.email
            FROM employee_of_the_month e
            JOIN users u ON e.user_id = u.id
            ORDER BY e.month DESC
            LIMIT 1
        `;

        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No employee of the month found' });
        }

        const employee = result.rows[0];

        // Get team members for this employee of the month
        const teamQuery = `
            SELECT t.*, u.name, u.avatar, u.email
            FROM eotm_team_members t
            JOIN users u ON t.user_id = u.id
            WHERE t.eotm_id = $1
        `;

        const teamResult = await pool.query(teamQuery, [employee.id]);

        res.json({
            ...employee,
            team: teamResult.rows
        });

    } catch (error) {
        console.error('Error fetching employee of the month:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createEmployeeOfMonth = async (req, res) => {
    // This would need admin authentication
    const { userId, month, description, teamMembers } = req.body;

    if (!userId || !month || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Check if entry already exists for this month
        // Ideally we should handle this with ON CONFLICT but for simplicity:
        const checkQuery = 'SELECT id FROM employee_of_the_month WHERE month = $1';
        const checkResult = await client.query(checkQuery, [month]);

        let eotmId;

        if (checkResult.rows.length > 0) {
            // Update existing
            eotmId = checkResult.rows[0].id;
            const updateQuery = `
                UPDATE employee_of_the_month 
                SET user_id = $1, description = $2 
                WHERE id = $3
                RETURNING id
            `;
            await client.query(updateQuery, [userId, description, eotmId]);

            // Delete existing team members to replace them
            await client.query('DELETE FROM eotm_team_members WHERE eotm_id = $1', [eotmId]);
        } else {
            // Insert new
            const insertQuery = `
                INSERT INTO employee_of_the_month (user_id, month, description)
                VALUES ($1, $2, $3)
                RETURNING id
            `;
            const insertResult = await client.query(insertQuery, [userId, month, description]);
            eotmId = insertResult.rows[0].id;
        }

        // Insert team members
        if (teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0) {
            for (const member of teamMembers) {
                const teamQuery = `
                    INSERT INTO eotm_team_members (eotm_id, user_id, role)
                    VALUES ($1, $2, $3)
                `;
                await client.query(teamQuery, [eotmId, member.userId, member.role]);
            }
        }

        await client.query('COMMIT');

        res.status(201).json({ message: 'Employee of the Month saved successfully', id: eotmId });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating employee of the month:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

const getCandidates = async (req, res) => {
    try {
        const query = 'SELECT id, name, email, avatar FROM users ORDER BY name ASC';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getEmployeeOfMonth,
    createEmployeeOfMonth,
    getCandidates
};
