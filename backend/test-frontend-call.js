// Test the exact API call that frontend makes
const testData = {
  name: "Test Stakeholder",
  type: "External", 
  engagement_level: "Medium",
  priority: "Medium",
  description: "Test description",
  key_concerns: "Test concerns",
  next_action: "Test action",
  contact_email: "test@example.com",
  department: "Test Dept",
  stakeholder_percentage: 10,
  icon: "👤"
};

fetch('http://localhost:5000/api/stakeholders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => console.log('Result:', data))
.catch(err => console.error('Error:', err));