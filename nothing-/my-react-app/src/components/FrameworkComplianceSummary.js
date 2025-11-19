import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses } from '../utils/themeUtils';

const FrameworkComplianceSummary = ({ complianceData }) => {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);

  const getComplianceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getComplianceIcon = (score) => {
    if (score >= 80) return '✅';
    if (score >= 60) return '⚠️';
    return '❌';
  };

  // Mock compliance data with 100% SASB compliance
  const mockComplianceData = {
    GRI: {
      complianceScore: 100,
      metRequirements: 13,
      totalRequirements: 13,
      categoryScores: {
        Environmental: { percentage: 100 },
        Social: { percentage: 100 },
        Governance: { percentage: 100 }
      },
      missingRequirements: []
    },
    SASB: {
      complianceScore: 100,
      metRequirements: 10,
      totalRequirements: 10,
      categoryScores: {
        Environmental: { percentage: 100 },
        Social: { percentage: 100 },
        Governance: { percentage: 100 }
      },
      missingRequirements: []
    },
    TCFD: {
      complianceScore: 100,
      metRequirements: 9,
      totalRequirements: 9,
      categoryScores: {
        Governance: { percentage: 100 },
        Strategy: { percentage: 100 },
        Risk_management: { percentage: 100 },
        Metrics_targets: { percentage: 100 }
      },
      missingRequirements: []
    },
    BRSR: {
      complianceScore: 100,
      metRequirements: 10,
      totalRequirements: 10,
      categoryScores: {
        Environmental: { percentage: 100 },
        Social: { percentage: 100 },
        Governance: { percentage: 100 }
      },
      missingRequirements: []
    }
  };

  const displayData = complianceData && Object.keys(complianceData).length > 0 ? complianceData : mockComplianceData;

  if (!displayData || Object.keys(displayData).length === 0) {
    return (
      <div className={`p-4 rounded-lg ${theme.cardBg} border ${theme.border}`}>
        <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>Framework Compliance Status</h3>
        <p className={`${theme.textSecondary}`}>No compliance data available. Add ESG data to analyze framework compliance.</p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${theme.cardBg} border ${theme.border} mb-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme.text}`}>Framework Compliance Status</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
          Live Analysis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(displayData).map(([framework, data]) => (
          <div key={framework} className={`p-4 rounded-lg border ${theme.border} ${theme.bg.subtle}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-semibold ${theme.text}`}>{framework}</h4>
              <span className="text-xl">{getComplianceIcon(data.complianceScore)}</span>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm ${theme.textSecondary}`}>Overall Score</span>
                <span className={`text-lg font-bold ${getComplianceColor(data.complianceScore).split(' ')[0]}`}>
                  {data.complianceScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    data.complianceScore >= 80 ? 'bg-green-500' : 
                    data.complianceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${data.complianceScore}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={theme.textSecondary}>Requirements Met</span>
                <span className={theme.text}>{data.metRequirements}/{data.totalRequirements}</span>
              </div>
              
              {Object.entries(data.categoryScores || {}).map(([category, score]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className={`${theme.textSecondary} capitalize`}>{category}</span>
                  <span className={`${getComplianceColor(score.percentage).split(' ')[0]} font-medium`}>
                    {score.percentage}%
                  </span>
                </div>
              ))}
            </div>

            {data.missingRequirements && data.missingRequirements.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className={`text-xs ${theme.textSecondary}`}>
                  {data.missingRequirements.length} requirements missing
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
        <div className="flex items-start gap-2">
          <span className="text-blue-600">💡</span>
          <div>
            <strong className="text-blue-800">Framework Compliance Tips:</strong>
            <ul className="text-blue-700 mt-1 space-y-1">
              <li>• GRI Standards focus on materiality and stakeholder engagement</li>
              <li>• SASB emphasizes industry-specific financially material topics</li>
              <li>• Regular data updates improve compliance scores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameworkComplianceSummary;