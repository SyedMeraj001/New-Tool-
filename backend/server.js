// server.js - Main Entry Point (ES Modules)
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';
import corsMiddleware from './middleware/cors.js';
import errorHandler from './middleware/errorHandler.js';

// Your routes (Venkat)
import workflowRoutes from './routes/workflowRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import esgRoutes from './routes/esgRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import kpiRoutes from './routes/kpiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

// Team routes
import authTeamRoutes from './routes/auth.js';
import companyRoutes from './routes/companyRoutes.js';
import environmentalRoutes from './routes/environmentalRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import governanceRoutes from './routes/governanceRoutes.js';
import submitRoutes from './routes/submitRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import complianceRoutes from './routes/compliance.js';
import requirementsRoutes from './routes/requirements.js';
import kpisTeamRoutes from './routes/kpis.js';
import reportTeamRoutes from './routes/reportRoutes.js';
import stakeholderRoutes from './routes/stakeholderRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (_req, res) => res.json({ message: 'ESG Dashboard API', status: 'healthy' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/workflows', workflowRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/esg', esgRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/kpi', kpiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/auth', authTeamRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/environmental', environmentalRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/submit', submitRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/requirements', requirementsRoutes);
app.use('/api/kpis-team', kpisTeamRoutes);
app.use('/api/report-team', reportTeamRoutes);
app.use('/api/stakeholders', stakeholderRoutes);

app.use(errorHandler);
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, async () => {
  console.log('Server running on port ' + PORT);
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error('DB error:', err.message);
  }
});

export default app;
