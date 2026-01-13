import Company from '../models/Company.js';
import Environmental from '../models/Environmental.js';
import Social from '../models/Social.js';
import Governance from '../models/Governance.js';
import Regulatory from '../models/Regulatory.js';

/**
 * Regulatory Compliance Calculator
 * Maps ESG data to regulatory requirements and calculates compliance scores
 */

class RegulatoryComplianceCalculator {

  /**
   * Get status thresholds for compliance scoring
   * This can be extended to load from configuration
   */
  static getStatusThresholds() {
    return {
      compliant: 80,
      inProgress: 50,
      reviewRequired: 25
    };
  }

  /**
   * Get regulatory requirements mapping
   * This can be extended to load from database or configuration
   */
  static getRegulatoryRequirements() {
    return {
      'CSRD': {
        environmental: {
          required: ['ghg_scope1_tco2e', 'energy_consumption_mwh', 'water_discharge_m3'],
          optional: ['mine_tailings_tonnes', 'land_rehabilitated_hectares', 'biodiversity_impact_score'],
          weight: 0.4
        },
        social: {
          required: ['total_mine_workers', 'female_workers_percent', 'safety_training_hours_per_worker'],
          optional: ['fatality_rate', 'lost_time_injury_rate', 'community_investment_usd'],
          weight: 0.3
        },
        governance: {
          required: ['board_size', 'independent_directors_percent', 'ethics_training_completion_percent'],
          optional: ['climate_risk_disclosure_score', 'sustainability_governance_score', 'corruption_incidents'],
          weight: 0.3
        }
      },
      'EU Taxonomy': {
        environmental: {
          required: ['ghg_scope1_tco2e', 'energy_consumption_mwh', 'mine_tailings_tonnes', 'land_rehabilitated_hectares'],
          optional: ['water_discharge_m3', 'biodiversity_impact_score'],
          weight: 0.6
        },
        social: {
          required: ['total_mine_workers', 'safety_training_hours_per_worker'],
          optional: ['female_workers_percent', 'community_investment_usd'],
          weight: 0.2
        },
        governance: {
          required: ['climate_risk_disclosure_score', 'sustainability_governance_score'],
          optional: ['board_size', 'independent_directors_percent'],
          weight: 0.2
        }
      },
      'SFDR': {
        environmental: {
          required: ['ghg_scope1_tco2e', 'energy_consumption_mwh'],
          optional: ['water_discharge_m3', 'biodiversity_impact_score'],
          weight: 0.3
        },
        social: {
          required: ['total_mine_workers', 'community_investment_usd'],
          optional: ['female_workers_percent', 'safety_training_hours_per_worker'],
          weight: 0.4
        },
        governance: {
          required: ['climate_risk_disclosure_score', 'ethics_training_completion_percent'],
          optional: ['board_size', 'independent_directors_percent', 'corruption_incidents'],
          weight: 0.3
        }
      },
      'SEC Climate Rules': {
        environmental: {
          required: ['ghg_scope1_tco2e', 'energy_consumption_mwh', 'mine_tailings_tonnes'],
          optional: ['water_discharge_m3', 'land_rehabilitated_hectares', 'biodiversity_impact_score'],
          weight: 0.5
        },
        social: {
          required: ['total_mine_workers', 'safety_training_hours_per_worker'],
          optional: ['female_workers_percent', 'community_investment_usd'],
          weight: 0.2
        },
        governance: {
          required: ['climate_risk_disclosure_score', 'sustainability_governance_score', 'board_size'],
          optional: ['independent_directors_percent', 'ethics_training_completion_percent'],
          weight: 0.3
        }
      }
    };
  }

