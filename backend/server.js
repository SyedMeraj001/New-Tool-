// server.js - Main Entry Point (ES Modules)
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';
import corsMiddleware from './middleware/cors.js';
import errorHandler from './middleware/errorHandler.js';

// Your local routes
import workflowRoutes from './routes/workflowRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import esgRoutes from './routes/esgRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import kpiRoutes from './routes/kpiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Info
app.get('/', (_req, res) => {
  res.json({ 
    message: 'ESG Dashboard API', 
    version: '2.0.0',
    status: 'healthy',
    endpoints: ['/api/esg', '/api/kpi', '/api/analytics', '/api/reports', '/api/workflows', '/api/auth', '/api/session']
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/api/workflows', workflowRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/esg', esgRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/kpi', kpiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);

// Error Handler
app.use(errorHandler);

// 404 Handler
app.use((_req, res) => res.status(404).json({ success: false, error: 'Endpoint not found' }));

// Start Server
app.listen(PORT, async () => {
  console.log('Server running on port ' + PORT);
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ alter: false });
    console.log('Models synchronized');
  } catch (err) {
    console.error('DB error:', err.message);
  }
});

export default app;
