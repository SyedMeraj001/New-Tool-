import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import companyLogo from '../companyLogo.jpg';
import { getUserRole, USER_ROLES } from '../utils/rbac';
import SuperAdminNotifications from './SuperAdminNotifications';
import TwoFactorSetup from './TwoFactorSetup';
import EncryptionSetup from './EncryptionSetup';
import SecureStorage from '../utils/secureStorage';

const ProfessionalHeader = ({ onLogout, currentUser, actions = [] }) => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState(localStorage.getItem('backgroundTheme') || null);
  const [showApprovals, setShowApprovals] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [showSuperAdminPanel, setShowSuperAdminPanel] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showEncryptionSetup, setShowEncryptionSetup] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(localStorage.getItem('2fa_enabled') === 'true');
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(SecureStorage.isEncryptionEnabled());
  const [profilePic, setProfilePic] = useState(null);
  const userRole = currentUser?.role || getUserRole();
  const isAdmin = userRole === 'super_admin';

  // Fetch profile photo from backend
  useEffect(() => {
    if (currentUser?.profilePhoto) {
      setProfilePic(currentUser.profilePhoto);
    }
  }, [currentUser]);

  useEffect(() => {
    const loadPendingUsers = () => {
      if (isAdmin) {
        const pending = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
        setPendingUsers(pending.filter(user => user.status === 'pending'));
      }
    };
    
    const loadRecentAlerts = () => {
      const alerts = JSON.parse(localStorage.getItem('recentAlerts') || '[]');
      const now = new Date();
      const last24Hours = alerts.filter(alert => {
        const alertTime = new Date(alert.timestamp);
        return (now - alertTime) < 24 * 60 * 60 * 1000;
      });
      setRecentAlerts(last24Hours.slice(0, 10));
    };
    
    loadPendingUsers();
    loadRecentAlerts();
    loadPendingApprovals();
    
    const interval = setInterval(() => {
      loadPendingUsers();
      loadRecentAlerts();
      loadPendingApprovals();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleApprove = (userEmail) => {
    const pending = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const approved = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
    
    const userIndex = pending.findIndex(u => u.email === userEmail);
    if (userIndex !== -1) {
      const user = { ...pending[userIndex] };
      user.status = 'approved';
      user.approvedDate = new Date().toISOString();
      
      approved.push(user);
      pending.splice(userIndex, 1);
      
      localStorage.setItem('pendingUsers', JSON.stringify(pending));
      localStorage.setItem('approvedUsers', JSON.stringify(approved));
      
      setPendingUsers(pending.filter(u => u.status === 'pending'));
    }
  };

  const handleReject = (userEmail) => {
    const pending = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const userIndex = pending.findIndex(u => u.email === userEmail);
    if (userIndex !== -1) {
      pending.splice(userIndex, 1);
      localStorage.setItem('pendingUsers', JSON.stringify(pending));
      setPendingUsers(pending.filter(u => u.status === 'pending'));
    }
  };

  const markAlertAsRead = (alertId) => {
    const alerts = JSON.parse(localStorage.getItem('recentAlerts') || '[]');
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    );
    localStorage.setItem('recentAlerts', JSON.stringify(updatedAlerts));
    setRecentAlerts(updatedAlerts.filter(alert => {
      const alertTime = new Date(alert.timestamp);
      const now = new Date();
      return (now - alertTime) < 24 * 60 * 60 * 1000;
    }).slice(0, 10));
  };

  const clearAllAlerts = () => {
    localStorage.setItem('recentAlerts', JSON.stringify([]));
    setRecentAlerts([]);
    // Dispatch storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'recentAlerts',
      newValue: '[]',
      oldValue: localStorage.getItem('recentAlerts')
    }));
    // Also dispatch custom event for immediate updates
    window.dispatchEvent(new CustomEvent('alertsCleared'));
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const maxSize = 100;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          try {
            const response = await fetch('http://localhost:5000/api/profile/photo', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ photoData: compressedDataUrl })
            });
            
            if (response.ok) {
              const data = await response.json();
              setProfilePic(compressedDataUrl);
              // Update currentUser if available
              if (currentUser) {
                currentUser.profilePhoto = compressedDataUrl;
              }
            }
          } catch (error) {
            alert('Upload failed');
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePic = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/photo', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setProfilePic(null);
        if (currentUser) {
          currentUser.profilePhoto = null;
        }
      }
    } catch (error) {
      console.error('Failed to remove profile photo:', error);
    }
  };

  const loadPendingApprovals = () => {
    if (userRole === 'supervisor' || userRole === 'super_admin') {
      const workflows = JSON.parse(localStorage.getItem('approvalWorkflows') || '[]');
      const pending = workflows.filter(w => w.status === 'pending').length;
      
      // Also count signup requests for super admin
      let signupRequestsCount = 0;
      if (userRole === 'super_admin') {
        const signupRequests = JSON.parse(localStorage.getItem('signupRequests') || '[]');
        signupRequestsCount = signupRequests.filter(r => r.status === 'pending').length;
      }
      
      setPendingCount(pending + signupRequestsCount);
    } else {
      setPendingCount(0);
    }
  };

  const handleSignupApprove = (requestId) => {
    const requests = JSON.parse(localStorage.getItem('signupRequests') || '[]');
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
      approvedUsers.push({
        ...request,
        status: 'approved',
        approvedDate: new Date().toISOString()
      });
      localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
      
      const updatedRequests = requests.filter(r => r.id !== requestId);
      localStorage.setItem('signupRequests', JSON.stringify(updatedRequests));
      
      loadPendingApprovals();
    }
  };

  const handleSignupReject = (requestId) => {
    const reason = prompt('Reason for rejection (optional):');
    const requests = JSON.parse(localStorage.getItem('signupRequests') || '[]');
    const updatedRequests = requests.filter(r => r.id !== requestId);
    localStorage.setItem('signupRequests', JSON.stringify(updatedRequests));
    loadPendingApprovals();
  };

  const unreadAlertsCount = recentAlerts.filter(alert => !alert.read).length;
  const totalNotifications = (isAdmin ? pendingUsers.length : 0) + unreadAlertsCount + pendingCount;

  const applyBackgroundTheme = (themeUrl) => {
    const overlay = isDark 
      ? 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))' 
      : 'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1))';
    
    // Apply to body
    document.body.style.backgroundImage = `${overlay}, url(${themeUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    
    // Also apply to main containers
    const mainContainers = document.querySelectorAll('main, .min-h-screen');
    mainContainers.forEach(container => {
      container.style.backgroundImage = 'inherit';
      container.style.backgroundColor = 'transparent';
    });
  };

  const handleThemeUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const themeUrl = e.target.result;
        setBackgroundTheme(themeUrl);
        localStorage.setItem('backgroundTheme', themeUrl);
        applyBackgroundTheme(themeUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomTheme = () => {
    setBackgroundTheme(null);
    localStorage.removeItem('backgroundTheme');
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundAttachment = '';
    
    // Reset main containers
    const mainContainers = document.querySelectorAll('main, .min-h-screen');
    mainContainers.forEach(container => {
      container.style.backgroundImage = '';
      container.style.backgroundColor = '';
    });
  };

  const handle2FAToggle = () => {
    if (is2FAEnabled) {
      if (window.confirm('Are you sure you want to disable Two-Factor Authentication?')) {
        localStorage.removeItem('2fa_enabled');
        localStorage.removeItem('2fa_method');
        setIs2FAEnabled(false);
      }
    } else {
      setShow2FASetup(true);
    }
  };

  const handle2FAComplete = () => {
    setShow2FASetup(false);
    setIs2FAEnabled(true);
  };

  const handleEncryptionToggle = () => {
    if (isEncryptionEnabled) {
      if (window.confirm('Disabling encryption will decrypt all data. Continue?')) {
        localStorage.removeItem('encryption_enabled');
        setIsEncryptionEnabled(false);
        alert('Encryption disabled.');
      }
    } else {
      setShowEncryptionSetup(true);
    }
  };

  const handleEncryptionComplete = () => {
    setShowEncryptionSetup(false);
    setIsEncryptionEnabled(true);
  };

  useEffect(() => {
    if (backgroundTheme) {
      applyBackgroundTheme(backgroundTheme);
    }
  }, [backgroundTheme, isDark]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/data-entry', label: 'Data Entry', icon: '📝' },
    { path: '/reports', label: 'Reports', icon: '📋' },
    { path: '/workflow', label: 'Approval', icon: '📋' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/compliance', label: 'Compliance', icon: '✅' },
    { path: '/regulatory', label: 'Regulatory', icon: '⚖️' },
    { path: '/stakeholders', label: 'Stakeholders', icon: '👥' }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-r from-teal-700 to-emerald-800 border-teal-600' 
        : 'bg-gradient-to-r from-teal-600 to-emerald-700 border-teal-500'
    } backdrop-blur-xl border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src={companyLogo} alt="ESG Platform" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-white'
              }`}>E-S-Genius</h1>
              <p className={`text-xs ${isDark ? 'text-teal-100' : 'text-teal-100'}`}>ESG Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center max-w-3xl">
            {navItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? (isDark ? 'bg-white/20 text-white' : 'bg-white/20 text-white')
                      : isDark
                        ? 'text-teal-100 hover:text-white hover:bg-white/10'
                        : 'text-teal-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'text-teal-100 hover:bg-white/10' 
                    : 'text-teal-100 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">🔔</span>
                {totalNotifications > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{totalNotifications > 9 ? '9+' : totalNotifications}</span>
                  </div>
                )}
              </button>
              
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className={`absolute right-0 top-12 w-80 rounded-lg shadow-xl border z-50 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`p-3 border-b flex items-center justify-between ${
                      isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'
                    }`}>
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <span>🔔</span>Notifications
                      </h3>
                      {recentAlerts.length > 0 && (
                        <button
                          onClick={clearAllAlerts}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {/* Signup Requests for Super Admin */}
                      {userRole === 'super_admin' && (() => {
                        const signupRequests = JSON.parse(localStorage.getItem('signupRequests') || '[]');
                        return signupRequests.filter(r => r.status === 'pending').map((request) => (
                          <div key={request.id} className={`p-3 border-b ${
                            isDark ? 'border-gray-700' : 'border-gray-100'
                          }`}>
                            <div className="flex items-start gap-2">
                              <span className="text-sm text-blue-500">👤</span>
                              <div className="flex-1">
                                <h4 className={`font-medium text-xs ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                  New Signup Request
                                </h4>
                                <p className={`text-xs mt-1 ${
                                  isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {request.fullName} ({request.email}) - {request.role.replace('_', ' ')}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => handleSignupApprove(request.id)}
                                    className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium transition-colors"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleSignupReject(request.id)}
                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-medium transition-colors"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                      
                      {/* Super Admin Panel Button */}
                      {userRole === 'super_admin' && (
                        <div className={`p-3 border-b cursor-pointer transition-colors ${
                          isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setShowNotifications(false);
                          setShowSuperAdminPanel(true);
                        }}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">👑</span>
                            <div className="flex-1">
                              <h4 className={`font-medium text-sm ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                Super Admin Panel
                              </h4>
                              <p className={`text-xs mt-1 ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Manage signup requests and notifications
                              </p>
                            </div>
                            <span className="text-xs text-blue-500 font-medium">View</span>
                          </div>
                        </div>
                      )}
                      
                      {recentAlerts.length === 0 ? (
                        <div className={`p-4 text-center ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <span className="text-xl mb-2 block">📭</span>
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        recentAlerts.map((alert) => (
                          <div 
                            key={alert.id} 
                            className={`p-3 border-b cursor-pointer transition-colors ${
                              isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                            } ${alert.read ? 'opacity-60' : ''}`}
                            onClick={() => markAlertAsRead(alert.id)}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`text-sm ${
                                alert.type === 'error' ? 'text-red-500' :
                                alert.type === 'warning' ? 'text-yellow-500' :
                                alert.type === 'success' ? 'text-green-500' : 'text-blue-500'
                              }`}>
                                {alert.type === 'error' ? '🚨' :
                                 alert.type === 'warning' ? '⚠️' :
                                 alert.type === 'success' ? '✅' : 'ℹ️'}
                              </span>
                              <div className="flex-1">
                                <h4 className={`font-medium text-xs ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                } ${!alert.read ? 'font-semibold' : ''}`}>
                                  {alert.title}
                                </h4>
                                <p className={`text-xs mt-1 ${
                                  isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {alert.message}
                                </p>
                                <span className={`text-xs ${
                                  isDark ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              {!alert.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`relative p-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  showUserMenu 
                    ? 'bg-white/20 shadow-lg' 
                    : isDark 
                      ? 'text-teal-100 hover:bg-white/10' 
                      : 'text-teal-100 hover:bg-white/10'
                } group`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-bold">👤</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </button>
              
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className={`absolute right-0 top-12 w-72 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 transform transition-all duration-300 scale-100 opacity-100 ${
                    isDark 
                      ? 'bg-gray-900/95 border-gray-700/50' 
                      : 'bg-white/95 border-gray-200/50'
                  }`}>
                    {/* Header with gradient background */}
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600"></div>
                      <div className="relative p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg overflow-hidden">
                              {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white text-xl">👤</span>
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white text-base">
                              {currentUser?.fullName || 'User'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-white/20 rounded-full text-white font-medium">
                                {userRole === 'super_admin' ? 'Super Admin' :
                                 userRole === 'supervisor' ? 'Supervisor' :
                                 userRole === 'data_entry' ? 'Data Entry' : 'User'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Profile Picture Upload Controls */}
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePicUpload}
                              className="hidden"
                              id="profile-pic-upload"
                            />
                            <label
                              htmlFor="profile-pic-upload"
                              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm"
                            >
                              🖼️ {profilePic ? 'Change Photo' : 'Upload Photo'}
                            </label>
                            {profilePic && (
                              <button
                                onClick={removeProfilePic}
                                className="px-3 py-1.5 bg-red-500/30 hover:bg-red-500/40 text-white text-xs font-medium rounded-lg transition-all duration-200 backdrop-blur-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Theme Toggle */}
                      <div className={`mb-4 p-3 rounded-xl border transition-all duration-200 ${
                        isDark 
                          ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600/30' 
                          : 'bg-gradient-to-br from-gray-50/80 to-white/80 border-gray-200/50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{isDark ? '🌙' : '☀️'}</span>
                            <p className={`text-sm font-semibold ${
                              isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              Theme
                            </p>
                          </div>
                          <button
                            onClick={toggleTheme}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                              isDark 
                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                                : 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30'
                            }`}
                          >
                            {isDark ? 'Light Mode' : 'Dark Mode'}
                          </button>
                        </div>
                      </div>

                      {/* Security Settings */}
                      <div className={`mb-4 p-3 rounded-xl border transition-all duration-200 ${
                        isDark 
                          ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600/30' 
                          : 'bg-gradient-to-br from-gray-50/80 to-white/80 border-gray-200/50'
                      }`}>
                        <button
                          onClick={() => setShowSecuritySettings(true)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                            isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🔒</span>
                            <p className={`text-sm font-semibold ${
                              isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              Security Settings
                            </p>
                          </div>
                          <span className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>▶</span>
                        </button>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          localStorage.removeItem('userRole');
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
                      >
                        <span className="group-hover:rotate-12 transition-transform duration-200">🚪</span> 
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings Modal */}
      {showSecuritySettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}>
          <div className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`} style={{ margin: 'auto', zIndex: 100000 }}>
            <div className="p-6 bg-gradient-to-r from-[#3a7a44] to-[#1b3a2d] text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl">🔒</span>
                    Security Settings
                  </h2>
                  <p className="text-white/80 mt-1">Manage your account security</p>
                </div>
                <button onClick={() => setShowSecuritySettings(false)} className="text-2xl text-white hover:text-red-300 hover:rotate-90 transition-all duration-300 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
              </div>
            </div>

            <div className="p-6">
              <div className={`p-6 rounded-lg border mb-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🔐</div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Two-Factor Authentication
                      </h3>
                      <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handle2FAToggle}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      is2FAEnabled
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {is2FAEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>

                {is2FAEnabled && (
                  <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 text-xl">✓</span>
                      <span className={`font-semibold ${isDark ? 'text-green-800' : 'text-green-800'}`}>2FA is Active</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Method: {localStorage.getItem('2fa_method') === 'email' ? '📧 Email' : localStorage.getItem('2fa_method') === 'sms' ? '📱 SMS' : '🔐 Authenticator App'}
                    </p>
                  </div>
                )}
              </div>

              <div className={`p-6 rounded-lg border mb-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🔐</div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Client-Side Encryption
                      </h3>
                      <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        AES-256 encryption for all sensitive data
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleEncryptionToggle}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isEncryptionEnabled
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isEncryptionEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>

                {isEncryptionEnabled && (
                  <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 text-xl">✓</span>
                      <span className="font-semibold text-green-800">Encryption Active</span>
                    </div>
                    <p className="text-sm text-green-700">
                      All data is encrypted with AES-256 before storage
                    </p>
                  </div>
                )}
              </div>

              <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Security Tips</h3>
                  </div>
                </div>
                <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Use a strong, unique password for your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Enable two-factor authentication for extra security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Never share your password with anyone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Log out from shared or public devices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {show2FASetup && (
        <div style={{ zIndex: 999999 }}>
          <TwoFactorSetup
            onComplete={handle2FAComplete}
            onCancel={() => setShow2FASetup(false)}
            userEmail={currentUser?.email || ''}
          />
        </div>
      )}

      {showEncryptionSetup && (
        <div style={{ zIndex: 999999 }}>
          <EncryptionSetup
            onComplete={handleEncryptionComplete}
            onCancel={() => setShowEncryptionSetup(false)}
          />
        </div>
      )}

      {showSuperAdminPanel && (
        <SuperAdminNotifications
          userRole={userRole}
          onClose={() => setShowSuperAdminPanel(false)}
        />
      )}
    </header>
  );
};

export default ProfessionalHeader;