  /**
   * Calculate compliance score for a specific regulation
   */
  static async calculateRegulationCompliance(companyId, regulationName) {
    try {
      const requirements = this.getRegulatoryRequirements()[regulationName];
      if (!requirements) {
        console.log(`No requirements defined for regulation: ${regulationName}`);
        return 0;
      }

      // Fetch company data
      const [environmental, social, governance] = await Promise.all([
        Environmental.findOne({ where: { company_id: companyId } }),
        Social.findOne({ where: { company_id: companyId } }),
        Governance.findOne({ where: { company_id: companyId } })
      ]);

      let totalScore = 0;
      let totalWeight = 0;

      // Calculate environmental compliance
      if (requirements.environmental) {
        const envScore = this.calculateCategoryCompliance(
          environmental,
          requirements.environmental.required,
          requirements.environmental.optional
        );
        totalScore += envScore * requirements.environmental.weight;
        totalWeight += requirements.environmental.weight;
      }

      // Calculate social compliance
      if (requirements.social) {
        const socialScore = this.calculateCategoryCompliance(
          social,
          requirements.social.required,
          requirements.social.optional
        );
        totalScore += socialScore * requirements.social.weight;
        totalWeight += requirements.social.weight;
      }

      // Calculate governance compliance
      if (requirements.governance) {
        const govScore = this.calculateCategoryCompliance(
          governance,
          requirements.governance.required,
          requirements.governance.optional
        );
        totalScore += govScore * requirements.governance.weight;
        totalWeight += requirements.governance.weight;
      }

      const finalScore = totalWeight > 0 ? Math.min(100, Math.round((totalScore / totalWeight) * 100)) : 0;

      console.log(`Calculated ${regulationName} compliance: ${finalScore}% for company ${companyId}`);
      return finalScore;

    } catch (error) {
      console.error(`Error calculating ${regulationName} compliance:`, error);
      return 0;
    }
  }

  /**
   * Calculate compliance for a specific ESG category
   */
  static calculateCategoryCompliance(data, requiredFields, optionalFields) {
    if (!data) return 0;

    let requiredScore = 0;
    let optionalScore = 0;

    // Check required fields (70% weight)
    const requiredCount = requiredFields.length;
    let requiredFilled = 0;

    requiredFields.forEach(field => {
      const value = data[field];
      if (value !== null && value !== undefined && value !== '' &&
          !(typeof value === 'string' && value.trim() === '')) {
        requiredFilled++;
      }
    });

    requiredScore = requiredCount > 0 ? (requiredFilled / requiredCount) * 70 : 0;

    // Check optional fields (30% weight)
    const optionalCount = optionalFields.length;
    let optionalFilled = 0;

    optionalFields.forEach(field => {
      const value = data[field];
      if (value !== null && value !== undefined && value !== '' &&
          !(typeof value === 'string' && value.trim() === '')) {
        optionalFilled++;
      }
    });

    optionalScore = optionalCount > 0 ? (optionalFilled / optionalCount) * 30 : 0;

    const totalScore = requiredScore + optionalScore;
    return Math.min(100, totalScore); // Cap at 100%
  }

