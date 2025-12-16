-- Employee Core Module Schema

-- Employees Table: Extends the basic users table with professional details
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    designation VARCHAR(255),
    department VARCHAR(255),
    dob DATE,
    phone VARCHAR(50),
    address TEXT,
    skills TEXT[], -- Array of strings for skills
    experience JSONB, -- Store work experience as structured JSON
    emergency_contact JSONB, -- Store emergency contact details as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Documents Table: Stores metadata for uploaded files
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- e.g., 'resume', 'id_proof', 'certificate'
    file_path TEXT NOT NULL,
    file_size INT, -- in bytes
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_designation ON employees(designation);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
