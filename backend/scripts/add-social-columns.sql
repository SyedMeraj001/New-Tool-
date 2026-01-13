-- Add missing social columns to social_data table
-- Run this if sequelize sync doesn't automatically add the columns

-- Additional Social Metrics
ALTER TABLE social_data ADD COLUMN IF NOT EXISTS training_hours_per_employee FLOAT;
ALTER TABLE social_data ADD COLUMN IF NOT EXISTS local_employment_percentage FLOAT;
ALTER TABLE social_data ADD COLUMN IF NOT EXISTS community_grievances INTEGER;
ALTER TABLE social_data ADD COLUMN IF NOT EXISTS employee_turnover_rate FLOAT;
ALTER TABLE social_data ADD COLUMN IF NOT EXISTS diversity_training_completion FLOAT;

-- Healthcare Industry Specific
ALTER TABLE social_data ADD COLUMN IF NOT EXISTS patient_safety_incidents INTEGER;
ALTER TABLE social_data ADD COLUMN IF NOT EXISTS healthcare_access_programs INTEGER;

-- Manufacturing Industry Specific
ALTER TABLE social_data ADD COLUMN IF NOT EXISTS workplace_safety_incidents INTEGER;
ALTER TABLE social_data ADD COLUMN IF NOT EXISTS manufacturing_jobs_created INTEGER;
ALTER TABLE social_data ADD COLUMN IF NOT EXISTS product_quality_issues INTEGER;