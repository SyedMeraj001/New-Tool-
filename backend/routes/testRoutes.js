import express from 'express';
import { broadcast } from '../websocket.js';

const router = express.Router();

// Test endpoint to trigger regulatory update
router.post('/test-update/:id', (req, res) => {
  const { id } = req.params;
  const { progress, status } = req.body;
  
  const testData = {
    id: parseInt(id),
    progress: progress || Math.floor(Math.random() * 100),
    status: status || 'In Progress',
    name: 'Test Regulation',
    description: 'Test regulatory update',
    deadline: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  console.log('Sending test regulatory update:', testData);
  
  broadcast({
    type: 'regulatory_update',
    data: testData,
    timestamp: new Date().toISOString()
  });
  
  res.json({
    success: true,
    message: 'Test update broadcasted',
    data: testData
  });
});

export default router;