  /**
   * Update all regulatory compliance scores for a company
   */
  static async updateAllRegulatoryCompliance(companyId) {
    try {
      console.log(`Updating regulatory compliance for company ${companyId}`);

      // Get all regulatory records for this company
      let regulatoryRecords = await Regulatory.findAll({
        where: { company_id: companyId },
        attributes: ['name']
      });

      // If no regulatory records exist, create them
      if (regulatoryRecords.length === 0) {
        const defaultRegulations = [
          {
            name: 'CSRD',
            description: 'Corporate Sustainability Reporting Directive',
            status: 'Pending',
            progress: 0,
            priority: 'High',
            deadline: '2026-06-30',
            category: 'Reporting',
            icon: '📊',
            color: 'blue',
            notes: 'EU directive requiring companies to report on sustainability matters',
            company_id: companyId
          },
          {
            name: 'EU Taxonomy',
            description: 'EU Sustainable Finance Taxonomy',
            status: 'Pending',
            progress: 0,
            priority: 'High',
            deadline: '2026-12-31',
            category: 'Environmental',
            icon: 'EU',
            color: 'green',
            notes: 'Classification system for environmentally sustainable economic activities',
            company_id: companyId
          },
          {
            name: 'SFDR',
            description: 'Sustainable Finance Disclosure Regulation',
            status: 'Pending',
            progress: 0,
            priority: 'Medium',
            deadline: '2026-09-15',
            category: 'Environmental',
            icon: '🏦',
            color: 'orange',
            notes: 'EU regulation on sustainability-related disclosures in the financial services sector',
            company_id: companyId
          },
          {
            name: 'SEC Climate Rules',
            description: 'SEC Climate-Related Disclosures',
            status: 'Pending',
            progress: 0,
            priority: 'High',
            deadline: '2026-11-30',
            category: 'Environmental',
            icon: '🏛️',
            color: 'red',
            notes: 'SEC rules requiring public companies to disclose climate-related risks',
            company_id: companyId
          }
        ];
        
        await Regulatory.bulkCreate(defaultRegulations);
        console.log(`✅ Created regulatory records for company ${companyId}`);
        
        regulatoryRecords = defaultRegulations.map(reg => ({ name: reg.name }));
      }

      const regulationNames = regulatoryRecords.map(record => record.name);
      const updates = [];

      for (const regulationName of regulationNames) {
        const complianceScore = await this.calculateRegulationCompliance(companyId, regulationName);

        // Determine status based on score
        const thresholds = this.getStatusThresholds();
        let status = 'Pending';
        if (complianceScore >= thresholds.compliant) status = 'Compliant';
        else if (complianceScore >= thresholds.inProgress) status = 'In Progress';
        else if (complianceScore >= thresholds.reviewRequired) status = 'Review Required';

        updates.push({
          name: regulationName,
          progress: complianceScore,
          status: status
        });

        console.log(`Updated ${regulationName}: ${complianceScore}% - ${status}`);
      }

      // Update regulatory records in database
      for (const update of updates) {
        await Regulatory.update(
          { 
            progress: update.progress, 
            status: update.status,
            updatedAt: new Date() // Force update timestamp
          },
          {
            where: {
              company_id: companyId,
              name: update.name
            }
          }
        );
      }

      console.log(`Successfully updated all regulatory compliance for company ${companyId}`);
      return updates;

    } catch (error) {
      console.error('Error updating regulatory compliance:', error);
      throw error;
    }
  }

  /**
   * Get compliance summary for a company
   */
  static async getComplianceSummary(companyId) {
    try {
      const regulations = await Regulatory.findAll({
        where: { company_id: companyId },
        order: [['deadline', 'ASC']]
      });

      if (regulations.length === 0) {
        return {
          overallCompliance: 0,
          compliantCount: 0,
          inProgressCount: 0,
          pendingCount: 0,
          reviewRequiredCount: 0,
          regulations: []
        };
      }

      const compliantCount = regulations.filter(r => r.status === 'Compliant').length;
      const inProgressCount = regulations.filter(r => r.status === 'In Progress').length;
      const pendingCount = regulations.filter(r => r.status === 'Pending').length;
      const reviewRequiredCount = regulations.filter(r => r.status === 'Review Required').length;

      const totalProgress = regulations.reduce((sum, reg) => sum + reg.progress, 0);
      const overallCompliance = Math.round(totalProgress / regulations.length);

      return {
        overallCompliance,
        compliantCount,
        inProgressCount,
        pendingCount,
        reviewRequiredCount,
        regulations: regulations.map(reg => ({
          id: reg.id,
          name: reg.name,
          status: reg.status,
          progress: reg.progress,
          priority: reg.priority,
          deadline: reg.deadline,
          category: reg.category
        }))
      };

    } catch (error) {
      console.error('Error getting compliance summary:', error);
      throw error;
    }
  }
}

export default RegulatoryComplianceCalculator;