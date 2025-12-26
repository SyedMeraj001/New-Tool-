-- ESG Application Database Schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    region VARCHAR(100),
    reporting_framework VARCHAR(50) DEFAULT 'GRI',
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_companies_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS esg_data (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    reporting_year INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15,4),
    unit VARCHAR(50),
    framework_code VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_esg_data_company
        FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_esg_data_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS esg_scores (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    reporting_year INTEGER NOT NULL,
    environmental_score DECIMAL(5,2) DEFAULT 0,
    social_score DECIMAL(5,2) DEFAULT 0,
    governance_score DECIMAL(5,2) DEFAULT 0,
    overall_score DECIMAL(5,2) DEFAULT 0,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_esg_scores_company
        FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_esg_scores_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default admin (only if not exists)
INSERT INTO users (email, password_hash, full_name, role, status, approved_at)
VALUES (
    'admin@esgenius.com',
    '$2b$10$admin123hash',
    'ESG Admin',
    'admin',
    'approved',
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;
