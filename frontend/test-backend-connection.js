// Add this to your browser console to test connectivity
fetch('http://localhost:5000/api/stakeholders')
  .then(res => {
    console.log('✅ Backend reachable, status:', res.status);
    return res.json();
  })
  .then(data => console.log('✅ Data:', data))
  .catch(err => console.error('❌ Cannot reach backend:', err.message));