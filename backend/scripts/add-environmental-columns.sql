-- Add missing environmental columns to environmental_data table
-- Run this if sequelize sync doesn't automatically add the columns

-- Add GHG Emissions columns
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS ghg_scope2_tco2e FLOAT;
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS ghg_scope3_tco2e FLOAT;

-- Add Energy columns
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS renewable_energy_percentage FLOAT;
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS production_energy_intensity FLOAT;

-- Add Water columns
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS water_withdrawal_m3 FLOAT;

-- Add Waste columns
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS waste_generated_tonnes FLOAT;
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS medical_waste_tonnes FLOAT;
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS industrial_waste_tonnes FLOAT;

-- Add Industry-specific columns
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS pharmaceutical_emissions_tco2e FLOAT;
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS manufacturing_emissions_tco2e FLOAT;

-- Add timestamps if they don't exist
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE environmental_data ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;