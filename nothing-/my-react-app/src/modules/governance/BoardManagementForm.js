import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses } from '../../utils/themeUtils';
import { saveData } from '../../utils/storage';

const BoardManagementForm = ({ onSave, onClose }) => {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);
  
  const [formData, setFormData] = useState({
    // Board Composition
    total_board_members: '',
    independent_directors: '',
    executive_directors: '',
    non_executive_directors: '',
    
    // Diversity Metrics
    female_directors: '',
    male_directors: '',
    minority_directors: '',
    
    // Age & Tenure
    directors_under_50: '',
    directors_50_65: '',
    directors_over_65: '',
    average_tenure: '',
    
    // Expertise & Skills
    financial_expertise: '',
    industry_expertise: '',
    technology_expertise: '',
    esg_expertise: '',
    
    // Board Activities
    board_meetings_held: '',
    average_attendance: '',
    committees_count: '',
    
    // Compensation
    board_compensation_total: '',
    ceo_compensation: '',
    
    // Additional Information
    board_evaluation_conducted: false,
    succession_planning: false,
    reporting_period: new Date().getFullYear(),
    governance_framework: ''
  });

  const [calculations, setCalculations] = useState({
    independence_ratio: 0,
    gender_diversity_ratio: 0,
    age_diversity_breakdown: { under_50: 0, between_50_65: 0, over_65: 0 },
    expertise_coverage: 0,
    attendance_rate: 0
  });

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    calculateGovernanceMetrics(updatedData);
  };

  const calculateGovernanceMetrics = (data) => {
    const totalMembers = parseFloat(data.total_board_members) || 0;
    const independentDirectors = parseFloat(data.independent_directors) || 0;
    const femaleDirectors = parseFloat(data.female_directors) || 0;
    
    const independenceRatio = totalMembers > 0 ? (independentDirectors / totalMembers) * 100 : 0;
    const genderDiversityRatio = totalMembers > 0 ? (femaleDirectors / totalMembers) * 100 : 0;
    
    const under50 = parseFloat(data.directors_under_50) || 0;
    const between50_65 = parseFloat(data.directors_50_65) || 0;
    const over65 = parseFloat(data.directors_over_65) || 0;
    
    const expertiseCount = [
      data.financial_expertise,
      data.industry_expertise,
      data.technology_expertise,
      data.esg_expertise
    ].filter(exp => parseFloat(exp) > 0).length;
    
    const expertiseCoverage = (expertiseCount / 4) * 100;
    
    const attendanceRate = parseFloat(data.average_attendance) || 0;

    setCalculations({
      independence_ratio: independenceRatio,
      gender_diversity_ratio: genderDiversityRatio,
      age_diversity_breakdown: {
        under_50: totalMembers > 0 ? (under50 / totalMembers) * 100 : 0,
        between_50_65: totalMembers > 0 ? (between50_65 / totalMembers) * 100 : 0,
        over_65: totalMembers > 0 ? (over65 / totalMembers) * 100 : 0
      },
      expertise_coverage: expertiseCoverage,
      attendance_rate: attendanceRate
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const boardData = {
      companyName: localStorage.getItem('companyName') || 'Company',
      category: 'governance',
      subcategory: 'board_management',
      governance: {
        board_independence_ratio: calculations.independence_ratio,
        board_gender_diversity: calculations.gender_diversity_ratio,
        board_expertise_coverage: calculations.expertise_coverage,
        board_attendance_rate: calculations.attendance_rate,
        ...formData
      },
      timestamp: new Date().toISOString(),
      reportingYear: formData.reporting_period
    };

    try {
      await saveData(boardData);
      onSave?.(boardData);
      onClose?.();
    } catch (error) {
      console.error('Error saving board data:', error);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${theme.bg.card} rounded-xl shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme.text.primary}`}>⚖️ Board Management</h2>
          <p className={`text-sm ${theme.text.secondary}`}>Track board composition, diversity, and governance</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Board Composition */}
        <div className={`p-4 rounded-lg border-l-4 border-purple-500 ${theme.bg.subtle}`}>
          <h3 className={`font-semibold ${theme.text.primary} mb-3`}>Board Composition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Total Board Members"
              value={formData.total_board_members}
              onChange={(e) => handleInputChange('total_board_members', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
            <input
              type="number"
              placeholder="Independent Directors"
              value={formData.independent_directors}
              onChange={(e) => handleInputChange('independent_directors', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
            <input
              type="number"
              placeholder="Executive Directors"
              value={formData.executive_directors}
              onChange={(e) => handleInputChange('executive_directors', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
            <input
              type="number"
              placeholder="Non-Executive Directors"
              value={formData.non_executive_directors}
              onChange={(e) => handleInputChange('non_executive_directors', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
          </div>
          <div className="mt-3 text-right">
            <span className={`font-bold ${theme.text.primary}`}>
              Independence Ratio: {calculations.independence_ratio.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Board Diversity */}
        <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${theme.bg.subtle}`}>
          <h3 className={`font-semibold ${theme.text.primary} mb-3`}>Board Diversity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Female Directors"
              value={formData.female_directors}
              onChange={(e) => handleInputChange('female_directors', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
            <input
              type="number"
              placeholder="Male Directors"
              value={formData.male_directors}
              onChange={(e) => handleInputChange('male_directors', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
            <input
              type="number"
              placeholder="Minority Directors"
              value={formData.minority_directors}
              onChange={(e) => handleInputChange('minority_directors', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
          </div>
          <div className="mt-3 text-right">
            <span className={`font-bold ${theme.text.primary}`}>
              Gender Diversity: {calculations.gender_diversity_ratio.toFixed(1)}% Female
            </span>
          </div>
        </div>

        {/* Board Expertise */}
        <div className={`p-4 rounded-lg border-l-4 border-green-500 ${theme.bg.subtle}`}>
          <h3 className={`font-semibold ${theme.text.primary} mb-3`}>Board Expertise (Number of Directors)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Financial Expertise"
              value={formData.financial_expertise}
              onChange={(e) => handleInputChange('financial_expertise', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
            <input
              type="number"
              placeholder="Industry Expertise"
              value={formData.industry_expertise}
              onChange={(e) => handleInputChange('industry_expertise', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
            <input
              type="number"
              placeholder="Technology Expertise"
              value={formData.technology_expertise}
              onChange={(e) => handleInputChange('technology_expertise', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
            <input
              type="number"
              placeholder="ESG Expertise"
              value={formData.esg_expertise}
              onChange={(e) => handleInputChange('esg_expertise', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
          </div>
          <div className="mt-3 text-right">
            <span className={`font-bold ${theme.text.primary}`}>
              Expertise Coverage: {calculations.expertise_coverage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Board Activities */}
        <div className={`p-4 rounded-lg border-l-4 border-orange-500 ${theme.bg.subtle}`}>
          <h3 className={`font-semibold ${theme.text.primary} mb-3`}>Board Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Board Meetings Held"
              value={formData.board_meetings_held}
              onChange={(e) => handleInputChange('board_meetings_held', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
            <input
              type="number"
              placeholder="Average Attendance (%)"
              value={formData.average_attendance}
              onChange={(e) => handleInputChange('average_attendance', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
            <input
              type="number"
              placeholder="Number of Committees"
              value={formData.committees_count}
              onChange={(e) => handleInputChange('committees_count', e.target.value)}
              className={`p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            />
          </div>
        </div>

        {/* Governance Practices */}
        <div className={`p-4 rounded-lg ${theme.bg.subtle}`}>
          <h3 className={`font-semibold ${theme.text.primary} mb-3`}>Governance Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.board_evaluation_conducted}
                onChange={(e) => handleInputChange('board_evaluation_conducted', e.target.checked)}
                className="rounded"
              />
              <label className={theme.text.primary}>Board Evaluation Conducted</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.succession_planning}
                onChange={(e) => handleInputChange('succession_planning', e.target.checked)}
                className="rounded"
              />
              <label className={theme.text.primary}>Succession Planning in Place</label>
            </div>
          </div>
          <textarea
            placeholder="Governance Framework Description"
            value={formData.governance_framework}
            onChange={(e) => handleInputChange('governance_framework', e.target.value)}
            className={`mt-4 w-full p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            rows="3"
          />
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Save Board Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardManagementForm;