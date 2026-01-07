import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      console.log('🔍 Fetching pending users from:', `${API}/api/auth/pending-users`);
      const res = await fetch(`${API}/api/auth/pending-users`, {
        credentials: 'include'
      });
      console.log('📡 Response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Pending users:', data);
        setPendingUsers(data);
      } else {
        console.error('❌ Failed to fetch users, status:', res.status);
      }
    } catch (err) {
      console.error('❌ Failed to load users:', err);
    }
  };

  const approveUser = async (userId) => {
    try {
      const res = await fetch(`${API}/api/auth/approve-user/${userId}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        loadUsers();
      }
    } catch (err) {
      console.error('Failed to approve user:', err);
    }
  };

  const rejectUser = async (userId) => {
    try {
      const res = await fetch(`${API}/api/auth/reject-user/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        loadUsers();
      }
    } catch (err) {
      console.error('Failed to reject user:', err);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Panel - User Management</h1>
          <button 
            onClick={() => navigate('/')}
            className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}`}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Pending Users */}
        <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Pending Approvals ({pendingUsers.length})</h2>
          {pendingUsers.length === 0 ? (
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div key={user.id} className={`flex items-center justify-between p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div>
                    <div className="font-medium">{user.fullName}</div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      Role: {user.role} | Requested: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => approveUser(user.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => rejectUser(user.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default AdminPanel;