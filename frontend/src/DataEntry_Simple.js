import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DataEntry() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    companyInfo: {
      companyName: "",
      reportingYear: new Date().getFullYear(),
      sector: "",
      region: ""
    },
    environmental: {
      scope1Emissions: "",
      scope2Emissions: "",
      energyConsumption: "",
      waterWithdrawal: ""
    },
    social: {
      totalEmployees: "",
      femaleEmployeesPercentage: "",
      lostTimeInjuryRate: "",
      communityInvestment: ""
    },
    governance: {
      boardSize: "",
      independentDirectorsPercentage: "",
      ethicsTrainingCompletion: ""
    }
  });

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
          navigate('/login');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.companyInfo.companyName.trim()) {
      alert("Company name is required");
      return;
    }

    setIsSaving(true);
    
    try {
      const submissionData = {
        id: Date.now().toString(),
        companyName: formData.companyInfo.companyName,
        sector: formData.companyInfo.sector,
        region: formData.companyInfo.region,
        reportingYear: formData.companyInfo.reportingYear,
        environmental: formData.environmental,
        social: formData.social,
        governance: formData.governance,
        status: "Submitted",
        timestamp: new Date().toISOString()
      };
      
      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem('esgData') || '[]');
      existing.push(submissionData);
      localStorage.setItem('esgData', JSON.stringify(existing));
      
      alert("Data submitted successfully!");
      navigate('/reports');
      
    } catch (error) {
      alert(`Error saving data: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">ESG Data Entry</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {currentUser?.fullName || currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ESG Data Entry Form</h2>
          
          {/* Step Navigation */}
          <div className="flex space-x-4 mb-8">
            {[
              { id: 1, title: "Company Info" },
              { id: 2, title: "Environmental" },
              { id: 3, title: "Social" },
              { id: 4, title: "Governance" }
            ].map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyInfo.companyName}
                      onChange={(e) => handleChange('companyInfo', 'companyName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reporting Year
                    </label>
                    <input
                      type="number"
                      value={formData.companyInfo.reportingYear}
                      onChange={(e) => handleChange('companyInfo', 'reportingYear', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sector
                    </label>
                    <select
                      value={formData.companyInfo.sector}
                      onChange={(e) => handleChange('companyInfo', 'sector', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select sector</option>
                      <option value="mining">Mining</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="manufacturing">Manufacturing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <input
                      type="text"
                      value={formData.companyInfo.region}
                      onChange={(e) => handleChange('companyInfo', 'region', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Environmental */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Environmental Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scope 1 Emissions (tCO2e)
                    </label>
                    <input
                      type="number"
                      value={formData.environmental.scope1Emissions}
                      onChange={(e) => handleChange('environmental', 'scope1Emissions', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scope 2 Emissions (tCO2e)
                    </label>
                    <input
                      type="number"
                      value={formData.environmental.scope2Emissions}
                      onChange={(e) => handleChange('environmental', 'scope2Emissions', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Energy Consumption (MWh)
                    </label>
                    <input
                      type="number"
                      value={formData.environmental.energyConsumption}
                      onChange={(e) => handleChange('environmental', 'energyConsumption', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Water Withdrawal (m³)
                    </label>
                    <input
                      type="number"
                      value={formData.environmental.waterWithdrawal}
                      onChange={(e) => handleChange('environmental', 'waterWithdrawal', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Social Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Employees
                    </label>
                    <input
                      type="number"
                      value={formData.social.totalEmployees}
                      onChange={(e) => handleChange('social', 'totalEmployees', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Female Employees (%)
                    </label>
                    <input
                      type="number"
                      value={formData.social.femaleEmployeesPercentage}
                      onChange={(e) => handleChange('social', 'femaleEmployeesPercentage', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lost Time Injury Rate
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.social.lostTimeInjuryRate}
                      onChange={(e) => handleChange('social', 'lostTimeInjuryRate', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Community Investment ($)
                    </label>
                    <input
                      type="number"
                      value={formData.social.communityInvestment}
                      onChange={(e) => handleChange('social', 'communityInvestment', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Governance */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Governance Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Board Size
                    </label>
                    <input
                      type="number"
                      value={formData.governance.boardSize}
                      onChange={(e) => handleChange('governance', 'boardSize', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Independent Directors (%)
                    </label>
                    <input
                      type="number"
                      value={formData.governance.independentDirectorsPercentage}
                      onChange={(e) => handleChange('governance', 'independentDirectorsPercentage', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ethics Training Completion (%)
                    </label>
                    <input
                      type="number"
                      value={formData.governance.ethicsTrainingCompletion}
                      onChange={(e) => handleChange('governance', 'ethicsTrainingCompletion', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Previous
                  </button>
                )}
              </div>
              
              <div>
                {currentStep < 4 ? (
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(currentStep + 1)} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isSaving || !formData.companyInfo.companyName.trim()}
                    className={`px-6 py-2 rounded-md font-medium ${
                      isSaving || !formData.companyInfo.companyName.trim()
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isSaving ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DataEntry;