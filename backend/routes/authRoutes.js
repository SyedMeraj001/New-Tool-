// routes/authRoutes.js - Authentication API (ES Modules)
import express from 'express';
import jwt from 'jsonwebtoken';
import { sequelize } from '../models/index.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'esg-genius-super-secret-key';
const JWT_EXPIRES = '24h';

// POST /api/auth/login - User login with JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Query user from database
    const [users] = await sequelize.query(
      'SELECT id, email, full_name, role, is_active FROM users WHERE email = $1 AND password = $2',
      { bind: [email, password] }
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is pending approval or deactivated' });
    }

    // Verify role matches (if provided)
    if (role && user.role !== role) {
      return res.status(401).json({ success: false, message: `Invalid role. You are registered as ${user.role}` });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        fullName: user.full_name 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    console.log(`✅ Login successful: ${user.email} (${user.role})`);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me - Get current user from JWT
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch fresh user data
    const [users] = await sequelize.query(
      'SELECT id, email, full_name, role, is_active FROM users WHERE id = $1',
      { bind: [decoded.id] }
    );

    if (users.length === 0 || !users[0].is_active) {
      res.clearCookie('token');
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    const user = users[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    res.clearCookie('token');
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
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
