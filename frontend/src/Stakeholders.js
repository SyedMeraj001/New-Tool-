import React, { useState, useEffect } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { getThemeClasses } from './utils/themeUtils';
import ProfessionalHeader from './components/ProfessionalHeader';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const Stakeholders = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const theme = getThemeClasses(isDark);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [animationClass, setAnimationClass] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStakeholder, setNewStakeholder] = useState({
    name: '',
    type: 'External',
    engagement: 'Medium',
    priority: 'Medium',
    description: '',
    concerns: '',
    nextAction: '',
    contactEmail: '',
    department: '',
    influence: 'Medium',
    interest: 'Medium',
    stakeholderPercentage: 0,
    icon: '👤'
  });
  
  const [stakeholders, setStakeholders] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/login');
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    loadStakeholders();
  }, []);

  const loadStakeholders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stakeholders`);
      const result = await response.json();
      if (result.success) {
        setStakeholders(result.data.map(s => ({
          ...s,
          engagement: s.engagement_level,
          lastContact: s.last_contact,
          concerns: s.key_concerns ? s.key_concerns.split(',').map(c => c.trim()) : [],
          nextAction: s.next_action,
          contactEmail: s.contact_email,
          stakeholderPercentage: s.stakeholder_percentage,
          satisfaction: s.satisfaction || Math.floor(Math.random() * 30) + 60
        })));
      }
    } catch (error) {
      console.error('Failed to load stakeholders:', error);
      setStakeholders([]); // Show empty if API fails
    }
  };

  const saveStakeholder = async (stakeholderData) => {
    try {
      const payload = {
        name: stakeholderData.name,
        type: stakeholderData.type,
        engagement_level: stakeholderData.engagement,
        priority: stakeholderData.priority,
        description: stakeholderData.description,
        key_concerns: Array.isArray(stakeholderData.concerns) 
          ? stakeholderData.concerns.join(', ') 
          : stakeholderData.concerns,
        next_action: stakeholderData.nextAction,
        contact_email: stakeholderData.contactEmail,
        department: stakeholderData.department,
        stakeholder_percentage: stakeholderData.stakeholderPercentage,
        icon: stakeholderData.icon
      };

      console.log('Sending payload:', payload);

      const response = await fetch(`${API_BASE_URL}/stakeholders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        await loadStakeholders(); // Reload from database
        return true;
      } else {
        console.error('Failed to save stakeholder:', result.error);
        alert(`Save failed: ${result.error}`);
        return false;
      }
    } catch (error) {
      console.error('Error saving stakeholder:', error);
      alert(`Network error: ${error.message}`);
      return false;
    }
  };

  const updateStakeholder = async (id, stakeholderData) => {
    try {
      const payload = {
        name: stakeholderData.name,
        type: stakeholderData.type,
        engagement_level: stakeholderData.engagement,
        priority: stakeholderData.priority,
        description: stakeholderData.description,
        key_concerns: Array.isArray(stakeholderData.concerns) 
          ? stakeholderData.concerns.join(', ') 
          : stakeholderData.concerns,
        next_action: stakeholderData.nextAction,
        contact_email: stakeholderData.contactEmail,
        department: stakeholderData.department,
        stakeholder_percentage: stakeholderData.stakeholderPercentage,
        icon: stakeholderData.icon
      };

      const response = await fetch(`${API_BASE_URL}/stakeholders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        await loadStakeholders(); // Reload from database
        return true;
      } else {
        console.error('Failed to update stakeholder:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating stakeholder:', error);
      return false;
    }
  };

  const deleteStakeholder = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stakeholders/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        await loadStakeholders(); // Reload from database
        return true;
      } else {
        console.error('Failed to delete stakeholder:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting stakeholder:', error);
      return false;
    }
  };

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
    if (isDark) {
      switch(priority) {
        case 'Critical': return 'bg-red-900/50 text-red-300 border-red-700/50';
        case 'High': return 'bg-orange-900/50 text-orange-300 border-orange-700/50';
        case 'Medium': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50';
        default: return 'bg-gray-700/50 text-gray-300 border-gray-600/50';
      }
    } else {
      switch(priority) {
        case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
        case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gray-900' 
        : 'bg-gray-50'
    }`}>
      <ProfessionalHeader 
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      <main className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className={`rounded-xl p-6 mb-6 ${
          isDark 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200 shadow-sm'
        } ${animationClass}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                isDark ? 'bg-blue-600' : 'bg-blue-600'
              }`}>
                <span className="text-2xl text-white">👥</span>
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${theme.text.primary} mb-1`}>Stakeholder Management</h1>
                <p className={`${theme.text.secondary}`}>Comprehensive stakeholder engagement and relationship tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setEditingStakeholder(null);
                  setNewStakeholder({
                    name: '', type: 'External', engagement: 'Medium', priority: 'Medium',
                    description: '', concerns: '', nextAction: '', contactEmail: '',
                    department: '', influence: 'Medium', interest: 'Medium', stakeholderPercentage: 0,
                    icon: '👤'
                  });
                  setShowAddForm(true);
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                + Add Stakeholder
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="text-2xl font-bold text-green-600">{stakeholders.filter(s => s.engagement === 'High').length}</div>
              <div className={`text-sm ${theme.text.secondary}`}>High Engagement</div>
            </div>
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="text-2xl font-bold text-yellow-600">{stakeholders.filter(s => s.engagement === 'Medium').length}</div>
              <div className={`text-sm ${theme.text.secondary}`}>Medium Engagement</div>
            </div>
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="text-2xl font-bold text-red-600">{stakeholders.filter(s => s.engagement === 'Low').length}</div>
              <div className={`text-sm ${theme.text.secondary}`}>Low Engagement</div>
            </div>
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="text-2xl font-bold text-blue-600">{Math.round(stakeholders.reduce((acc, s) => acc + s.satisfaction, 0) / stakeholders.length)}%</div>
              <div className={`text-sm ${theme.text.secondary}`}>Avg Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Add Stakeholder Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            } shadow-2xl`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${theme.text.primary}`}>{editingStakeholder ? 'Update Stakeholder' : 'Add New Stakeholder'}</h2>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className={`p-2 rounded-lg transition-all ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  
                  if (isSubmitting) return; // Prevent double submission
                  setIsSubmitting(true);
                  
                  const stakeholderData = {
                    name: newStakeholder.name,
                    type: newStakeholder.type,
                    engagement: newStakeholder.engagement,
                    priority: newStakeholder.priority,
                    description: newStakeholder.description,
                    concerns: newStakeholder.concerns.split(',').map(c => c.trim()).filter(c => c),
                    nextAction: newStakeholder.nextAction,
                    contactEmail: newStakeholder.contactEmail,
                    department: newStakeholder.department,
                    influence: newStakeholder.influence,
                    interest: newStakeholder.interest,
                    stakeholderPercentage: newStakeholder.stakeholderPercentage,
                    icon: newStakeholder.icon
                  };

                  let success = false;
                  if (editingStakeholder) {
                    success = await updateStakeholder(editingStakeholder.id, stakeholderData);
                  } else {
                    success = await saveStakeholder(stakeholderData);
                  }

                  if (success) {
                    setNewStakeholder({
                      name: '', type: 'External', engagement: 'Medium', priority: 'Medium',
                      description: '', concerns: '', nextAction: '', contactEmail: '',
                      department: '', influence: 'Medium', interest: 'Medium', stakeholderPercentage: 0,
                      icon: '👤'
                    });
                    setEditingStakeholder(null);
                    setShowAddForm(false);
                  } else {
                    alert('Failed to save stakeholder. Please try again.');
                  }
                  
                  setIsSubmitting(false);
                }} className="space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Name *</label>
                      <input
                        type="text"
                        required
                        value={newStakeholder.name}
                        onChange={(e) => setNewStakeholder({...newStakeholder, name: e.target.value})}
                        className={`w-full p-3 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter stakeholder name"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Type</label>
                      <select
                        value={newStakeholder.type}
                        onChange={(e) => setNewStakeholder({...newStakeholder, type: e.target.value})}
                        className={`w-full p-3 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500`}
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
                      <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Engagement Level</label>
                      <select
                        value={newStakeholder.engagement}
                        onChange={(e) => setNewStakeholder({...newStakeholder, engagement: e.target.value})}
                        className={`w-full p-3 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Priority</label>
                      <select
                        value={newStakeholder.priority}
                        onChange={(e) => setNewStakeholder({...newStakeholder, priority: e.target.value})}
                        className={`w-full p-3 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Contact Email</label>
                      <input
                        type="email"
                        value={newStakeholder.contactEmail}
                        onChange={(e) => setNewStakeholder({...newStakeholder, contactEmail: e.target.value})}
                        className={`w-full p-3 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500`}
                        placeholder="email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Stakeholder Percentage (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={newStakeholder.stakeholderPercentage}
                        onChange={(e) => setNewStakeholder({...newStakeholder, stakeholderPercentage: parseFloat(e.target.value) || 0})}
                        className={`w-full p-3 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500`}
                        placeholder="0.0"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Department/Organization</label>
                      <input
                        type="text"
                        value={newStakeholder.department}
                        onChange={(e) => setNewStakeholder({...newStakeholder, department: e.target.value})}
                        className={`w-full p-3 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500`}
                        placeholder="Department or organization"
                      />
                    </div>
                    
                    <div className="relative">
                      <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Icon</label>
                      <button
                        type="button"
                        onClick={() => setShowIconDropdown(!showIconDropdown)}
                        className={`w-full p-3 rounded-lg border flex items-center justify-between ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{newStakeholder.icon}</span>
                          <span>Select Icon</span>
                        </div>
                        <span className={`transition-transform ${showIconDropdown ? 'rotate-180' : ''}`}>▼</span>
                      </button>
                      {showIconDropdown && (
                        <div className={`absolute top-full left-0 right-0 mt-1 p-2 rounded-lg border shadow-lg z-10 ${
                          isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}>
                          <div className="grid grid-cols-8 gap-1">
                            {['👤', '💰', '👥', '🛍️', '🏛️', '🏘️', '🤝', '🏢', '🏭', '🏥', '🏫', '🏬', '🏦', '🏨', '🏪', '🌍'].map((emoji, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setNewStakeholder({...newStakeholder, icon: emoji});
                                  setShowIconDropdown(false);
                                }}
                                className={`p-2 text-lg rounded hover:bg-gray-100 transition-colors ${
                                  isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                                }`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Description</label>
                    <textarea
                      value={newStakeholder.description}
                      onChange={(e) => setNewStakeholder({...newStakeholder, description: e.target.value})}
                      rows={3}
                      className={`w-full p-3 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500`}
                      placeholder="Describe the stakeholder and their role..."
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Key Concerns</label>
                    <input
                      type="text"
                      value={newStakeholder.concerns}
                      onChange={(e) => setNewStakeholder({...newStakeholder, concerns: e.target.value})}
                      className={`w-full p-3 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500`}
                      placeholder="Separate concerns with commas (e.g., Financial Performance, ESG Risks)"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Next Action</label>
                    <input
                      type="text"
                      value={newStakeholder.nextAction}
                      onChange={(e) => setNewStakeholder({...newStakeholder, nextAction: e.target.value})}
                      className={`w-full p-3 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500`}
                      placeholder="Next planned action or meeting"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : isDark 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      } shadow-lg hover:shadow-xl transform hover:scale-105`}
                    >
                      {isSubmitting ? '⏳ Processing...' : `✅ ${editingStakeholder ? 'Update Stakeholder' : 'Add Stakeholder'}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

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
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                  : 'bg-white border-gray-200 hover:shadow-md'
              }`}>
                
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getEngagementColor(stakeholder.engagement)} shadow-lg`}>
                      <span className="text-2xl">{stakeholder.icon}</span>
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
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this stakeholder?')) {
                          await deleteStakeholder(stakeholder.id);
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        isDark 
                          ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50'
                          : 'bg-white hover:bg-gray-50 text-red-600 border border-red-600'
                      }`}
                      title="Delete Stakeholder"
                    >
                      Delete
                    </button>
                    <div className={`text-2xl transition-transform duration-300 ${
                      selectedStakeholder === stakeholder.id ? 'rotate-90' : ''
                    }`}>
                      ▶
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
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
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

                    {stakeholder.stakeholderPercentage && (
                      <div>
                        <h4 className={`font-semibold mb-2 ${theme.text.primary}`}>Stakeholder Percentage</h4>
                        <div className="flex items-center gap-2">
                          <div className={`flex-1 bg-gray-200 rounded-full h-2 ${
                            isDark ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                              style={{ width: `${stakeholder.stakeholderPercentage}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-bold ${theme.text.primary}`}>{stakeholder.stakeholderPercentage}%</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 pt-2">
                      {(stakeholder.contactEmail || stakeholder.contact_email) ? (
                        <>
                          <div className={`text-xs ${theme.text.secondary}`}>
                            📧 {stakeholder.contactEmail || stakeholder.contact_email}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const email = stakeholder.contactEmail || stakeholder.contact_email;
                                window.open(`https://mail.google.com/mail/u/0/?view=cm&to=${email}`, '_blank');
                              }}
                              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                              isDark 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}>
                              📧 Contact
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingStakeholder(stakeholder);
                                setNewStakeholder({
                                  name: stakeholder.name,
                                  type: stakeholder.type,
                                  engagement: stakeholder.engagement,
                                  priority: stakeholder.priority,
                                  description: stakeholder.description,
                                  concerns: Array.isArray(stakeholder.concerns) ? stakeholder.concerns.join(', ') : stakeholder.concerns || '',
                                  nextAction: stakeholder.nextAction,
                                  contactEmail: stakeholder.contactEmail || '',
                                  department: stakeholder.department || '',
                                  influence: stakeholder.influence || 'Medium',
                                  interest: stakeholder.interest || 'Medium',
                                  stakeholderPercentage: stakeholder.stakeholderPercentage || 0,
                                  icon: stakeholder.icon
                                });
                                setShowAddForm(true);
                              }}
                              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                isDark 
                                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                              }`}
                            >
                              📝 Update
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex gap-2">
                          <div className={`flex-1 py-2 px-4 rounded-lg text-sm text-center ${
                            isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                          }`}>
                            No email available
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStakeholder(stakeholder);
                              setNewStakeholder({
                                name: stakeholder.name,
                                type: stakeholder.type,
                                engagement: stakeholder.engagement,
                                priority: stakeholder.priority,
                                description: stakeholder.description,
                                concerns: Array.isArray(stakeholder.concerns) ? stakeholder.concerns.join(', ') : stakeholder.concerns || '',
                                nextAction: stakeholder.nextAction,
                                contactEmail: stakeholder.contactEmail || '',
                                department: stakeholder.department || '',
                                influence: stakeholder.influence || 'Medium',
                                interest: stakeholder.interest || 'Medium',
                                stakeholderPercentage: stakeholder.stakeholderPercentage || 0,
                                icon: stakeholder.icon
                              });
                              setShowAddForm(true);
                            }}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                              isDark 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                          >
                            📝 Update
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <style>{`
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