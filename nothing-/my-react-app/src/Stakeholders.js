import React, { useState, useEffect } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { getThemeClasses } from './utils/themeUtils';
import ProfessionalHeader from './components/ProfessionalHeader';
import { useNavigate } from 'react-router-dom';

const Stakeholders = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const theme = getThemeClasses(isDark);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [animationClass, setAnimationClass] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(null);
  const [newStakeholderData, setNewStakeholderData] = useState({
    name: '',
    type: 'External',
    engagement: 'Medium',
    icon: '👤',
    priority: 'Medium',
    description: '',
    concerns: '',
    nextAction: '',
    satisfaction: 50,
    email: ''
  });
  
  const [stakeholders, setStakeholders] = useState([
    { 
      id: 1, 
      name: 'Investors & Shareholders', 
      type: 'Financial', 
      engagement: 'High', 
      lastContact: '2024-01-15',
      icon: '💰',
      priority: 'Critical',
      description: 'Financial stakeholders including institutional investors, retail shareholders, and financial analysts',
      concerns: ['Financial Performance', 'ESG Risks', 'Long-term Strategy'],
      nextAction: 'Quarterly Earnings Call',
      satisfaction: 85
    },
    { 
      id: 2, 
      name: 'Employees & Workforce', 
      type: 'Internal', 
      engagement: 'Medium', 
      lastContact: '2024-01-10',
      icon: '👥',
      priority: 'High',
      description: 'Internal workforce including full-time employees, contractors, and union representatives',
      concerns: ['Work-Life Balance', 'Career Development', 'Compensation'],
      nextAction: 'Employee Survey Review',
      satisfaction: 72
    },
    { 
      id: 3, 
      name: 'Customers & Clients', 
      type: 'External', 
      engagement: 'High', 
      lastContact: '2024-01-12',
      icon: '🛍️',
      priority: 'Critical',
      description: 'End customers, business clients, and consumer advocacy groups',
      concerns: ['Product Quality', 'Sustainability', 'Customer Service'],
      nextAction: 'Customer Advisory Board',
      satisfaction: 88
    },
    { 
      id: 4, 
      name: 'Regulators & Government', 
      type: 'Compliance', 
      engagement: 'Medium', 
      lastContact: '2024-01-08',
      icon: '🏛️',
      priority: 'High',
      description: 'Government agencies, regulatory bodies, and policy makers',
      concerns: ['Regulatory Compliance', 'Environmental Impact', 'Tax Policy'],
      nextAction: 'Regulatory Filing Review',
      satisfaction: 78
    },
    { 
      id: 5, 
      name: 'Local Communities', 
      type: 'Social', 
      engagement: 'Low', 
      lastContact: '2024-01-05',
      icon: '🏘️',
      priority: 'Medium',
      description: 'Local communities, NGOs, and community leaders in operational areas',
      concerns: ['Environmental Impact', 'Job Creation', 'Community Investment'],
      nextAction: 'Community Town Hall',
      satisfaction: 65
    },
    { 
      id: 6, 
      name: 'Suppliers & Partners', 
      type: 'Business', 
      engagement: 'Medium', 
      lastContact: '2024-01-14',
      icon: '🤝',
      priority: 'High',
      description: 'Supply chain partners, vendors, and strategic business partners',
      concerns: ['Payment Terms', 'Contract Renewals', 'Sustainability Standards'],
      nextAction: 'Supplier Assessment',
      satisfaction: 80
    }
  ]);

  useEffect(() => {
    setAnimationClass('animate-fade-in');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const getEngagementColor = (engagement) => {
    switch(engagement) {
      case 'High': return 'from-green-500 to-emerald-600';
      case 'Medium': return 'from-yellow-500 to-orange-500';
      case 'Low': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'
    }`} style={{
      backgroundImage: isDark 
        ? 'radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)'
        : 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.08) 0%, transparent 50%)'
    }}>
      <ProfessionalHeader 
        onLogout={handleLogout}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className={`rounded-3xl p-8 mb-8 border ${
          isDark 
            ? 'bg-gray-800/90 border-gray-700/50 shadow-2xl backdrop-blur-xl' 
            : 'bg-white/80 backdrop-blur-2xl border-white/50 shadow-xl shadow-indigo-100/50'
        } ${animationClass}`} style={{
          boxShadow: isDark 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.4)'
        }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${
                isDark ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              } shadow-lg`}>
                <span className="text-xl">👥</span>
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${theme.text.primary} mb-2`}>Stakeholder Management</h1>
                <p className={`${theme.text.secondary} text-lg`}>Comprehensive stakeholder engagement and relationship tracking</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/25'
              } transform hover:scale-105`}
            >
              ➕ Add Stakeholder
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-gray-700/50' : 'bg-white/60'
            } backdrop-blur-sm border border-white/20`}>
              <div className="text-2xl font-bold text-green-600">{stakeholders.filter(s => s.engagement === 'High').length}</div>
              <div className={`text-sm ${theme.text.secondary}`}>High Engagement</div>
            </div>
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-gray-700/50' : 'bg-white/60'
            } backdrop-blur-sm border border-white/20`}>
              <div className="text-2xl font-bold text-yellow-600">{stakeholders.filter(s => s.engagement === 'Medium').length}</div>
              <div className={`text-sm ${theme.text.secondary}`}>Medium Engagement</div>
            </div>
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-gray-700/50' : 'bg-white/60'
            } backdrop-blur-sm border border-white/20`}>
              <div className="text-2xl font-bold text-red-600">{stakeholders.filter(s => s.engagement === 'Low').length}</div>
              <div className={`text-sm ${theme.text.secondary}`}>Low Engagement</div>
            </div>
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-gray-700/50' : 'bg-white/60'
            } backdrop-blur-sm border border-white/20`}>
              <div className="text-2xl font-bold text-blue-600">{Math.round(stakeholders.reduce((acc, s) => acc + s.satisfaction, 0) / stakeholders.length)}%</div>
              <div className={`text-sm ${theme.text.secondary}`}>Avg Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Stakeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stakeholders.map((stakeholder, index) => (
            <div 
              key={stakeholder.id} 
              className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                animationClass
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedStakeholder(selectedStakeholder === stakeholder.id ? null : stakeholder.id)}
            >
              <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/80 border-gray-700/50 hover:bg-gray-800/90 hover:border-gray-600' 
                  : 'bg-white/80 border-white/50 hover:bg-white/90 hover:border-white/70'
              } shadow-lg hover:shadow-2xl group-hover:shadow-indigo-500/10`}>
                
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getEngagementColor(stakeholder.engagement)} shadow-lg`}>
                      <span className="text-lg">{stakeholder.icon}</span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${theme.text.primary} group-hover:text-indigo-600 transition-colors`}>
                        {stakeholder.name}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                        getPriorityColor(stakeholder.priority)
                      }`}>
                        {stakeholder.priority} Priority
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete ${stakeholder.name}?`)) {
                          setStakeholders(stakeholders.filter(s => s.id !== stakeholder.id));
                        }
                      }}
                      className="px-3 py-1 rounded-lg transition-all hover:scale-110 bg-white hover:bg-gray-100 text-red-600 hover:text-red-700 border border-red-600 text-sm font-medium"
                      title="Delete Stakeholder"
                    >
                      Delete
                    </button>
                    <div className={`text-lg transition-transform duration-300 ${
                      selectedStakeholder === stakeholder.id ? 'rotate-180' : ''
                    }`}>
                      🔽
                    </div>
                  </div>
                </div>

                {/* Engagement Level */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${theme.text.secondary}`}>Engagement Level</span>
                    <span className={`text-sm font-bold ${
                      stakeholder.engagement === 'High' ? 'text-green-600' :
                      stakeholder.engagement === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {stakeholder.engagement}
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getEngagementColor(stakeholder.engagement)} transition-all duration-500`}
                      style={{ 
                        width: stakeholder.engagement === 'High' ? '90%' : 
                               stakeholder.engagement === 'Medium' ? '60%' : '30%' 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Satisfaction Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${theme.text.secondary}`}>Satisfaction</span>
                    <span className={`text-sm font-bold ${theme.text.primary}`}>{stakeholder.satisfaction}%</span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                      style={{ width: `${stakeholder.satisfaction}%` }}
                    ></div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className={`text-sm ${theme.text.secondary}`}>Type:</span>
                    <span className={`text-sm font-medium ${theme.text.primary}`}>{stakeholder.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${theme.text.secondary}`}>Last Contact:</span>
                    <span className={`text-sm font-medium ${theme.text.primary}`}>{stakeholder.lastContact}</span>
                  </div>
                </div>

                {/* Expandable Details */}
                {selectedStakeholder === stakeholder.id && (
                  <div className={`mt-4 pt-4 border-t space-y-4 animate-fade-in ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div>
                      <h4 className={`font-semibold mb-2 ${theme.text.primary}`}>Description</h4>
                      <p className={`text-sm ${theme.text.secondary}`}>{stakeholder.description}</p>
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold mb-2 ${theme.text.primary}`}>Key Concerns</h4>
                      <div className="flex flex-wrap gap-2">
                        {stakeholder.concerns.map((concern, idx) => (
                          <span key={idx} className={`px-2 py-1 rounded-lg text-xs ${
                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold mb-2 ${theme.text.primary}`}>Next Action</h4>
                      <p className={`text-sm ${theme.text.secondary}`}>{stakeholder.nextAction}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Contact button clicked for:', stakeholder.name);
                          setShowContactModal(stakeholder);
                        }}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          isDark 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
                        } transform hover:scale-105 active:scale-95`}
                      >
                        📞 Contact
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Update button clicked for:', stakeholder.name);
                          setShowUpdateModal(stakeholder);
                        }}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          isDark 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg hover:shadow-gray-500/25' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-lg hover:shadow-gray-500/25'
                        } transform hover:scale-105 active:scale-95`}
                      >
                        📝 Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Stakeholder Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-2xl w-full rounded-2xl p-6 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${theme.text.primary}`}>➕ Add New Stakeholder</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className={`p-2 rounded-lg transition-all ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newStakeholder = {
                id: stakeholders.length + 1,
                name: newStakeholderData.name,
                type: newStakeholderData.type,
                engagement: newStakeholderData.engagement,
                lastContact: new Date().toISOString().split('T')[0],
                icon: newStakeholderData.icon,
                priority: newStakeholderData.priority,
                description: newStakeholderData.description,
                concerns: newStakeholderData.concerns.split(',').map(c => c.trim()).filter(c => c),
                nextAction: newStakeholderData.nextAction,
                satisfaction: parseInt(newStakeholderData.satisfaction),
                email: newStakeholderData.email
              };
              setStakeholders([...stakeholders, newStakeholder]);
              setShowAddForm(false);
              setNewStakeholderData({
                name: '',
                type: 'External',
                engagement: 'Medium',
                icon: '👤',
                priority: 'Medium',
                description: '',
                concerns: '',
                nextAction: '',
                satisfaction: 50,
                email: ''
              });
            }} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Name *</label>
                <input
                  type="text"
                  required
                  value={newStakeholderData.name}
                  onChange={(e) => setNewStakeholderData({...newStakeholderData, name: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter stakeholder name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Type *</label>
                  <select
                    value={newStakeholderData.type}
                    onChange={(e) => setNewStakeholderData({...newStakeholderData, type: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Financial">Financial</option>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Social">Social</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Icon</label>
                  <select
                    value={newStakeholderData.icon}
                    onChange={(e) => setNewStakeholderData({...newStakeholderData, icon: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="💰">💰 Financial</option>
                    <option value="👥">👥 Employees</option>
                    <option value="🛍️">🛍️ Customers</option>
                    <option value="🏛️">🏛️ Government</option>
                    <option value="🏘️">🏘️ Community</option>
                    <option value="🤝">🤝 Partners</option>
                    <option value="👤">👤 Individual</option>
                    <option value="🏢">🏢 Corporate</option>
                    <option value="🌍">🌍 Global</option>
                    <option value="📊">📊 Analysts</option>
                    <option value="⚖️">⚖️ Regulators</option>
                    <option value="🎯">🎯 Strategic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Engagement Level *</label>
                  <select
                    value={newStakeholderData.engagement}
                    onChange={(e) => setNewStakeholderData({...newStakeholderData, engagement: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Priority *</label>
                  <select
                    value={newStakeholderData.priority}
                    onChange={(e) => setNewStakeholderData({...newStakeholderData, priority: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Description *</label>
                <textarea
                  required
                  value={newStakeholderData.description}
                  onChange={(e) => setNewStakeholderData({...newStakeholderData, description: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  rows="3"
                  placeholder="Enter stakeholder description"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Key Concerns (comma-separated)</label>
                <input
                  type="text"
                  value={newStakeholderData.concerns}
                  onChange={(e) => setNewStakeholderData({...newStakeholderData, concerns: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Financial Performance, ESG Risks, Strategy"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Contact Email</label>
                <input
                  type="email"
                  value={newStakeholderData.email}
                  onChange={(e) => setNewStakeholderData({...newStakeholderData, email: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="stakeholder@example.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Next Action</label>
                <input
                  type="text"
                  value={newStakeholderData.nextAction}
                  onChange={(e) => setNewStakeholderData({...newStakeholderData, nextAction: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Schedule Introduction Meeting"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Satisfaction Score: {newStakeholderData.satisfaction}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newStakeholderData.satisfaction}
                  onChange={(e) => setNewStakeholderData({...newStakeholderData, satisfaction: e.target.value})}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    isDark 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                  }`}
                >
                  ✓ Add Stakeholder
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>📞 Contact {showContactModal.name}</h3>
              <button 
                onClick={() => setShowContactModal(null)}
                className={`p-2 rounded-lg ${
                  isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <span className="text-lg">📧</span>
                <div>
                  <div className="font-medium text-blue-900">Email</div>
                  <div className="text-sm text-blue-700">{showContactModal.email || 'contact@company.com'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                <span className="text-lg">📅</span>
                <div>
                  <div className="font-medium text-purple-900">Next Action</div>
                  <div className="text-sm text-purple-700">{showContactModal.nextAction}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Sending email to:', showContactModal.email || 'contact@company.com');
                  window.open(`mailto:${showContactModal.email || 'contact@company.com'}`);
                  setShowContactModal(null);
                }}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer transform hover:scale-105 active:scale-95"
              >
                📧 Send Email
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowContactModal(null);
                }}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors cursor-pointer transform hover:scale-105 active:scale-95 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border p-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>📝 Update {showUpdateModal.name}</h3>
              <button 
                onClick={() => setShowUpdateModal(null)}
                className={`p-2 rounded-lg ${
                  isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Update form submitted for:', showUpdateModal.name);
              
              const formData = new FormData(e.target);
              const updatedStakeholder = {
                ...showUpdateModal,
                engagement: formData.get('engagement'),
                priority: formData.get('priority'),
                satisfaction: parseInt(formData.get('satisfaction')),
                nextAction: formData.get('nextAction'),
                lastContact: new Date().toISOString().split('T')[0]
              };
              
              console.log('Updated stakeholder data:', updatedStakeholder);
              
              setStakeholders(stakeholders.map(s => 
                s.id === showUpdateModal.id ? updatedStakeholder : s
              ));
              
              // Show success message
              alert('✓ Stakeholder updated successfully!');
              
              setShowUpdateModal(null);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Engagement Level</label>
                  <select 
                    name="engagement" 
                    defaultValue={showUpdateModal.engagement}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Priority</label>
                  <select 
                    name="priority" 
                    defaultValue={showUpdateModal.priority}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Next Action</label>
                <input 
                  type="text" 
                  name="nextAction" 
                  defaultValue={showUpdateModal.nextAction}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter next action"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button 
                  type="submit"
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer transform hover:scale-105 active:scale-95"
                >
                  ✓ Update Stakeholder
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowUpdateModal(null);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors cursor-pointer transform hover:scale-105 active:scale-95 ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Stakeholders;