const data = {
  name: 'Test Stakeholder',
  type: 'Investor',
  engagement_level: 'High',
  priority: 'High',
  description: 'Created via test',
  contact_email: 'test@example.com',
  stakeholder_percentage: 12.5,
};

fetch('http://localhost:5000/api/stakeholders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
  .then((r) => r.json())
  .then((j) => console.log(JSON.stringify(j, null, 2)))
  .catch((e) => console.error('fetch error', e));
