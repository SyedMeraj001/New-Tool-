-- ESG Application Database Dump (PostgreSQL)
-- Generated for E-S-GENIUS ESG Reporting System
-- Date: 2024-12-20

-- Drop existing tables if they exist
DROP TABLE IF EXISTS esg_scores;
DROP TABLE IF EXISTS esg_data;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL
);

-- Create Companies Table
CREATE TABLE companies (
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

-- Create ESG Data Table
CREATE TABLE esg_data (
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

-- Create ESG Scores Table
CREATE TABLE esg_scores (
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

-- Insert Sample Users
INSERT INTO users (email, password_hash, full_name, role, status, approved_at) VALUES
('admin@esgenius.com', '$2b$10$admin123hash', 'ESG Admin', 'admin', 'approved', CURRENT_TIMESTAMP),
('superadmin1@esgenius.com', '$2b$10$superadmin123hash', 'Super Admin', 'superadmin', 'approved', CURRENT_TIMESTAMP),
('manager@esgenius.com', '$2b$10$manager123hash', 'ESG Manager', 'manager', 'approved', CURRENT_TIMESTAMP),
('analyst@esgenius.com', '$2b$10$analyst123hash', 'ESG Analyst', 'user', 'approved', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Companies
INSERT INTO companies (name, sector, region, reporting_framework, created_by) VALUES
('E-S-GENIUS Tech Solutions', 'Technology', 'Asia-Pacific', 'GRI', 1),
('Green Energy Corp', 'Energy', 'North America', 'SASB', 1),
('Sustainable Manufacturing Ltd', 'Manufacturing', 'Europe', 'TCFD', 2),
('EcoFinance Bank', 'Financial Services', 'Global', 'BRSR', 2);

-- Insert Sample ESG Data
INSERT INTO esg_data (company_id, user_id, reporting_year, category, metric_name, metric_value, unit, framework_code, status) VALUES
(1, 1, 2024, 'environmental', 'Total GHG Emissions (Scope 1)', 125.50, 'tCO2e', 'GRI-305-1', 'approved'),
(1, 1, 2024, 'environmental', 'Total GHG Emissions (Scope 2)', 245.75, 'tCO2e', 'GRI-305-2', 'approved'),
(1, 1, 2024, 'environmental', 'Energy Consumption', 2500.00, 'MWh', 'GRI-302-1', 'approved'),
(1, 1, 2024, 'environmental', 'Renewable Energy Percentage', 65.00, '%', 'GRI-302-1', 'approved'),
(1, 1, 2024, 'environmental', 'Water Consumption', 15000.00, 'm3', 'GRI-303-5', 'approved'),
(1, 1, 2024, 'environmental', 'Waste Generated', 45.20, 'tonnes', 'GRI-306-3', 'approved'),
(1, 1, 2024, 'environmental', 'Waste Recycled', 38.42, 'tonnes', 'GRI-306-4', 'approved'),
(1, 1, 2024, 'social', 'Total Employees', 150.00, 'count', 'GRI-2-7', 'approved'),
(1, 1, 2024, 'social', 'Female Employees', 63.00, 'count', 'GRI-405-1', 'approved'),
(1, 1, 2024, 'social', 'Employee Turnover Rate', 8.50, '%', 'GRI-401-1', 'approved'),
(1, 1, 2024, 'social', 'Training Hours per Employee', 45.00, 'hours', 'GRI-404-1', 'approved'),
(1, 1, 2024, 'social', 'Safety Incidents', 2.00, 'count', 'GRI-403-9', 'approved'),
(1, 1, 2024, 'social', 'Community Investment', 50000.00, 'USD', 'GRI-413-1', 'approved'),
(1, 1, 2024, 'governance', 'Board Size', 7.00, 'count', 'GRI-2-9', 'approved'),
(1, 1, 2024, 'governance', 'Independent Directors', 4.00, 'count', 'GRI-2-9', 'approved'),
(1, 1, 2024, 'governance', 'Female Board Members', 3.00, 'count', 'GRI-405-1', 'approved'),
(1, 1, 2024, 'governance', 'Ethics Training Completion', 100.00, '%', 'GRI-2-15', 'approved'),
(1, 1, 2024, 'governance', 'Data Privacy Incidents', 0.00, 'count', 'GRI-418-1', 'approved'),
(2, 2, 2024, 'environmental', 'Total GHG Emissions (Scope 1)', 1250.00, 'tCO2e', 'SASB-IF-EU-110a.1', 'approved'),
(2, 2, 2024, 'environmental', 'Renewable Energy Generation', 85000.00, 'MWh', 'SASB-IF-EU-000.A', 'approved'),
(2, 2, 2024, 'social', 'Total Employees', 500.00, 'count', 'SASB-IF-EU-000.B', 'approved'),
(2, 2, 2024, 'governance', 'Board Independence', 80.00, '%', 'SASB-IF-EU-550a.1', 'approved'),
(3, 3, 2024, 'environmental', 'Climate Risk Assessment', 1.00, 'completed', 'TCFD-Strategy', 'approved'),
(3, 3, 2024, 'environmental', 'Carbon Intensity', 0.45, 'tCO2e/revenue', 'TCFD-Metrics', 'approved'),
(3, 3, 2024, 'social', 'Total Employees', 1200.00, 'count', 'TCFD-General', 'approved'),
(3, 3, 2024, 'governance', 'Climate Governance', 1.00, 'established', 'TCFD-Governance', 'approved');

-- Insert Sample ESG Scores
INSERT INTO esg_scores (company_id, user_id, reporting_year, environmental_score, social_score, governance_score, overall_score) VALUES
(1, 1, 2024, 85.50, 78.25, 92.00, 85.25),
(2, 2, 2024, 92.00, 75.50, 88.75, 85.42),
(3, 3, 2024, 78.25, 82.00, 85.50, 81.92),
(4, 2, 2024, 88.75, 85.25, 90.00, 88.00);

-- Create Indexes for Performance
CREATE INDEX idx_esg_data_company_year ON esg_data(company_id, reporting_year);
CREATE INDEX idx_esg_data_category ON esg_data(category);
CREATE INDEX idx_esg_data_status ON esg_data(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_companies_sector ON companies(sector);

-- Create Views for Reporting
CREATE VIEW esg_summary AS
SELECT 
    c.name as company_name,
    c.sector,
    c.region,
    c.reporting_framework,
    ed.reporting_year,
    ed.category,
    COUNT(ed.id) as metric_count,
    AVG(CASE WHEN ed.category = 'environmental' THEN es.environmental_score END) as env_score,
    AVG(CASE WHEN ed.category = 'social' THEN es.social_score END) as social_score,
    AVG(CASE WHEN ed.category = 'governance' THEN es.governance_score END) as gov_score,
    AVG(es.overall_score) as overall_score
FROM companies c
LEFT JOIN esg_data ed ON c.id = ed.company_id
LEFT JOIN esg_scores es ON c.id = es.company_id AND ed.reporting_year = es.reporting_year
GROUP BY c.id, ed.reporting_year, ed.category;

-- Database Statistics
SELECT 'Database Statistics' as info;
SELECT 'Total Users: ' || COUNT(*) as stat FROM users;
SELECT 'Total Companies: ' || COUNT(*) as stat FROM companies;
SELECT 'Total ESG Data Points: ' || COUNT(*) as stat FROM esg_data;
SELECT 'Total ESG Scores: ' || COUNT(*) as stat FROM esg_scores;

-- End of Database Dump
