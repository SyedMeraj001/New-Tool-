import express from 'express';
import { models } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET /api/kpi/:companyId - Calculate real-time KPIs
router.get('/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Get data from all models
    const [wasteData, workforceData, safetyData, ethicsData, airData] = await Promise.all([
      models.WasteData?.findAll({ where: { companyId } }) || [],
      models.WorkforceData?.findAll({ where: { companyId } }) || [],
      models.SafetyIncidents?.findAll({ where: { companyId } }) || [],
      models.EthicsCompliance?.findAll({ where: { companyId } }) || [],
      models.AirQualityData?.findAll({ where: { companyId } }) || []
    ]);

    // Calculate scores
    const environmental = calculateEnvironmentalScore(wasteData, airData);
    const social = calculateSocialScore(workforceData, safetyData);
    const governance = calculateGovernanceScore(ethicsData);
    const overall = (environmental + social + governance) / 3;
    const totalEntries = wasteData.length + workforceData.length + safetyData.length + ethicsData.length + airData.length;

    res.json({
      success: true,
      data: {
        overall: Math.round(overall),
        environmental: Math.round(environmental),
        social: Math.round(social),
        governance: Math.round(governance),
        complianceRate: calculateComplianceRate(ethicsData),
        totalEntries
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function calculateEnvironmentalScore(wasteData, airData) {
  if (!wasteData.length && !airData.length) return 0;
  
  let score = 0;
  let factors = 0;
  
  if (wasteData.length > 0) {
    const avgRecycling = wasteData.reduce((sum, item) => sum + (item.recyclingRate || 0), 0) / wasteData.length;
    score += Math.min(avgRecycling * 1.2, 100);
    factors++;
  }
  
  if (airData.length > 0) {
    const compliantAir = airData.filter(item => item.complianceStatus === 'compliant').length;
    score += (compliantAir / airData.length) * 100;
    factors++;
  }
  
  return factors > 0 ? score / factors : 0;
}

function calculateSocialScore(workforceData, safetyData) {
  if (!workforceData.length) return 0;
  
  const diversityScore = calculateDiversityScore(workforceData);
  const safetyScore = safetyData.length === 0 ? 100 : Math.max(100 - (safetyData.length * 5), 0);
  
  return (diversityScore + safetyScore) / 2;
}

function calculateGovernanceScore(ethicsData) {
  if (!ethicsData.length) return 0;
  
  const avgScore = ethicsData.reduce((sum, item) => sum + (item.auditScore || 0), 0) / ethicsData.length;
  return avgScore;
}

function calculateDiversityScore(workforceData) {
  const genderCounts = {};
  workforceData.forEach(emp => {
    genderCounts[emp.gender || 'unknown'] = (genderCounts[emp.gender || 'unknown'] || 0) + 1;
  });
  
  const total = workforceData.length;
  const diversity = Object.values(genderCounts).reduce((sum, count) => {
    const ratio = count / total;
    return sum - (ratio * Math.log2(ratio || 1));
  }, 0);
  
  return Math.min(diversity * 50, 100);
}

function calculateComplianceRate(ethicsData) {
  if (!ethicsData.length) return 0;
  
  const compliant = ethicsData.filter(item => item.complianceStatus === 'compliant').length;
  return Math.round((compliant / ethicsData.length) * 100);
}

export default router;