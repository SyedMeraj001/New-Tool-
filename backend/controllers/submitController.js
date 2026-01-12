import Company from "../models/Company.js";
import Regulatory from "../models/Regulatory.js";
import RegulatoryComplianceCalculator from "../utils/regulatoryComplianceCalculator.js";

const submitAssessment = async (req, res) => {
  try {
    console.log('Submit assessment called for company:', req.params.companyId);
    const companyId = req.params.companyId;
    
    // Update company status
    await Company.update(
      { status: "SUBMITTED" },
      { where: { id: companyId } }
    );

    // Get company data to determine which regulatory frameworks to create
    const company = await Company.findByPk(companyId);
    console.log('Company found:', company ? company.company_name : 'Not found');
    console.log('Company framework:', company ? company.primary_framework : 'No framework');
    
    if (company) {
      // Create all regulatory records regardless of framework
      const regulatoryRecords = [
        {
          name: 'EU Taxonomy',
          description: 'EU Sustainable Finance Taxonomy',
          status: 'In Progress',
          progress: 72,
          priority: 'High',
          deadline: '2024-12-31',
          category: 'Environmental',
          icon: 'EU',
          color: 'green',
          notes: 'Classification system for environmentally sustainable economic activities',
          company_id: companyId
        },
        {
          name: 'CSRD',
          description: 'Corporate Sustainability Reporting Directive',
          status: 'In Progress',
          progress: 72,
          priority: 'Critical',
          deadline: '2024-06-30',
          category: 'Reporting',
          icon: '📊',
          color: 'blue',
          notes: 'EU directive requiring companies to report on sustainability matters',
          company_id: companyId
        },
        {
          name: 'SFDR',
          description: 'Sustainable Finance Disclosure Regulation',
          status: 'In Progress',
          progress: 72,
          priority: 'Medium',
          deadline: '2024-09-15',
          category: 'Financial',
          icon: '💰',
          color: 'orange',
          notes: 'EU regulation on sustainability-related disclosures in the financial services sector',
          company_id: companyId
        },
        {
          name: 'SEC Climate Rules',
          description: 'SEC Climate-Related Disclosures',
          status: 'In Progress',
          progress: 72,
          priority: 'High',
          deadline: '2024-11-30',
          category: 'Climate',
          icon: '🏦',
          color: 'red',
          notes: 'SEC rules requiring public companies to disclose climate-related risks and greenhouse gas emissions',
          company_id: companyId
        }
      ];
      
      // Create all regulatory records
      if (regulatoryRecords.length > 0) {
        const createdRecords = await Regulatory.bulkCreate(regulatoryRecords, { ignoreDuplicates: true });
        console.log(`Created ${createdRecords.length} regulatory records for company ${companyId}`);

        // Calculate and update regulatory compliance based on submitted data
        try {
          await RegulatoryComplianceCalculator.updateAllRegulatoryCompliance(companyId);
          console.log(`Updated regulatory compliance scores for company ${companyId}`);
        } catch (complianceError) {
          console.error('Error updating regulatory compliance:', complianceError);
          // Don't fail the submission if compliance calculation fails
        }
      }
    }

    res.json({
      success: true,
      message: "Assessment submitted successfully",
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { submitAssessment };
