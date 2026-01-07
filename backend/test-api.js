import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testStakeholderAPI() {
  console.log('🧪 Testing Stakeholder API...\n');

  try {
    // Test 1: Create a stakeholder
    console.log('1️⃣ Testing CREATE stakeholder...');
    const createResponse = await fetch(`${API_BASE}/stakeholders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test API Stakeholder',
        type: 'External',
        engagement_level: 'High',
        priority: 'Medium',
        description: 'API test stakeholder',
        contact_email: 'api@test.com',
        department: 'Testing',
        stakeholder_percentage: 15.5,
        icon: '🧪'
      })
    });

    const createResult = await createResponse.json();
    console.log('✅ CREATE result:', createResult.success ? 'SUCCESS' : 'FAILED');
    if (!createResult.success) {
      console.log('❌ Error:', createResult.error);
      return;
    }

    const stakeholderId = createResult.data.id;
    console.log('📝 Created stakeholder ID:', stakeholderId);

    // Test 2: Get all stakeholders
    console.log('\n2️⃣ Testing GET all stakeholders...');
    const listResponse = await fetch(`${API_BASE}/stakeholders`);
    const listResult = await listResponse.json();
    console.log('✅ GET ALL result:', listResult.success ? 'SUCCESS' : 'FAILED');
    console.log('📊 Total stakeholders:', listResult.data?.length || 0);

    // Test 3: Get specific stakeholder
    console.log('\n3️⃣ Testing GET specific stakeholder...');
    const getResponse = await fetch(`${API_BASE}/stakeholders/${stakeholderId}`);
    const getResult = await getResponse.json();
    console.log('✅ GET ONE result:', getResult.success ? 'SUCCESS' : 'FAILED');

    // Test 4: Update stakeholder
    console.log('\n4️⃣ Testing UPDATE stakeholder...');
    const updateResponse = await fetch(`${API_BASE}/stakeholders/${stakeholderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Updated API Stakeholder',
        engagement_level: 'Low',
        priority: 'High'
      })
    });

    const updateResult = await updateResponse.json();
    console.log('✅ UPDATE result:', updateResult.success ? 'SUCCESS' : 'FAILED');

    // Test 5: Delete stakeholder
    console.log('\n5️⃣ Testing DELETE stakeholder...');
    const deleteResponse = await fetch(`${API_BASE}/stakeholders/${stakeholderId}`, {
      method: 'DELETE'
    });

    const deleteResult = await deleteResponse.json();
    console.log('✅ DELETE result:', deleteResult.success ? 'SUCCESS' : 'FAILED');

    console.log('\n🎉 All API tests completed!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running:');
    console.log('   cd backend && npm start');
  }
}

testStakeholderAPI();