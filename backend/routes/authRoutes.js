// routes/authRoutes.js - Secure Authentication API (ES Modules)
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sequelize } from '../models/index.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'esg-genius-super-secret-key-change-in-production';
const JWT_EXPIRES = '24h';
const SALT_ROUNDS = 12;

// POST /api/auth/login - Secure login with hashed password
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Get user from database
    const [users] = await sequelize.query(
      'SELECT id, email, full_name, role, password, is_active FROM users WHERE email = $1',
      { bind: [email] }
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is pending approval or deactivated' });
    }

    // Verify password - check if hashed or plain text (for migration)
    let passwordValid = false;
    if (user.password.startsWith('$2')) {
      // Password is hashed with bcrypt
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password (legacy) - verify and hash it
      if (user.password === password) {
        passwordValid = true;
        // Hash the password for future logins
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await sequelize.query(
          'UPDATE users SET password = $1 WHERE id = $2',
          { bind: [hashedPassword, user.id] }
        );
        console.log(`🔐 Password hashed for user: ${user.email}`);
      }
    }

    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
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

    // Store session in database
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    await sequelize.query(
      `INSERT INTO user_sessions (id, "userId", email, role, token, "expiresAt", "ipAddress", "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
       ON CONFLICT (token) DO UPDATE SET "isActive" = true, "updatedAt" = NOW()`,
      { bind: [sessionId, user.id.toString(), user.email, user.role, token, expiresAt, req.ip] }
    );

    // Set HTTP-only secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    console.log(`✅ Secure login: ${user.email} (${user.role})`);

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
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/auth/me - Get current user from JWT (no localStorage needed)
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.clearCookie('token');
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    // Verify session exists in database
    const [sessions] = await sequelize.query(
      'SELECT * FROM user_sessions WHERE token = $1 AND "isActive" = true AND "expiresAt" > NOW()',
      { bind: [token] }
    );

    if (sessions.length === 0) {
      res.clearCookie('token');
      return res.status(401).json({ success: false, message: 'Session expired or invalid' });
    }

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
    console.error('Auth check error:', error);
    res.clearCookie('token');
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
});

// POST /api/auth/logout - Secure logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.token;
    
    if (token) {
      // Invalidate session in database
      await sequelize.query(
        'UPDATE user_sessions SET "isActive" = false, "updatedAt" = NOW() WHERE token = $1',
        { bind: [token] }
      );
    }
    
    res.clearCookie('token', { path: '/' });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.clearCookie('token', { path: '/' });
    res.json({ success: true, message: 'Logged out' });
  }
});


// GET /api/auth/users - Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const [users] = await sequelize.query(
      'SELECT id, email, full_name, role, is_active, created_at FROM users ORDER BY role, email'
    );
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/register - Register new user with hashed password
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, role, contactNumber } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if user exists
    const [existing] = await sequelize.query('SELECT id FROM users WHERE email = $1', { bind: [email] });
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await sequelize.query(
      `INSERT INTO users (email, password, full_name, role, contact_number, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW()) 
       RETURNING id, email, full_name, role`,
      { bind: [email, hashedPassword, fullName, role, contactNumber || null] }
    );

    res.status(201).json({ 
      success: true, 
      data: result[0], 
      message: 'Registration successful. Awaiting admin approval.' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
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

// POST /api/auth/change-password - Change password (authenticated)
router.post('/change-password', async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password required' });
    }

    // Get user
    const [users] = await sequelize.query(
      'SELECT id, password FROM users WHERE id = $1',
      { bind: [decoded.id] }
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, users[0].password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await sequelize.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      { bind: [hashedPassword, decoded.id] }
    );

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
