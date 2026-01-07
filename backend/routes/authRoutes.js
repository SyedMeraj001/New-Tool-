// routes/authRoutes.js - Authentication API (ES Modules)
import express from 'express';
import { sequelize } from '../models/index.js';

const router = express.Router();

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const [users] = await sequelize.query(
      'SELECT id, email, full_name, role FROM users WHERE email = $1 AND password = $2 AND is_active = true',
      { bind: [email, password] }
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const user = users[0];
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/users - Get all users (admin only)
router.get('/users', async (_req, res) => {
  try {
    const [users] = await sequelize.query(
      'SELECT id, email, full_name, role, is_active, created_at FROM users ORDER BY role, email'
    );
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/users/stats - Get user statistics
router.get('/users/stats', async (_req, res) => {
  try {
    const [stats] = await sequelize.query(
      'SELECT role, COUNT(*) as count FROM users WHERE is_active = true GROUP BY role'
    );
    const total = stats.reduce((sum, s) => sum + parseInt(s.count), 0);
    res.json({ success: true, data: { stats, total } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/register - Register new user (pending approval)
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Check if user exists
    const [existing] = await sequelize.query('SELECT id FROM users WHERE email = $1', { bind: [email] });
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const [result] = await sequelize.query(
      'INSERT INTO users (email, password, full_name, role, is_active) VALUES ($1, $2, $3, $4, false) RETURNING id, email, full_name, role',
      { bind: [email, password, fullName, role] }
    );

    res.status(201).json({ success: true, data: result[0], message: 'Registration pending approval' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/auth/users/:id/activate - Activate/deactivate user
router.patch('/users/:id/activate', async (req, res) => {
  try {
    const { isActive } = req.body;
    const [result] = await sequelize.query(
      'UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, is_active',
      { bind: [isActive, req.params.id] }
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
