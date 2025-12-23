import React, { useState, useEffect } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { getThemeClasses } from './utils/themeUtils';

function UserManagement() {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is super admin
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'super_admin') {
      alert('Access denied. Super admin privileges required.');
      window.history.back();
      return;
    }

    // Mock data - replace with actual API calls
    const mockUsers = [
      { id: 1, username: 'admin', email: 'admin@company.com', role: 'admin', lastLogin: '2024-01-15 10:30:00', status: 'active' },
      { id: 2, username: 'user1', email: 'user1@company.com', role: 'user', lastLogin: '2024-01-15 09:15:00', status: 'active' },
      { id: 3, username: 'user2', email: 'user2@company.com', role: 'user', lastLogin: '2024-01-14 16:45:00', status: 'inactive' },
      { id: 4, username: 'auditor', email: 'auditor@company.com', role: 'auditor', lastLogin: '2024-01-15 08:20:00', status: 'active' }
    ];

    const mockActiveUsers = [
      { id: 1, username: 'admin', currentPage: 'Dashboard', loginTime: '2024-01-15 10:30:00' },
      { id: 2, username: 'user1', currentPage: 'Data Entry', loginTime: '2024-01-15 09:15:00' },
      { id: 4, username: 'auditor', currentPage: 'Reports', loginTime: '2024-01-15 08:20:00' }
    ];

    setUsers(mockUsers);
    setActiveUsers(mockActiveUsers);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={theme.text.secondary}>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>User Management</h1>
          <p className={theme.text.secondary}>Monitor user activity and manage access (Super Admin Only)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* All Users */}
          <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-xl font-semibold ${theme.text.primary} mb-4`}>All Users</h2>
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className={`p-4 rounded-lg border ${theme.border.primary} ${theme.hover.card}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${theme.text.primary}`}>{user.username}</h3>
                      <p className={`text-sm ${theme.text.secondary}`}>{user.email}</p>
                      <p className={`text-xs ${theme.text.secondary}`}>Role: {user.role}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                      <p className={`text-xs ${theme.text.secondary} mt-1`}>
                        Last: {new Date(user.lastLogin).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currently Active Users */}
          <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-xl font-semibold ${theme.text.primary} mb-4`}>Currently Active</h2>
            <div className="space-y-3">
              {activeUsers.map(user => (
                <div key={user.id} className={`p-4 rounded-lg border ${theme.border.primary} ${theme.hover.card}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${theme.text.primary}`}>{user.username}</h3>
                      <p className={`text-sm ${theme.text.secondary}`}>On: {user.currentPage}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">ONLINE</span>
                      </div>
                      <p className={`text-xs ${theme.text.secondary} mt-1`}>
                        Since: {new Date(user.loginTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <h3 className={`text-sm font-medium ${theme.text.secondary}`}>Total Users</h3>
            <p className={`text-2xl font-bold ${theme.text.primary}`}>{users.length}</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <h3 className={`text-sm font-medium ${theme.text.secondary}`}>Active Now</h3>
            <p className={`text-2xl font-bold text-green-600`}>{activeUsers.length}</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <h3 className={`text-sm font-medium ${theme.text.secondary}`}>Admins</h3>
            <p className={`text-2xl font-bold text-blue-600`}>{users.filter(u => u.role === 'admin').length}</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <h3 className={`text-sm font-medium ${theme.text.secondary}`}>Regular Users</h3>
            <p className={`text-2xl font-bold text-purple-600`}>{users.filter(u => u.role === 'user').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;