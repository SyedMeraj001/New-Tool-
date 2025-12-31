/*const API_BASE = 'http://localhost:3001/api';

class APIService {
  static async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });
      return response.ok ? await response.json() : { error: 'API Error' };
    } catch (error) {
      console.warn('API unavailable:', error.message);
      return { error: 'Backend offline' };
    }
  }

  // ERP Integration
  static configureERP(config) {
    return this.request('/integrations/erp/configure', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  static syncERP() {
    return this.request('/integrations/erp/sync', { method: 'POST' });
  }

  // HR Integration  
  static configureHR(config) {
    return this.request('/integrations/hr/configure', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  static syncHR() {
    return this.request('/integrations/hr/sync', { method: 'POST' });
  }

  // Integration Status
  static getIntegrationStatus() {
    return this.request('/integrations/status');
  }

  // ESG Data Management
  static async saveESGData(data) {
    try {
      const response = await this.request('/esg/data', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to save ESG data:', error);
      return false;
    }
  }

  // Compliance Validation
  static validateCompliance(data) {
    return this.request('/compliance/validate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // GHG Calculations
  static calculateGHG(data) {
    return this.request('/ghg/calculate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // ESG Data Management
  static saveESGData(data) {
    return this.request('/esg/data', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static getESGData(userId) {
    return this.request(`/esg/data/${userId}`);
  }

  static getESGScores(userId) {
    return this.request(`/esg/scores/${userId}`);
  }

  static getESGKPIs(userId) {
    return this.request(`/esg/kpis/${userId}`);
  }

  // Analytics Data
  static getAnalyticsData(userId) {
    return this.request(`/esg/analytics/${userId}`);
  }
}

export default APIService;
*/
//const API_BASE = process.env.REACT_APP_API_URL + "/api";
const API_BASE = process.env.REACT_APP_API_URL + "/api";

class APIService {
  static async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
        ...options,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "API Error");
      return data;
    } catch (error) {
      console.warn("❌ API Error:", error.message);
      throw error;
    }
  }

  // =========================
  // AUTH
  // =========================
  static login(payload) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // =========================
  // COMPANY (STEP 1)
  // =========================
  static saveCompany(data) {
    return this.request("/company", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
static getCompanyByYear(year) {
  return this.request(`/company/year/${year}`);

}


  // =========================
  // ENVIRONMENTAL (STEP 2)
  // =========================
  static saveEnvironmental(data) {
    return this.request("/environmental", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static getEnvironmental(companyId) {
    return this.request(`/environmental/${companyId}`);
  }

  // =========================
  // SOCIAL (STEP 3)
  // =========================
  static saveSocial(data) {
    return this.request("/social", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static getSocial(companyId) {
    return this.request(`/social/${companyId}`);
  }

  // =========================
  // GOVERNANCE (STEP 4)
  // =========================
  static saveGovernance(data) {
    return this.request("/governance", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static getGovernance(companyId) {
    return this.request(`/governance/${companyId}`);
  }
}

export default APIService;
