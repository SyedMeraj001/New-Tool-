-- Add missing governance columns to governance_data table
-- Run this if sequelize sync doesn't automatically add the columns

-- Additional Board Metrics
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS female_directors_percentage FLOAT;

-- Risk & Compliance
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS data_breach_incidents INTEGER;
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS cybersecurity_investment FLOAT;
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS supplier_esg_assessments INTEGER;
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS anti_corruption_policies INTEGER;
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS data_privacy_policies INTEGER;

-- Healthcare Industry Specific
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS fda_compliance FLOAT;
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS drug_pricing_transparency FLOAT;
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS clinical_trial_ethics FLOAT;

-- Manufacturing Industry Specific
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS product_safety_compliance FLOAT;
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS manufacturing_ethics_score FLOAT;
ALTER TABLE governance_data ADD COLUMN IF NOT EXISTS supply_chain_transparency FLOAT;