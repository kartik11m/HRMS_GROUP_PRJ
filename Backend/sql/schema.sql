-- Create database if it doesn't exist (run this manually if needed)
-- CREATE DATABASE hrms_chat;

-- Connect to the database
-- \c hrms_chat;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(10),
  status VARCHAR(20) DEFAULT 'offline',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversations table
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(20) DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation participants (many-to-many relationship)
CREATE TABLE conversation_participants (
  id SERIAL PRIMARY KEY,
  conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INT REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Function to update conversation's updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp when a new message is added
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (name, email, password, avatar, status) VALUES
('Meg Griffin', 'meg@hrms.com', '$2b$10$YourHashedPasswordHere1', 'M', 'online'),
('The Boyz', 'boyz@hrms.com', '$2b$10$YourHashedPasswordHere2', 'B', 'online'),
('Stewie Griffin', 'stewie@hrms.com', '$2b$10$YourHashedPasswordHere3', 'S', 'offline'),
('Glenn Quagmire', 'glenn@hrms.com', '$2b$10$YourHashedPasswordHere4', 'G', 'offline'),
('Herbert', 'herbert@hrms.com', '$2b$10$YourHashedPasswordHere5', 'H', 'online'),
('John Doe', 'john@hrms.com', '$2b$10$YourHashedPasswordHere6', 'J', 'online');

-- Create sample conversations
INSERT INTO conversations (name, type) VALUES
('Meg Griffin', 'direct'),
('The Boyz', 'group'),
('Stewie Griffin', 'direct'),
('Glenn Quagmire', 'direct'),
('Herbert', 'direct');

-- Add participants to conversations (assuming user 1 is the logged-in user)
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(1, 6), (1, 1), -- John Doe and Meg
(2, 6), (2, 2), -- Group chat with The Boyz
(3, 6), (3, 3), -- John Doe and Stewie
(4, 6), (4, 4), -- John Doe and Glenn
(5, 6), (5, 5); -- John Doe and Herbert

-- Insert sample messages
INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES
(1, 1, 'Sent you a message', CURRENT_TIMESTAMP - INTERVAL '34 minutes'),
(1, 6, 'Hey, thanks!', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(2, 2, 'joe68: sent a message', CURRENT_TIMESTAMP - INTERVAL '34 minutes'),
(3, 3, 'Sent you a message', CURRENT_TIMESTAMP - INTERVAL '17 hours'),
(4, 4, 'The silence lmaoo', CURRENT_TIMESTAMP - INTERVAL '20 hours'),
(5, 5, 'Active', CURRENT_TIMESTAMP - INTERVAL '6 minutes');

COMMIT;

-- Employee of the Month table
CREATE TABLE IF NOT EXISTS employee_of_the_month (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- First day of the month
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(month) -- Only one employee per month
);

-- Team members for employee of the month
CREATE TABLE IF NOT EXISTS eotm_team_members (
  id SERIAL PRIMARY KEY,
  eotm_id INT REFERENCES employee_of_the_month(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

