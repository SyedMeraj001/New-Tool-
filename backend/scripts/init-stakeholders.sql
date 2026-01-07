-- Create stakeholders table if it doesn't exist
CREATE TABLE IF NOT EXISTS stakeholders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(150),
    engagement_level VARCHAR(50) DEFAULT 'Medium',
    priority VARCHAR(50) DEFAULT 'Medium',
    description TEXT,
    key_concerns TEXT,
    next_action VARCHAR(255),
    contact_email VARCHAR(255),
    department VARCHAR(150),
    stakeholder_percentage FLOAT DEFAULT 0,
    icon VARCHAR(100) DEFAULT 'user',
    last_contact DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add email validation constraint if needed
ALTER TABLE stakeholders 
ADD CONSTRAINT valid_email 
CHECK (contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add percentage validation
ALTER TABLE stakeholders 
ADD CONSTRAINT valid_percentage 
CHECK (stakeholder_percentage >= 0 AND stakeholder_percentage <= 100);