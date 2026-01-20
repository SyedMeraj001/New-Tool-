// routes/sessionRoutes.js - Secure Session Management (ES Modules)
import express from 'express';
import { UserSession, UserPreference, ValidationResult, SafetyCompliance, generateSessionToken, sequelize } from '../models/index.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Create secure session (login)
router.post('/create', async (req, res) => {
  try {
    const { email, role, userId } = req.body;
    
    // Generate secure token
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    // Invalidate old sessions for this user
    await UserSession.update(
      { isActive: false },
      { where: { email, isActive: true } }
    );
    
    // Create new session
    const session = await UserSession.create({
      userId: userId || token.substring(0, 36),
      email,
      role,
      token,
      expiresAt,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });
    
    res.json({ 
      success: true, 
      data: { 
        token: session.token,
        expiresAt: session.expiresAt,
        email: session.email,
        role: session.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validate session token
router.get('/validate/:token', async (req, res) => {
  try {
    const session = await UserSession.findOne({
      where: { token: req.params.token, isActive: true }
    });
    
    if (!session) {
      return res.status(401).json({ success: false, error: 'Invalid session' });
    }
    
    if (new Date() > session.expiresAt) {
      await session.update({ isActive: false });
      return res.status(401).json({ success: false, error: 'Session expired' });
    }
    
    res.json({ 
      success: true, 
      data: { 
        email: session.email, 
        role: session.role,
        userId: session.userId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Logout (invalidate session)
router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;
    await UserSession.update({ isActive: false }, { where: { token } });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get/Create user preferences
router.get('/preferences/:email', async (req, res) => {
  try {
    let prefs = await UserPreference.findOne({ where: { email: req.params.email } });
    
    if (!prefs) {
      prefs = await UserPreference.create({
        userId: req.params.email,
        email: req.params.email,
      });
    }
    
    res.json({ success: true, data: prefs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user preferences
router.put('/preferences/:email', async (req, res) => {
  try {
    const { theme, companyName, currentSector, twoFactorEnabled, twoFactorMethod, encryptionEnabled, settings } = req.body;
    
    let prefs = await UserPreference.findOne({ where: { email: req.params.email } });
    
    if (!prefs) {
      prefs = await UserPreference.create({
        userId: req.params.email,
        email: req.params.email,
        theme, companyName, currentSector, twoFactorEnabled, twoFactorMethod, encryptionEnabled, settings
      });
    } else {
      await prefs.update({ theme, companyName, currentSector, twoFactorEnabled, twoFactorMethod, encryptionEnabled, settings });
    }
    
    res.json({ success: true, data: prefs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save validation result
router.post('/validation', async (req, res) => {
  try {
    const { userId, score, completeness, errors, warnings, suggestions, details } = req.body;
    
    const result = await ValidationResult.create({
      userId, score, completeness, errors, warnings, suggestions, details
    });
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get validation results for user
router.get('/validation/:userId', async (req, res) => {
  try {
    const results = await ValidationResult.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get/Create safety compliance data
router.get('/safety/:userId', async (req, res) => {
  try {
    let safety = await SafetyCompliance.findOne({ where: { userId: req.params.userId } });
    
    if (!safety) {
      safety = await SafetyCompliance.create({ userId: req.params.userId });
    }
    
    res.json({ success: true, data: safety });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update safety compliance data
router.put('/safety/:userId', async (req, res) => {
  try {
    const { riskGuidelines, emergencyContacts, travelInsurances, documents, safetyChecklist, healthTips, travelTips } = req.body;
    
    let safety = await SafetyCompliance.findOne({ where: { userId: req.params.userId } });
    
    if (!safety) {
      safety = await SafetyCompliance.create({
        userId: req.params.userId,
        riskGuidelines, emergencyContacts, travelInsurances, documents, safetyChecklist, healthTips, travelTips
      });
    } else {
      await safety.update({ riskGuidelines, emergencyContacts, travelInsurances, documents, safetyChecklist, healthTips, travelTips });
    }
    
    res.json({ success: true, data: safety });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
