import React, { useState } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { FaUser, FaEnvelope, FaCog, FaSignOutAlt } from 'react-icons/fa';
import TwoFactorSetup from './components/TwoFactorSetup';
import EncryptionSetup from './components/EncryptionSetup';
import SecureStorage from './utils/secureStorage';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showEncryptionSetup, setShowEncryptionSetup] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(localStorage.getItem('2fa_enabled') === 'true');
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(SecureStorage.isEncryptionEnabled());

  const currentUser = localStorage.getItem('currentUser');
  const userRole = localStorage.getItem('userRole');
  const userFullName = localStorage.getItem('userFullName');

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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userFullName');
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-xl shadow-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <FaUser className={`text-3xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {userFullName || 'User Profile'}
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {userRole?.replace('_', ' ').toUpperCase() || 'USER'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-4">
                <FaEnvelope className={`text-xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Email Address
                </h3>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentUser || 'No email available'}
              </p>
            </div>

            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-4">
                <FaCog className={`text-xl ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Account Settings
                </h3>
              </div>
              <button
                onClick={() => setShowSecuritySettings(true)}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${isDark ? 'border-[#3a7a44] text-white hover:bg-[#3a7a44]/10' : 'border-[#3a7a44] text-gray-900 hover:bg-[#3a7a44]/10'}`}
              >
                <span className="text-lg">🔒</span>
                <span className="font-medium">Security Settings</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {showSecuritySettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
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

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
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
        <TwoFactorSetup
          onComplete={handle2FAComplete}
          onCancel={() => setShow2FASetup(false)}
          userEmail={currentUser}
        />
      )}

      {showEncryptionSetup && (
        <EncryptionSetup
          onComplete={handleEncryptionComplete}
          onCancel={() => setShowEncryptionSetup(false)}
        />
      )}
    </div>
  );
};

export default Profile;