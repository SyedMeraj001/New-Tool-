// Test script to verify API and database connections
const testConnections = async () => {
  const API_BASE = 'http://localhost:5000';
  
  console.log('🔍 Testing API and Database Connections...\n');
  
  // Test 1: Health Check
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data.status);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
    return;
  }
  
  // Test 2: KPI Endpoint
  try {
    const response = await fetch(`${API_BASE}/api/kpi/1`);
    const data = await response.json();
    console.log('✅ KPI Endpoint:', data.success ? 'Working' : 'Failed');
    console.log('   Overall Score:', data.data?.overall || 0);
    console.log('   Environmental:', data.data?.environmental || 0);
    console.log('   Social:', data.data?.social || 0);
    console.log('   Governance:', data.data?.governance || 0);
  } catch (error) {
    console.log('❌ KPI Endpoint Failed:', error.message);
  }
  
  // Test 3: Create Sample Data
  try {
    const sampleData = {
      companyId: 1,
      wasteType: 'plastic',
      quantity: 100,
      unit: 'kg',
      disposalMethod: 'recycling',
      recyclingRate: 80,
      reportingPeriod: '2024-Q1'
    };
    
    const response = await fetch(`${API_BASE}/api/esg/waste-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleData)
    });
    
    const data = await response.json();
    console.log('✅ Sample Data Creation:', data.success ? 'Success' : 'Failed');
  } catch (error) {
    console.log('❌ Sample Data Creation Failed:', error.message);
  }
  
  // Test 4: Retrieve Data
  try {
    const response = await fetch(`${API_BASE}/api/esg/waste-data/1`);
    const data = await response.json();
    console.log('✅ Data Retrieval:', data.success ? 'Success' : 'Failed');
    console.log('   Records Found:', data.data?.length || 0);
  } catch (error) {
    console.log('❌ Data Retrieval Failed:', error.message);
  }
  
  console.log('\n🎯 Test Complete!');
};

// Run tests if this is a Node.js environment
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testConnections();
} else {
  // Browser environment
  window.testConnections = testConnections;
  console.log('Run testConnections() in browser console to test APIs');
}

export default testConnections;