const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// --- Employee Profile Management ---

const getEmployeeProfile = async (req, res) => {
    const userId = req.user.id; // From auth middleware

    try {
        const query = `
            SELECT u.id, u.name, u.email, u.avatar, u.status,
                   e.designation, e.department, e.dob, e.phone, e.address, 
                   e.skills, e.experience, e.emergency_contact
            FROM users u
            LEFT JOIN employees e ON u.id = e.user_id
            WHERE u.id = $1
        `;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getEmployeeProfileById = async (req, res) => {
    const userId = req.params.id; // From route params

    try {
        const query = `
            SELECT u.id, u.name, u.email, u.avatar, u.status,
                   e.designation, e.department, e.dob, e.phone, e.address, 
                   e.skills, e.experience, e.emergency_contact
            FROM users u
            LEFT JOIN employees e ON u.id = e.user_id
            WHERE u.id = $1
        `;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching profile by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateEmployeeProfile = async (req, res) => {
    const userId = req.user.id;
    const {
        name, // From users table
        designation, department, dob, phone, address, skills, experience, emergency_contact
    } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Update User Basic Info
        if (name) {
            await client.query('UPDATE users SET name = $1 WHERE id = $2', [name, userId]);
        }

        // Upsert Employee Details
        const upsertQuery = `
            INSERT INTO employees (user_id, designation, department, dob, phone, address, skills, experience, emergency_contact, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                designation = EXCLUDED.designation,
                department = EXCLUDED.department,
                dob = EXCLUDED.dob,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                skills = EXCLUDED.skills,
                experience = EXCLUDED.experience,
                emergency_contact = EXCLUDED.emergency_contact,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;

        // Ensure skills is array
        const skillsArray = Array.isArray(skills) ? skills : (skills ? [skills] : []);

        await client.query(upsertQuery, [
            userId, designation, department, dob, phone, address, skillsArray, experience, emergency_contact
        ]);

        await client.query('COMMIT');
        res.json({ message: 'Profile updated successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

// --- Document Management ---

const getDocuments = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query('SELECT * FROM documents WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const { originalname, path: filePath, size, mimetype } = req.file;
    const { type } = req.body; // e.g. Resume, ID Proof

    try {
        const query = `
            INSERT INTO documents (user_id, name, type, file_path, file_size, mime_type)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const result = await pool.query(query, [userId, originalname, type || 'Other', filePath, size, mimetype]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteDocument = async (req, res) => {
    const userId = req.user.id;
    const docId = req.params.id;

    try {
        // Get file path
        const result = await pool.query('SELECT * FROM documents WHERE id = $1 AND user_id = $2', [docId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const filePath = result.rows[0].file_path;

        // Delete from database
        await pool.query('DELETE FROM documents WHERE id = $1', [docId]);

        // Delete from filesystem
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file from disk:', err);
        });

        res.json({ message: 'Document deleted successfully' });

    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- Employee Directory ---

const getAllEmployees = async (req, res) => {
    try {
        const { search, department } = req.query;
        let query = `
            SELECT u.id, u.name, u.email, u.avatar, e.designation, e.department, e.skills, e.phone
            FROM users u
            LEFT JOIN employees e ON u.id = e.user_id
        `;

        const params = [];
        const conditions = [];

        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(u.name ILIKE $${params.length} OR e.designation ILIKE $${params.length} OR e.skills::text ILIKE $${params.length})`);
        }

        if (department) {
            params.push(department);
            conditions.push(`e.department = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY u.name ASC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getEmployeeProfile,
    getEmployeeProfileById,
    updateEmployeeProfile,
    getDocuments,
    uploadDocument,
    deleteDocument,
    getAllEmployees
};
