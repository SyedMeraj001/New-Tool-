// services/secureStorage.js - Secure Storage Service (Database-backed)
// Replaces localStorage with secure database storage

const API_BASE = 'http://localhost:5000/api';

class SecureStorageService {
  constructor() {
    this.sessionToken = null;
    this.userEmail = null;
    this.userRole = null;
  }

  // Session Management
  async createSession(email, role, userId) {
    try {
      const response = await fetch(`${API_BASE}/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, userId })
      });
      const data = await response.json();
      
      if (data.success) {
        this.sessionToken = data.data.token;
        this.userEmail = data.data.email;
        this.userRole = data.data.role;
        
        // Store only the session token in sessionStorage (cleared on browser close)
        sessionStorage.setItem('sessionToken', data.data.token);
        
        return data.data;
      }
      return null;
    } catch (error) {
      console.error('Session creation failed:', error);
      return null;
    }
  }

  async validateSession() {
    try {
      const token = sessionStorage.getItem('sessionToken');
      if (!token) return null;

      const response = await fetch(`${API_BASE}/session/validate/${token}`);
      const data = await response.json();
      
      if (data.success) {
        this.sessionToken = token;
        this.userEmail = data.data.email;
        this.userRole = data.data.role;
        return data.data;
      }
      
      // Invalid session, clear token
      sessionStorage.removeItem('sessionToken');
      return null;
    } catch (error) {
      console.error('Session validation failed:', error);
      return null;
    }
  }

  async logout() {
    try {
      const token = sessionStorage.getItem('sessionToken');
      if (token) {
        await fetch(`${API_BASE}/session/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      }
      
      sessionStorage.removeItem('sessionToken');
      this.sessionToken = null;
      this.userEmail = null;
      this.userRole = null;
      
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }

  // User Preferences (stored in database)
  async getPreferences(email) {
    try {
      const response = await fetch(`${API_BASE}/session/preferences/${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Get preferences failed:', error);
      return null;
    }
  }

  async updatePreferences(email, preferences) {
    try {
      const response = await fetch(`${API_BASE}/session/preferences/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Update preferences failed:', error);
      return null;
    }
  }

  // Validation Results (stored in database)
  async saveValidationResult(userId, result) {
    try {
      const response = await fetch(`${API_BASE}/session/validation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...result })
      });
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Save validation failed:', error);
      return null;
    }
  }

  async getValidationResults(userId) {
    try {
      const response = await fetch(`${API_BASE}/session/validation/${encodeURIComponent(userId)}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Get validation results failed:', error);
      return [];
    }
  }

  // Safety Compliance Data (stored in database)
  async getSafetyData(userId) {
    try {
      const response = await fetch(`${API_BASE}/session/safety/${encodeURIComponent(userId)}`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Get safety data failed:', error);
      return null;
    }
  }

  async updateSafetyData(userId, safetyData) {
    try {
      const response = await fetch(`${API_BASE}/session/safety/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(safetyData)
      });
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Update safety data failed:', error);
      return null;
    }
  }

  // Getters for current session
  getCurrentUser() {
    return this.userEmail;
  }

  getCurrentRole() {
    return this.userRole;
  }

  isAuthenticated() {
    return !!this.sessionToken;
  }
}

// Singleton instance
const secureStorage = new SecureStorageService();
export default secureStorage;
