-- Insert SFDR and SEC Climate Rules directly into regulatory_records table
INSERT INTO regulatory_records (name, description, status, progress, priority, deadline, category, icon, color, notes, company_id, "createdAt", "updatedAt") VALUES
('SFDR', 'Sustainable Finance Disclosure Regulation', 'In Progress', 72, 'Medium', '2024-09-15', 'Financial', '💰', 'orange', 'EU regulation on sustainability-related disclosures in the financial services sector', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SEC Climate Rules', 'SEC Climate-Related Disclosures', 'In Progress', 72, 'High', '2024-11-30', 'Climate', '🏦', 'red', 'SEC rules requiring public companies to disclose climate-related risks and greenhouse gas emissions', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Verify the records were inserted
SELECT name, description, status, progress, deadline FROM regulatory_records;