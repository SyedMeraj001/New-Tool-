-- Fix incorrect createdAt dates in compliance_records table
UPDATE compliance_records 
SET "createdAt" = CURRENT_TIMESTAMP 
WHERE "createdAt" > CURRENT_TIMESTAMP OR "createdAt" IS NULL;

-- Verify the update
SELECT name, "createdAt", "updatedAt", deadline FROM compliance_records;