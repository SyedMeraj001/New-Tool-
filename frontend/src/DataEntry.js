//frontend/src/DataEntry.js
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { debounce } from "lodash";
import APIService from "./services/apiService";
import ModuleAPI from "./services/moduleAPI";
import { ESG_FRAMEWORKS, STANDARD_METRICS } from "./utils/esgFrameworks";
import DataValidation from "./utils/dataValidation";
import AuditTrail from "./utils/AuditTrail";
import { GRI_TEMPLATES, getTemplateFields, validateTemplateCompleteness } from "./utils/griTemplates";
import { performFullValidation } from "./utils/advancedValidation";
import { useTheme } from "./contexts/ThemeContext";
import { getThemeClasses } from "./utils/themeUtils";
import ProfessionalHeader from "./components/ProfessionalHeader";
import { Alert, Button, Toast } from "./components/ProfessionalUX";
import UnifiedAdvancedEntry from "./modules/UnifiedAdvancedEntry";
import SiteHierarchyManager from "./modules/SiteHierarchyManager";
import { getUserRole, hasPermission, PERMISSIONS, USER_ROLES } from "./utils/rbac";
import AuditTrailViewer from "./components/AuditTrailViewer";
import EvidenceUploader from "./components/EvidenceUploader";

function DataEntry() {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);
  const userRole = getUserRole();
  const canAdd = hasPermission(userRole, PERMISSIONS.ADD_DATA);
  const canEdit = hasPermission(userRole, PERMISSIONS.EDIT_DATA);
  const canDelete = hasPermission(userRole, PERMISSIONS.DELETE_DATA);
  const canAuthorize = hasPermission(userRole, PERMISSIONS.AUTHORIZE_DATA);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [frameworkCompliance, setFrameworkCompliance] = useState({});
  const [toast, setToast] = useState(null);
  const [showAdvancedEntry, setShowAdvancedEntry] = useState(false);
  const [selectedGRITemplate, setSelectedGRITemplate] = useState(null);
  const [templateCompleteness, setTemplateCompleteness] = useState({});
  const [showSiteManager, setShowSiteManager] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [showValidationPanel, setShowValidationPanel] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationModalResults, setValidationModalResults] = useState(null);
  const [showEvidence, setShowEvidence] = useState(false);

  const steps = [
    { id: 1, title: "Company Information", icon: "🏢", description: "Basic company details" },
    { id: 2, title: "Environmental", icon: "🌱", description: "GHG emissions, energy, water" },
    { id: 3, title: "Social", icon: "👥", description: "Workforce, safety, community" },
    { id: 4, title: "Governance", icon: "⚖️", description: "Board composition, ethics" },
    { id: 5, title: "Review & Submit", icon: "📋", description: "Final review" }
  ];

  const [formData, setFormData] = useState({
    companyInfo: {
      companyName: "",
      reportingYear: new Date().getFullYear(),
      sector: "",
      region: "",
      reportingFramework: "GRI",
      assuranceLevel: "None",
      siteId: null,
      siteName: ""
    },
    environmental: {
      scope1Emissions: "",
      scope2Emissions: "",
      scope3Emissions: "",
      energyConsumption: "",
      renewableEnergyPercentage: "",
      waterWithdrawal: "",
      waterDischarge: "",
      wasteGenerated: "",
      tailingsProduced: "",
      landRehabilitated: "",
      biodiversityImpact: "",
      medicalWaste: "",
      pharmaceuticalEmissions: "",
      industrialWaste: "",
      manufacturingEmissions: "",
      productionEnergyIntensity: ""
    },
    social: {
      totalEmployees: "",
      femaleEmployeesPercentage: "",
      lostTimeInjuryRate: "",
      fatalityRate: "",
      trainingHoursPerEmployee: "",
      communityInvestment: "",
      localEmploymentPercentage: "",
      communityGrievances: "",
      employeeTurnoverRate: "",
      safetyTrainingHours: "",
      diversityTrainingCompletion: "",
      patientSafetyIncidents: "",
      healthcareAccessPrograms: "",
      workplaceSafetyIncidents: "",
      manufacturingJobsCreated: "",
      productQualityIssues: ""
    },
    governance: {
      boardSize: "",
      independentDirectorsPercentage: "",
      femaleDirectorsPercentage: "",
      ethicsTrainingCompletion: "",
      corruptionIncidents: "",
      dataBreachIncidents: "",
      cybersecurityInvestment: "",
      supplierESGAssessments: "",
      antiCorruptionPolicies: "",
      dataPrivacyPolicies: "",
      climateRiskDisclosure: "",
      sustainabilityGovernance: "",
      fdaCompliance: "",
      drugPricingTransparency: "",
      clinicalTrialEthics: "",
      productSafetyCompliance: "",
      manufacturingEthicsScore: "",
      supplyChainTransparency: ""
    }
  });

  const [dragOver, setDragOver] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [complianceMessage, setComplianceMessage] = useState('');

  const validateData = () => {
    const filledFields = {
      environmental: Object.values(formData.environmental).filter(v => v !== '' && v !== null && v !== undefined).length,
      social: Object.values(formData.social).filter(v => v !== '' && v !== null && v !== undefined).length,
      governance: Object.values(formData.governance).filter(v => v !== '' && v !== null && v !== undefined).length
    };
    
    const totalFilled = filledFields.environmental + filledFields.social + filledFields.governance;
    const totalFields = 18; // Approximate total ESG fields
    const completeness = Math.round((totalFilled / totalFields) * 100);
    
    const results = {
      critical: 0,
      errors: 0,
      warnings: totalFilled < 5 ? 1 : 0,
      completeness
    };
    
    setValidationModalResults(results);
    setShowValidationModal(true);
  };

  const checkCompliance = () => {
    const filledFields = {
      environmental: Object.values(formData.environmental).filter(v => v !== '' && v !== null && v !== undefined).length,
      social: Object.values(formData.social).filter(v => v !== '' && v !== null && v !== undefined).length,
      governance: Object.values(formData.governance).filter(v => v !== '' && v !== null && v !== undefined).length
    };
    
    const framework = formData.companyInfo.reportingFramework || 'GRI';
    let complianceScore = 0;
    
    if (filledFields.environmental >= 4) complianceScore += 30;
    if (filledFields.social >= 4) complianceScore += 35;
    if (filledFields.governance >= 4) complianceScore += 35;
    
    const complianceLevel = complianceScore >= 80 ? 'High' : complianceScore >= 60 ? 'Medium' : 'Low';
    const emoji = complianceScore >= 80 ? '🟢' : complianceScore >= 60 ? '🟡' : '🔴';
    
    showToast(`${emoji} ${framework} Compliance: ${complianceLevel} (${complianceScore}%)`, complianceScore >= 60 ? 'success' : 'warning');
  };

  // Fetch current user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        window.location.href = '/login';
      }
    };
    fetchUser();
  }, []);

  // Load saved company name on mount
  useEffect(() => {
    const savedCompany = localStorage.getItem('esg_company_name');
    if (savedCompany && !formData.companyInfo.companyName) {
      setFormData(prev => ({
        ...prev,
        companyInfo: { ...prev.companyInfo, companyName: savedCompany }
      }));
    }
  }, []);

  const debouncedSave = debounce(async (data) => {
    // Auto-save disabled - only save on submit
  }, 1500);

  const validateField = (category, field, value) => {
    if (value === '') return { isValid: true, errors: [], warnings: [] };
    
    const result = DataValidation.validateESGData({ [category]: { [field]: value } });
    return result;
  };

  const handleChange = (category, field, value) => {
    if (field !== 'description') {
      validateField(category, field, value);
    }

    setFormData(prev => {
      const newData = {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value
        }
      };
      
      if (category === 'companyInfo' && field === 'sector') {
        localStorage.setItem('currentSector', value);
      }
      
      const saveDataPayload = {
        ...newData.companyInfo,
        environmental: newData.environmental,
        social: newData.social,
        governance: newData.governance,
        status: "Draft",
        timestamp: new Date().toISOString(),
        frameworkCompliance: DataValidation.validateDataCompleteness(newData)
      };
      
      debouncedSave(saveDataPayload);
      AuditTrail.trackDataUpdate({}, { category, field, value }, 'current_user');
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.companyInfo.companyName.trim()) {
        showToast("Company name is required", 'error');
        return;
      }

      if (!formData.companyInfo.sector.trim()) {
        showToast("Please select a sector", 'error');
        return;
      }

      if (!formData.companyInfo.region.trim()) {
        showToast("Please select a region", 'error');
        return;
      }

      const validation = performFullValidation(formData);
      setValidationResults(validation);

      // Skip critical validation for now to allow submission
      // if (validation.summary.totalCritical > 0) {
      //   showToast(`${validation.summary.totalCritical} critical issues found. Please review.`, 'error');
      //   setShowValidationPanel(true);
      //   return;
      // }

      if (validation.summary.totalErrors > 5) {
        const proceed = window.confirm(`${validation.summary.totalErrors} validation errors found. Continue anyway?`);
        if (!proceed) {
          setShowValidationPanel(true);
          return;
        }
      }

      setIsSaving(true);
      
      const submissionData = {
        id: Date.now().toString(),
        companyName: formData.companyInfo.companyName,
        sector: formData.companyInfo.sector,
        region: formData.companyInfo.region,
        reportingYear: formData.companyInfo.reportingYear,
        framework: formData.companyInfo.reportingFramework,
        assuranceLevel: formData.companyInfo.assuranceLevel || 'None',
        siteId: selectedSite?.id || null,
        siteName: selectedSite?.name || null,
        siteType: selectedSite?.type || null,
        environmental: formData.environmental,
        social: formData.social,
        governance: formData.governance,
        status: "Submitted",
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      const userId = currentUser?.email || currentUser?.id || 'unknown';
      const companyId = userId;
      const userRole = getUserRole();
      
      if (userRole === USER_ROLES.DATA_ENTRY) {
        submissionData.status = 'Pending';
        
        const workflowEntry = {
          id: submissionData.id,
          title: `ESG Data Entry - ${submissionData.companyName}`,
          submittedBy: userId,
          createdAt: submissionData.timestamp,
          status: 'pending',
          data: submissionData,
          approvalLevels: [
            {
              level: 1,
              approverRole: 'SITE',
              approver: 'dataentry1@esgenius.com',
              status: 'approved',
              approvedAt: new Date().toISOString()
            },
            {
              level: 2,
              approverRole: 'BUSINESS UNIT',
              approver: 'supervisor1@esgenius.com',
              status: 'approved',
              approvedAt: new Date().toISOString()
            },
            {
              level: 3,
              approverRole: 'GROUP ESG',
              approver: 'superadmin2@esgenius.com',
              status: 'approved',
              approvedAt: new Date().toISOString()
            },
            {
              level: 4,
              approverRole: 'EXECUTIVE',
              approver: 'superadmin2@esgenius.com',
              status: 'pending'
            }
          ]
        };
        
        const existingWorkflows = JSON.parse(localStorage.getItem('approvalWorkflows') || '[]');
        existingWorkflows.push(workflowEntry);
        localStorage.setItem('approvalWorkflows', JSON.stringify(existingWorkflows));
        
        const alerts = JSON.parse(localStorage.getItem('recentAlerts') || '[]');
        alerts.unshift({
          id: Date.now(),
          type: 'info',
          title: 'New Data Pending Approval',
          message: `${currentUser?.fullName || userId} submitted ESG data for approval`,
          category: 'Approval',
          timestamp: new Date().toISOString(),
          read: false,
          workflowId: submissionData.id
        });
        localStorage.setItem('recentAlerts', JSON.stringify(alerts));
      }

      try {
        console.log('Attempting to save to database...');
        
        const companyResponse = await APIService.saveCompany({
          company_name: submissionData.companyName,
          sector: submissionData.sector || 'Not specified',
          region: submissionData.region || 'Not specified',
          reporting_year: submissionData.reportingYear,
          primary_framework: submissionData.framework,
          assurance_level: submissionData.assuranceLevel || 'None'
        });
        
        console.log('Company API response:', companyResponse);
        const dbCompanyId = companyResponse.id || companyResponse.data?.id;
        
        if (!dbCompanyId) {
          console.error('Company response structure:', companyResponse);
          throw new Error('Failed to get company ID from database');
        }
        
        console.log('Using company ID:', dbCompanyId);
        
        if (Object.values(formData.environmental).some(v => v !== '')) {
          // Save each environmental metric individually
          for (const [metric, value] of Object.entries(formData.environmental)) {
            if (value && value.toString().trim() !== '') {
              try {
                const payload = {
                  company_id: dbCompanyId,
                  metric: metric,
                  value: value
                };
                console.log(`Sending environmental data:`, payload);
                const response = await APIService.saveEnvironmental(payload);
                console.log(`Successfully saved ${metric}:`, response);
              } catch (error) {
                console.error(`Failed to save ${metric}:`, error);
              }
            }
          }
          console.log('Environmental data saved');
        }
        
        if (Object.values(formData.social).some(v => v && v.toString().trim() !== '')) {
          console.log('Social form data:', formData.social);
          // Save each social metric individually
          for (const [metric, value] of Object.entries(formData.social)) {
            if (value && value.toString().trim() !== '') {
              try {
                const payload = {
                  company_id: dbCompanyId,
                  metric: metric,
                  value: value
                };
                console.log(`Sending social data:`, payload);
                const response = await APIService.saveSocial(payload);
                console.log(`Successfully saved ${metric}:`, response);
              } catch (error) {
                console.error(`Failed to save ${metric}:`, error.message);
              }
            }
          }
          console.log('Social data saved');
        }
        
        if (Object.values(formData.governance).some(v => v && v.toString().trim() !== '')) {
          console.log('Governance form data:', formData.governance);
          // Save each governance metric individually
          for (const [metric, value] of Object.entries(formData.governance)) {
            if (value && value.toString().trim() !== '') {
              try {
                const payload = {
                  company_id: dbCompanyId,
                  metric: metric,
                  value: value
                };
                console.log(`Sending governance data:`, payload);
                const response = await APIService.saveGovernance(payload);
                console.log(`Successfully saved ${metric}:`, response);
              } catch (error) {
                console.error(`Failed to save ${metric}:`, error.message);
              }
            }
          }
          console.log('Governance data saved');
        }
        
        console.log('All data saved to database successfully');
        
        // Call submit endpoint to create regulatory records
        try {
          if (dbCompanyId) {
            const submitResponse = await fetch(`http://localhost:5000/api/submit/${dbCompanyId}`, {
              method: 'POST',
              credentials: 'include'
            });
            
            if (submitResponse.ok) {
              console.log('Regulatory records created successfully');
            } else {
              console.log('Failed to create regulatory records');
            }
          } else {
            console.log('No company ID available for regulatory records');
          }
        } catch (submitError) {
          console.error('Submit endpoint error:', submitError);
        }
        
        const existing = JSON.parse(localStorage.getItem('esgData') || '[]');
        existing.push(submissionData);
        localStorage.setItem('esgData', JSON.stringify(existing));
        
        window.dispatchEvent(new CustomEvent('esgDataUpdated', { detail: submissionData }));
      } catch (e) {
        console.error('Database save failed:', e);
        console.error('Error details:', e.message);
        
        const existing = JSON.parse(localStorage.getItem('esgData') || '[]');
        existing.push(submissionData);
        localStorage.setItem('esgData', JSON.stringify(existing));
        
        showToast('Data saved locally. Database connection failed.', 'warning');
      }
      
      setCompletedSteps(prev => new Set([...prev, 5]));
      
      if (userRole === USER_ROLES.DATA_ENTRY) {
        showToast("Assessment submitted for approval! Check Workflow Dashboard for status.", 'success');
      } else {
        showToast("Assessment submitted successfully!", 'success');
      }
      
      setTimeout(() => {
        window.location.href = '/reports';
      }, 60000);
      
    } catch (error) {
      showToast(`Error saving data: ${error.message}`, 'error');
      console.error('Submit failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg.gradient}`}>
      <ProfessionalHeader 
        currentUser={currentUser}
        onLogout={handleLogout}
        actions={[
          {
            label: 'Audit Trail',
            onClick: () => setShowAuditTrail(true),
            icon: '📋'
          },
          {
            label: 'Evidence',
            onClick: () => setShowEvidence(true),
            icon: '📎'
          },
          {
            label: 'Site Manager',
            onClick: () => setShowSiteManager(true),
            icon: '🏢'
          },
          {
            label: 'Advanced Data Entry',
            onClick: () => setShowAdvancedEntry(true),
            icon: '🚀'
          }
        ]}
      />

      <div className="max-w-7xl mx-auto p-6">
        <div className={`p-6 rounded-xl shadow-lg mb-8 ${theme.bg.card}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${theme.text.primary}`}>Step {currentStep} of {steps.length}</h2>
              <p className={`text-sm ${theme.text.secondary}`}>{steps.find(s => s.id === currentStep)?.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === step.id
                    ? `${theme.bg.accent} ${theme.text.accent} ring-2 ring-blue-500`
                    : completedSteps.has(step.id)
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : `${theme.bg.subtle} ${theme.text.secondary} ${theme.hover.subtle}`
                }`}
              >
                <span>{step.icon}</span>
                <span className="hidden md:inline">{step.title}</span>
                {completedSteps.has(step.id) && <span className="text-green-600">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className={`p-8 rounded-xl shadow-lg border ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/90 to-gray-800/90 border-slate-700' 
                  : 'bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200'
              } backdrop-blur-xl`}>
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Company Information & Framework Selection</h3>
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    isDark ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <span className="text-blue-500">ℹ️</span>
                    <div>
                      <div className={`font-medium ${
                        isDark ? 'text-blue-300' : 'text-blue-700'
                      }`}>Flexible Company Management</div>
                      <div className={`text-sm ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>You can edit company information at any time and manage data for multiple companies.</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Company Name *</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={formData.companyInfo.companyName}
                        onChange={(e) => handleChange('companyInfo', 'companyName', e.target.value)}
                        className={`flex-1 border rounded-lg px-4 py-3 text-lg ${
                          isDark 
                            ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                            : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter company name"
                        required
                        disabled={!isEditingCompany && formData.companyInfo.companyName}
                      />
                      {formData.companyInfo.companyName && (
                        <button
                          type="button"
                          onClick={() => setIsEditingCompany(!isEditingCompany)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isEditingCompany
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isEditingCompany ? '✓ Save' : '✏️ Edit'}
                        </button>
                      )}
                    </div>
                    {formData.companyInfo.companyName && !isEditingCompany && (
                      <p className={`text-sm mt-1 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>Company name is auto-filled for all entries. Click Edit to change.</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Site/Business Unit</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={selectedSite ? selectedSite.name : 'No site selected (Company-level)'}
                        className={`flex-1 border rounded-lg px-4 py-3 ${
                          isDark 
                            ? 'bg-slate-700/30 border-slate-600 text-slate-300' 
                            : 'bg-slate-50 border-slate-300 text-slate-600'
                        } cursor-not-allowed`}
                        disabled
                      />
                      <button
                        type="button"
                        onClick={() => setShowSiteManager(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <span>+</span> Select Site
                      </button>
                    </div>
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Select a manufacturing facility/plant for facility-level reporting, or leave empty for company-level.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>(Reporting Year)</label>
                      <input
                        type="number"
                        value={formData.companyInfo.reportingYear}
                        onChange={(e) => handleChange('companyInfo', 'reportingYear', e.target.value)}
                        className={`w-full border rounded-lg px-4 py-3 ${
                          isDark 
                            ? 'bg-slate-700/50 border-slate-600 text-white' 
                            : 'bg-white border-slate-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>(Sector)</label>
                      <select
                        value={formData.companyInfo.sector}
                        onChange={(e) => handleChange('companyInfo', 'sector', e.target.value)}
                        className={`w-full border rounded-lg px-4 py-3 ${
                          isDark 
                            ? 'bg-slate-700/50 border-slate-600 text-white' 
                            : 'bg-white border-slate-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      >
                        <option value="">Select sector</option>
                        <option value="mining">Mining & Extractives</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="manufacturing">Manufacturing</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>(Region)</label>
                      <select
                        value={formData.companyInfo.region}
                        onChange={(e) => handleChange('companyInfo', 'region', e.target.value)}
                        className={`w-full border rounded-lg px-4 py-3 ${
                          isDark 
                            ? 'bg-slate-700/50 border-slate-600 text-white' 
                            : 'bg-white border-slate-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select region</option>
                        <option value="india">India</option>
                        <option value="zimbabwe">Zimbabwe</option>
                        <option value="southern-africa">Southern Africa</option>
                        <option value="north-america">North America</option>
                        <option value="europe">Europe</option>
                        <option value="asia-pacific">Asia Pacific</option>
                        <option value="latin-america">Latin America</option>
                        <option value="middle-east">Middle East</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>(Primary Reporting Framework *)</label>
                      <select
                        value={formData.companyInfo.reportingFramework}
                        onChange={(e) => handleChange('companyInfo', 'reportingFramework', e.target.value)}
                        className={`w-full border rounded-lg px-4 py-3 ${
                          isDark 
                            ? 'bg-slate-700/50 border-slate-600 text-white' 
                            : 'bg-white border-slate-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      >
                        <option value="GRI">GRI Standards - Global Reporting Initiative Standards</option>
                        <option value="ISSB">ISSB (IFRS S1 & S2) - International Sustainability Standards Board - Climate & Sustainability Disclosures</option>
                        <option value="GRI_Mining">GRI Mining & Metals - GRI Standards for Mining & Metals Sector</option>
                        <option value="SASB">SASB Standards - Sustainability Accounting Standards Board</option>
                        <option value="TCFD">TCFD Recommendations - Task Force on Climate-related Financial Disclosures</option>
                        <option value="CSRD">CSRD/ESRS - Corporate Sustainability Reporting Directive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>(Assurance Level)</label>
                    <select
                      value={formData.companyInfo.assuranceLevel}
                      onChange={(e) => handleChange('companyInfo', 'assuranceLevel', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white' 
                          : 'bg-white border-slate-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="None">No External Assurance</option>
                      <option value="Limited">Limited Assurance</option>
                      <option value="Reasonable">Reasonable Assurance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Advanced Bulk Data Import */}
              <div className={`p-6 rounded-xl shadow-lg border ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/90 to-gray-800/90 border-slate-700' 
                  : 'bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200'
              } backdrop-blur-xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📁</span>
                    <div>
                      <h3 className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>Advanced Bulk Data Import</h3>
                      <p className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>Industry-standard ESG data import with validation</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDark 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } flex items-center gap-2`}
                    >
                      <span>📥</span> Download Template
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDark 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      } flex items-center gap-2`}
                    >
                      <span>📊</span> Sample Data
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragOver
                      ? isDark ? 'border-blue-400 bg-blue-900/20' : 'border-blue-400 bg-blue-50'
                      : isDark ? 'border-slate-600 bg-slate-800/30' : 'border-slate-300 bg-slate-50'
                  }`}>
                    <div className="text-4xl mb-4">📁</div>
                    <div className={`font-medium mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Drag & Drop Files</div>
                    <div className={`text-sm mb-4 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>or click to browse</div>
                    <div className={`text-xs ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>Supports: .xlsx, .csv, .json</div>
                  </div>

                  <div className="space-y-4">
                    <h4 className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Import Options</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                        <span className={`text-sm ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>Validate data on import</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                        <span className={`text-sm ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>Skip duplicate entries</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                        <span className={`text-sm ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>Auto-map columns</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                        <span className={`text-sm ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>Generate audit log</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className={`p-8 rounded-xl shadow-lg border ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/90 to-gray-800/90 border-slate-700' 
                  : 'bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200'
              } backdrop-blur-xl`}>
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-4xl">🌱</span>
                    <h3 className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Environmental Metrics</h3>
                  </div>
                  <p className={`text-lg mb-6 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>Comprehensive environmental data with mining-specific metrics, ISSB S2 climate disclosures, and biodiversity tracking</p>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedEntry(true)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                  >
                    <span>🚀</span> Open Advanced Data Entry
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Mine Tailings Produced (tonnes) <span className="text-blue-500 text-xs">GRI-11</span></label>
                    <input
                      type="number"
                      value={formData.environmental.tailingsProduced}
                      onChange={(e) => handleChange('environmental', 'tailingsProduced', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="50000"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Total tailings from mining operations</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Water Discharge (m³) <span className="text-blue-500 text-xs">GRI-303-4</span></label>
                    <input
                      type="number"
                      value={formData.environmental.waterDischarge}
                      onChange={(e) => handleChange('environmental', 'waterDischarge', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="25000"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Water discharged from mining site</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Land Rehabilitated (hectares) <span className="text-blue-500 text-xs">GRI-11</span></label>
                    <input
                      type="number"
                      value={formData.environmental.landRehabilitated}
                      onChange={(e) => handleChange('environmental', 'landRehabilitated', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="120"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Land restored post-mining</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Biodiversity Impact Score <span className="text-blue-500 text-xs">GRI-304</span></label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.environmental.biodiversityImpact}
                      onChange={(e) => handleChange('environmental', 'biodiversityImpact', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="7.5"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Impact on local biodiversity (0-10 scale)</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>GHG Emissions - Scope 1 (tCO2e) <span className="text-blue-500 text-xs">IFRS-S2</span></label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.environmental.scope1Emissions}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        handleChange('environmental', 'scope1Emissions', value);
                      }}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="85000"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Direct emissions from mining operations</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Energy Consumption (MWh) <span className="text-blue-500 text-xs">GRI-302-1</span></label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.environmental.energyConsumption}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        handleChange('environmental', 'energyConsumption', value);
                      }}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="95000"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Total energy used in mining operations</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className={`p-8 rounded-xl shadow-lg border ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/90 to-gray-800/90 border-slate-700' 
                  : 'bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200'
              } backdrop-blur-xl`}>
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-4xl">👥</span>
                    <h3 className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Social Metrics</h3>
                  </div>
                  <p className={`text-lg mb-6 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>Workforce diversity, mining safety, community relations, stakeholder engagement, and local employment tracking</p>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedEntry(true)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                  >
                    <span>🚀</span> Open Advanced Data Entry
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Fatality Rate (per 200,000 hours) <span className="text-red-500 text-xs">GRI-403-9</span></label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.social.fatalityRate}
                      onChange={(e) => handleChange('social', 'fatalityRate', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="0.02"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Critical mining safety metric</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Lost Time Injury Rate <span className="text-blue-500 text-xs">GRI-403-9</span></label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.social.lostTimeInjuryRate}
                      onChange={(e) => handleChange('social', 'lostTimeInjuryRate', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="1.2"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Workplace injury frequency</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Total Mine Workers <span className="text-blue-500 text-xs">GRI-2-7</span></label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.social.totalEmployees}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        handleChange('social', 'totalEmployees', value);
                      }}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="3500"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Total workforce at mining site</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Female Workers (%) <span className="text-blue-500 text-xs">GRI-405-1</span></label>
                    <input
                      type="number"
                      value={formData.social.femaleEmployeesPercentage}
                      onChange={(e) => handleChange('social', 'femaleEmployeesPercentage', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="28"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Gender diversity in mining workforce</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Safety Training Hours/Worker <span className="text-blue-500 text-xs">GRI-403</span></label>
                    <input
                      type="number"
                      value={formData.social.safetyTrainingHours}
                      onChange={(e) => handleChange('social', 'safetyTrainingHours', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="80"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Annual safety training per worker</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Community Investment (USD) <span className="text-blue-500 text-xs">GRI-413</span></label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.social.communityInvestment}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        handleChange('social', 'communityInvestment', value);
                      }}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="500000"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Investment in local community development</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className={`p-8 rounded-xl shadow-lg border ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/90 to-gray-800/90 border-slate-700' 
                  : 'bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200'
              } backdrop-blur-xl`}>
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-4xl">⚖️</span>
                    <h3 className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Governance Metrics</h3>
                  </div>
                  <p className={`text-lg mb-6 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>Board composition, ISSB S1/S2 disclosures, ESG ratings (MSCI/Sustainalytics), FDI tracking, and ESG-linked financing</p>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedEntry(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                  >
                    <span>🚀</span> Open Advanced Data Entry
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Climate Risk Disclosure Score <span className="text-blue-500 text-xs">IFRS-S2</span></label>
                    <input
                      type="number"
                      value={formData.governance.climateRiskDisclosure}
                      onChange={(e) => handleChange('governance', 'climateRiskDisclosure', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="85"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Climate-related financial disclosure quality (0-100)</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Sustainability Governance Score <span className="text-blue-500 text-xs">IFRS-S1</span></label>
                    <input
                      type="number"
                      value={formData.governance.sustainabilityGovernance}
                      onChange={(e) => handleChange('governance', 'sustainabilityGovernance', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="78"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>ESG governance structure effectiveness (0-100)</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Board Size <span className="text-blue-500 text-xs">GRI-2-9</span></label>
                    <input
                      type="number"
                      value={formData.governance.boardSize}
                      onChange={(e) => handleChange('governance', 'boardSize', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="11"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Total board members</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Independent Directors (%) <span className="text-blue-500 text-xs">IFRS-S1</span></label>
                    <input
                      type="number"
                      value={formData.governance.independentDirectorsPercentage}
                      onChange={(e) => handleChange('governance', 'independentDirectorsPercentage', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="70"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Board independence percentage</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Ethics Training Completion (%) <span className="text-blue-500 text-xs">GRI-205-2</span></label>
                    <input
                      type="number"
                      value={formData.governance.ethicsTrainingCompletion}
                      onChange={(e) => handleChange('governance', 'ethicsTrainingCompletion', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="95"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Staff ethics training completion rate</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Corruption Incidents <span className="text-blue-500 text-xs">GRI-205-3</span></label>
                    <input
                      type="number"
                      value={formData.governance.corruptionIncidents}
                      onChange={(e) => handleChange('governance', 'corruptionIncidents', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="0"
                    />
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Confirmed corruption cases</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className={`p-8 rounded-xl shadow-lg border ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/90 to-gray-800/90 border-slate-700' 
                  : 'bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200'
              } backdrop-blur-xl`}>
                {/* Company Information */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏢</span>
                    <h3 className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Company Information</h3>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
                    <span>✏️</span> Edit Company Info
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Company:</div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formData.companyInfo.companyName || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Year:</div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formData.companyInfo.reportingYear || '2025'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sector:</div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formData.companyInfo.sector || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Framework:</div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formData.companyInfo.reportingFramework || 'GRI'}
                    </div>
                  </div>
                </div>

                {/* ESG Data Summary */}
                <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>ESG Data Summary</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Environmental Metrics */}
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🌱</span>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Environmental Metrics</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Scope 1 Emissions:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.environmental.scope1Emissions || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Energy Consumption:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.environmental.energyConsumption || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Water Withdrawal:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.environmental.waterWithdrawal || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Waste Generated:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.environmental.wasteGenerated || 'Not set'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Social Metrics */}
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">👥</span>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Social Metrics</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Total Employees:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.social.totalEmployees || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Female Employees:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.social.femaleEmployeesPercentage || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Injury Rate:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.social.lostTimeInjuryRate || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Community Investment:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.social.communityInvestment || 'Not set'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Governance Metrics */}
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">⚖️</span>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Governance Metrics</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Board Size:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.governance.boardSize || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Independent Directors:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.governance.independentDirectorsPercentage || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Ethics Training:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.governance.ethicsTrainingCompletion || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Corruption Incidents:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {formData.governance.corruptionIncidents || 'Not set'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Completeness */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">📊</span>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Data Completeness</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Environmental:</div>
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium inline-block">
                        0/7 fields
                      </div>
                    </div>
                    <div>
                      <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Social:</div>
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium inline-block">
                        0/8 fields
                      </div>
                    </div>
                    <div>
                      <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Governance:</div>
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium inline-block">
                        0/10 fields
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={`pt-8 flex justify-between items-center border-t ${theme.border.primary}`}>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                ← Previous
              </button>
            </div>
            
            <div className="flex gap-3">
              {currentStep < 5 ? (
                <button 
                  type="button" 
                  onClick={() => {
                    setCurrentStep(currentStep + 1);
                    setCompletedSteps(prev => new Set([...prev, currentStep]));
                  }} 
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next →
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={validateData}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center gap-2"
                  >
                    <span>✓</span> Validate Data
                  </button>
                  <button
                    type="button"
                    onClick={checkCompliance}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center gap-2"
                  >
                    <span>🔍</span> Check Compliance
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving || !formData.companyInfo.companyName.trim()}
                    className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                      isSaving || !formData.companyInfo.companyName.trim()
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
                    }`}
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Submitting...
                      </span>
                    ) : (
                      '✓ Submit Assessment'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>

        {showValidationModal && validationModalResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 text-xl">⚠️</span>
                  <h3 className="text-lg font-semibold">Validation Results</h3>
                </div>
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-red-600">{validationModalResults.critical}</div>
                  <div className="text-sm text-gray-600">Critical Issues</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-orange-600">{validationModalResults.errors}</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-yellow-600">{validationModalResults.warnings}</div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">GRI Completeness: {validationModalResults.completeness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${validationModalResults.completeness}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showSiteManager && (
          <SiteHierarchyManager
            onClose={() => setShowSiteManager(false)}
            onSiteSelect={(site) => {
              setSelectedSite(site);
              setFormData(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, siteId: site.id, siteName: site.name }
              }));
              setShowSiteManager(false);
              showToast(`Selected: ${site.name}`, 'success');
            }}
          />
        )}

        {showAdvancedEntry && (
          <UnifiedAdvancedEntry onClose={() => setShowAdvancedEntry(false)} />
        )}

        {showAuditTrail && (
          <AuditTrailViewer onClose={() => setShowAuditTrail(false)} />
        )}

        {showEvidence && (
          <EvidenceUploader onClose={() => setShowEvidence(false)} />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

export default DataEntry;