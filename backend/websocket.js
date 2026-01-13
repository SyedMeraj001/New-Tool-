import { WebSocketServer } from 'ws';

let wss = null;
const clients = new Map();

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');
    
    console.log(`Client connected: ${userId || 'anonymous'}`);
    
    if (userId) {
      clients.set(userId, ws);
    }
    
    ws.send(JSON.stringify({ 
      type: 'connected', 
      userId,
      timestamp: new Date().toISOString()
    }));
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received message:', data);
        
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        } else if (data.type === 'sync') {
          // Handle sync updates
          broadcast({
            type: 'update',
            entityType: data.entityType,
            entityId: data.entityId,
            action: data.action,
            payload: data.payload,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log(`Client disconnected: ${userId || 'anonymous'}`);
      if (userId) {
        clients.delete(userId);
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  console.log('WebSocket server initialized on /ws');
};



export const sendToUser = (userId, data) => {
  const client = clients.get(userId);
  if (client && client.readyState === 1) {
    try {
      client.send(JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Error sending message to user:', error);
      return false;
    }
  }
  return false;
};

export const broadcast = (data) => {
  const message = JSON.stringify({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  clients.forEach((client, userId) => {
    if (client.readyState === 1) {
      try {
        client.send(message);
      } catch (error) {
        console.error(`Error broadcasting to user ${userId}:`, error);
      }
    }
  });
};