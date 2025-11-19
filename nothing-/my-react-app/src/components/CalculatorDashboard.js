import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses } from '../utils/themeUtils';
import { Button, Toast } from './ProfessionalUX';
import { CarbonFootprintCalculator, WaterStressCalculator, ESGROICalculator, EmissionIntensityCalculator, CalculatorManager } from '../calculators';
import DataIntegration from '../calculators/DataIntegration';

const CalculatorDashboard = () => {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);
  const [activeCalculator, setActiveCalculator] = useState('carbon');
  const [results, setResults] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [dataSummary, setDataSummary] = useState(null);

  const calculators = [
    { id: 'carbon', name: 'Carbon Footprint', icon: '🌍' },
    { id: 'water', name: 'Water Stress', icon: '💧' },
    { id: 'roi', name: 'ESG ROI', icon: '💰' },
    { id: 'intensity', name: 'Emission Intensity', icon: '📈' }
  ];

  const testCalculator = async (type) => {
    setLoading(true);
    try {
      let result;
      let testData;
      
      if (useRealData) {
        testData = DataIntegration.getCalculatorData(type);
        if (!testData) {
          showToast('No ESG data available. Please add data through Data Entry first.', 'warning');
          setLoading(false);
          return;
        }
      } else {
        testData = getTestData(type);
      }
      
      switch (type) {
        case 'carbon':
          result = CarbonFootprintCalculator.calculateTotalFootprint(testData);
          break;
        case 'water':
          result = WaterStressCalculator.calculateWaterStress(testData);
          break;
        case 'roi':
          result = ESGROICalculator.calculateESGROI(testData);
          break;
        case 'intensity':
          result = EmissionIntensityCalculator.calculateEmissionIntensity(testData);
          break;
        default:
          result = await CalculatorManager.calculate(type, testData);
      }
      
      setResults(prev => ({ ...prev, [type]: result }));
      showToast(`${type} calculator ${useRealData ? '(real data)' : '(test data)'} successful`, 'success');
    } catch (error) {
      console.error(`${type} calculator failed:`, error);
      showToast(`${type} calculator failed: ${error.message}`, 'error');
    }
    setLoading(false);
  };

  const getTestData = (type) => {
    const testData = {
      carbon: {
        scope1: { naturalGas: 1000, diesel: 500, gasoline: 300 },
        scope2: { gridElectricity: 50000, renewableElectricity: 10000 },
        scope3: { 
          transport: { car: 10000, plane: 5000, truck: 2000 },
          businessTravel: { flights: 8000, carTravel: 3000 },
          supplyChainEmissions: 15000,
          wasteDisposal: 500
        }
      },
      water: {
        consumption: { 
          totalAnnual: 100000, 
          recycled: 20000, 
          rainwater: 5000,
          revenue: 10000000
        },
        location: { 
          region: 'North America', 
          country: 'United States',
          climate: 'temperate',
          localSupply: 85
        },
        quality: { ph: 7.2, tds: 250, turbidity: 0.8, chlorine: 0.6, hardness: 120 },
        efficiency: { 
          recyclingRate: 25, 
          leakageRate: 8, 
          conservationMeasures: 70,
          technologyScore: 75,
          industry: 'manufacturing'
        }
      },
      roi: {
        investments: {
          renewableEnergy: 500000,
          energyEfficiency: 200000,
          employeeTraining: 100000,
          healthSafety: 150000,
          complianceSystem: 80000
        },
        benefits: {
          costSavings: {
            energyReduction: 50000,
            waterReduction: 10000,
            operationalEfficiency: 75000,
            turnoverReduction: 5,
            avgRecruitmentCost: 15000
          },
          revenueGains: {
            greenProductRevenue: 200000,
            sustainabilityPremium: 50000,
            customerRetentionImprovement: 10,
            avgCustomerValue: 2000
          },
          riskReduction: {
            regulatoryFineReduction: 100000,
            reputationProtection: 150000
          },
          brandValue: {
            brandPremium: 80000,
            engagementImprovement: 15,
            productivityGain: 3000
          }
        },
        timeframe: 5
      },
      intensity: {
        emissions: { scope1: 5000, scope2: 8000, scope3: 12000 },
        businessMetrics: {
          revenue: 10000000,
          employees: 250,
          production: 50000,
          floorArea: 10000,
          energyConsumption: 100000
        },
        industry: 'manufacturing',
        historicalData: [
          { year: 2020, revenue: 0.3, employee: 9000, totalIntensity: 0.28 },
          { year: 2021, revenue: 0.28, employee: 8500, totalIntensity: 0.26 },
          { year: 2022, revenue: 0.25, employee: 8000, totalIntensity: 0.25 }
        ],
        targets: {
          revenue: { value: 0.2, timeline: 5 },
          employee: { value: 6000, timeline: 3 }
        }
      }
    };
    
    return testData[type] || {};
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadDataSummary = () => {
    try {
      const summary = DataIntegration.getDataSummary();
      setDataSummary(summary);
      showToast('Data summary refreshed', 'success');
    } catch (error) {
      console.error('Failed to refresh data summary:', error);
      showToast('Failed to refresh data summary', 'error');
    }
  };

  React.useEffect(() => {
    loadDataSummary();
  }, []);

  const renderResults = (type) => {
    const result = results[type];
    if (!result) return null;

    return (
      <div className={`mt-4 p-4 rounded-lg ${theme.bg.subtle}`}>
        <h4 className={`font-semibold mb-2 ${theme.text.primary}`}>Results:</h4>
        <div className="space-y-2 text-sm">
          {type === 'carbon' && (
            <>
              <div>Total Emissions: {result.totalEmissions?.toFixed(2)} kg CO2e</div>
              <div>Scope 1: {result.scope1?.total?.toFixed(2)} kg CO2e</div>
              <div>Scope 2: {result.scope2?.total?.toFixed(2)} kg CO2e</div>
              <div>Scope 3: {result.scope3?.total?.toFixed(2)} kg CO2e</div>
            </>
          )}
          {type === 'water' && (
            <>
              <div>Stress Score: {result.overallStressScore}/100</div>
              <div>Stress Level: {result.stressLevel?.description}</div>
              <div>Availability Score: {result.availability?.score}/100</div>
              <div>Quality Score: {result.quality?.overallScore}/100</div>
            </>
          )}
          {type === 'roi' && (
            <>
              <div>Total ROI: {result.totalROI}%</div>
              <div>Payback Period: {result.paybackPeriod} years</div>
              <div>NPV: ${result.netPresentValue?.toLocaleString()}</div>
              <div>Total Investment: ${result.investments?.totalInvestment?.toLocaleString()}</div>
            </>
          )}
          {type === 'intensity' && (
            <>
              <div>Total Emissions: {result.totalEmissions} kg CO2e</div>
              <div>Revenue Intensity: {result.intensityMetrics?.revenue?.value?.toFixed(4)} kg CO2e/$</div>
              <div>Employee Intensity: {result.intensityMetrics?.employee?.value?.toFixed(0)} kg CO2e/employee</div>
              <div>Overall Performance: {result.benchmarks?.overallPerformance}</div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-6 ${theme.bg.gradient}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme.text.primary}`}>
            ESG Calculator Dashboard
          </h1>
          <p className={`text-lg ${theme.text.secondary}`}>
            Test and validate specialized ESG calculators
          </p>
          
          {/* Data Source Toggle */}
          <div className={`mt-4 p-4 rounded-lg ${theme.bg.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <label className={`flex items-center cursor-pointer ${theme.text.primary}`}>
                  <input
                    type="checkbox"
                    checked={useRealData}
                    onChange={(e) => {
                      setUseRealData(e.target.checked);
                      loadDataSummary();
                    }}
                    className="mr-2"
                  />
                  Use Real Data from Data Entry
                </label>
                <p className={`text-sm ${theme.text.secondary} mt-1`}>
                  {useRealData ? 'Using actual ESG data from Data Entry module' : 'Using sample test data'}
                </p>
              </div>
              
              {dataSummary && (
                <div className="text-right">
                  <p className={`text-sm ${theme.text.primary}`}>
                    Available Data: {dataSummary.totalEntries} entries
                  </p>
                  <p className={`text-xs ${theme.text.secondary}`}>
                    E: {dataSummary.categories.environmental} | 
                    S: {dataSummary.categories.social} | 
                    G: {dataSummary.categories.governance}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {calculators.map((calc) => (
            <div
              key={calc.id}
              className={`p-6 rounded-xl shadow-lg cursor-pointer transition-all ${
                activeCalculator === calc.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : theme.bg.card
              }`}
              onClick={() => setActiveCalculator(calc.id)}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{calc.icon}</div>
                <h3 className={`font-bold ${theme.text.primary}`}>{calc.name}</h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    testCalculator(calc.id);
                  }}
                  disabled={loading}
                  className="mt-3 w-full"
                >
                  Test Calculator
                </Button>
                {renderResults(calc.id)}
              </div>
            </div>
          ))}
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${theme.bg.card}`}>
          <h2 className={`text-2xl font-bold mb-4 ${theme.text.primary}`}>
            Calculator Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`font-semibold mb-3 ${theme.text.primary}`}>Available Calculators</h3>
              <ul className="space-y-2">
                {CalculatorManager.getAvailableCalculators().map((calc) => (
                  <li key={calc} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className={theme.text.secondary}>{calc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold mb-3 ${theme.text.primary}`}>Test All Calculators</h3>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={async () => {
                    for (const calc of calculators) {
                      await testCalculator(calc.id);
                    }
                  }}
                  disabled={loading}
                  className="w-full"
                >
                  Run All Tests
                </Button>
                
                <Button
                  variant="outline"
                  onClick={loadDataSummary}
                  className="w-full"
                >
                  Refresh Data Summary
                </Button>
                
                {useRealData && dataSummary?.totalEntries === 0 && (
                  <div className={`p-3 rounded bg-yellow-100 text-yellow-800 text-sm`}>
                    No ESG data found. Add data through Data Entry first.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
};

export default CalculatorDashboard;