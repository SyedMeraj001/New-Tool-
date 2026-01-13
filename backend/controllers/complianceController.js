import Compliance from '../models/Compliance.js';

// Calculate compliance score based on regulation progress
const calculateComplianceScore = async () => {
  const regulations = await Compliance.findAll();
  if (!regulations || regulations.length === 0) return 0;
  
  const totalProgress = regulations.reduce((sum, reg) => sum + (reg.progress || 0), 0);
  return Math.round(totalProgress / regulations.length);
};

// Get compliance risk level based on score
const getRiskLevel = (score) => {
  if (score >= 80) return { level: 'Low', color: 'green' };
  if (score >= 60) return { level: 'Medium', color: 'yellow' };
  if (score >= 40) return { level: 'High', color: 'orange' };
  return { level: 'Critical', color: 'red' };
};

// Generate compliance recommendations
const generateRecommendations = async () => {
  const regulations = await Compliance.findAll();
  const recommendations = [];
  
  regulations.forEach(reg => {
    if (reg.progress < 50) {
      recommendations.push({
        regulation: reg.name,
        priority: 'High',
        action: `Immediate attention required for ${reg.name}`,
        deadline: reg.deadline
      });
    } else if (reg.progress < 80) {
      recommendations.push({
        regulation: reg.name,
        priority: 'Medium', 
        action: `Continue progress on ${reg.name}`,
        deadline: reg.deadline
      });
    }
  });
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

// Validate regulation data
const validateRegulationData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Regulation name is required');
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required');
  }
  
  if (!data.deadline) {
    errors.push('Deadline is required');
  } else {
    const deadline = new Date(data.deadline);
    if (isNaN(deadline.getTime())) {
      errors.push('Invalid deadline format');
    }
  }
  
  if (data.progress !== undefined) {
    const progress = Number(data.progress);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      errors.push('Progress must be a number between 0 and 100');
    }
  }
  
  return errors;
};

// Get compliance dashboard data
// Export individual functions
export const validateCompliance = async (req, res) => {
  try {
    const { framework = 'GRI', companyId } = req.query;
    
    // Get all compliance records
    const regulations = await Compliance.findAll({
      where: companyId ? { company_id: companyId } : {}
    });
    
    // Framework-specific validation rules
    const frameworkRules = {
      GRI: {
        required: ['Environmental Policy', 'Social Impact Assessment', 'Board Governance'],
        categories: ['Environmental', 'Social', 'Governance'],
        minProgress: 80
      },
      SASB: {
        required: ['Material ESG Metrics', 'Industry Standards', 'Risk Management'],
        categories: ['Environmental', 'Social', 'Governance'],
        minProgress: 75
      },
      TCFD: {
        required: ['Climate Risk Assessment', 'Governance Structure', 'Strategy Disclosure'],
        categories: ['Environmental', 'Governance'],
        minProgress: 85
      },
      BRSR: {
        required: ['Business Responsibility', 'Stakeholder Engagement', 'ESG Performance'],
        categories: ['Environmental', 'Social', 'Governance'],
        minProgress: 70
      }
    };
    
    const rules = frameworkRules[framework] || frameworkRules.GRI;
    const validationResults = {
      framework,
      overallCompliance: 0,
      status: 'Non-Compliant',
      issues: [],
      recommendations: [],
      categoryScores: {},
      missingRequirements: [],
      passedChecks: [],
      totalChecks: 0,
      passedCount: 0
    };
    
    // Check required regulations
    rules.required.forEach(req => {
      const found = regulations.find(r => r.name.includes(req) || r.description.includes(req));
      validationResults.totalChecks++;
      
      if (!found) {
        validationResults.issues.push(`Missing required regulation: ${req}`);
        validationResults.missingRequirements.push(req);
        validationResults.recommendations.push(`Implement ${req} to meet ${framework} standards`);
      } else if (found.progress < rules.minProgress) {
        validationResults.issues.push(`${req} progress (${found.progress}%) below minimum (${rules.minProgress}%)`);
        validationResults.recommendations.push(`Complete ${req} to reach ${rules.minProgress}% progress`);
      } else {
        validationResults.passedChecks.push(req);
        validationResults.passedCount++;
      }
    });
    
    // Calculate category scores
    rules.categories.forEach(category => {
      const categoryRegs = regulations.filter(r => r.category === category);
      if (categoryRegs.length > 0) {
        const avgProgress = categoryRegs.reduce((sum, reg) => sum + reg.progress, 0) / categoryRegs.length;
        validationResults.categoryScores[category] = Math.round(avgProgress);
        
        if (avgProgress < rules.minProgress) {
          validationResults.issues.push(`${category} category average (${Math.round(avgProgress)}%) below minimum`);
          validationResults.recommendations.push(`Improve ${category} metrics to meet ${framework} requirements`);
        }
      } else {
        validationResults.categoryScores[category] = 0;
        validationResults.issues.push(`No regulations found for ${category} category`);
        validationResults.recommendations.push(`Add ${category} regulations for ${framework} compliance`);
      }
    });
    
    // Calculate overall compliance
    if (regulations.length > 0) {
      validationResults.overallCompliance = Math.round(
        regulations.reduce((sum, reg) => sum + reg.progress, 0) / regulations.length
      );
    }
    
    // Determine compliance status
    if (validationResults.overallCompliance >= rules.minProgress && validationResults.issues.length === 0) {
      validationResults.status = 'Fully Compliant';
    } else if (validationResults.overallCompliance >= rules.minProgress * 0.8) {
      validationResults.status = 'Mostly Compliant';
    } else if (validationResults.overallCompliance >= rules.minProgress * 0.6) {
      validationResults.status = 'Partially Compliant';
    } else {
      validationResults.status = 'Non-Compliant';
    }
    
    res.json({
      success: true,
      data: validationResults
    });
    
  } catch (error) {
    console.error('Error validating compliance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate compliance',
      error: error.message
    });
  }
};

export const getComplianceDashboard = async (req, res) => {
  try {
    const regulations = await Compliance.findAll({
      order: [['deadline', 'ASC']]
    });
    
    const complianceScore = await calculateComplianceScore();
    const recommendations = await generateRecommendations();
    
    const dashboard = {
      summary: {
        overallScore: complianceScore,
        riskLevel: getRiskLevel(complianceScore),
        totalRegulations: regulations.length,
        compliantCount: regulations.filter(r => r.status === 'Compliant').length,
        pendingCount: regulations.filter(r => r.status === 'Pending').length
      },
      regulations: regulations.map(reg => ({
        ...reg.toJSON(),
        risk: getRiskLevel(reg.progress || 0),
        daysUntilDeadline: Math.ceil((new Date(reg.deadline) - new Date()) / (1000 * 60 * 60 * 24))
      })),
      recommendations: recommendations.slice(0, 5),
      upcomingDeadlines: regulations
        .filter(r => {
          const daysUntil = Math.ceil((new Date(r.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          return daysUntil <= 30 && daysUntil > 0;
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    };
    
    res.json({
      success: true,
      data: dashboard
    });
    
  } catch (error) {
    console.error('Error getting compliance dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get compliance dashboard',
      error: error.message
    });
  }
};

export default {
  getComplianceDashboard,
  calculateComplianceScore,
  getRiskLevel,
  generateRecommendations,
  validateRegulationData,
  validateCompliance
};