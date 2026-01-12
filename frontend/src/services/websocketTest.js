// Test WebSocket connection
const testWebSocket = () => {
  const ws = new WebSocket('ws://localhost:5000/ws');
  
  ws.onopen = () => {
    console.log('✅ WebSocket connected successfully');
    
    // Send test message
    ws.send(JSON.stringify({
      type: 'ping',
      timestamp: new Date().toISOString()
    }));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('📨 Received:', data);
  };
  
  ws.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };
  
  ws.onclose = (event) => {
    console.log('🔌 WebSocket closed:', event.code, event.reason);
  };
  
  // Test regulatory update after 2 seconds
  setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'sync',
        entityType: 'regulatory',
        entityId: 1,
        action: 'update',
        payload: {
          progress: 85,
          status: 'In Progress'
        }
      }));
    }
  }, 2000);
};

// Run test if in browser
if (typeof window !== 'undefined') {
  console.log('🧪 Testing WebSocket connection...');
  testWebSocket();
}

export default testWebSocket;