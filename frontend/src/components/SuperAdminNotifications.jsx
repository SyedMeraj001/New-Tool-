import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  getSignupRequests, 
  getSuperAdminNotifications, 
  approveSignupRequest, 
  rejectSignupRequest,
  markNotificationAsRead 
} from '../utils/signupApproval';
import { hasPermission, PERMISSIONS } from '../utils/rbac';

const SuperAdminNotifications = ({ userRole, onClose }) => {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [signupRequests, setSignupRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    if (hasPermission(userRole, PERMISSIONS.APPROVE_USERS)) {
      setNotifications(getSuperAdminNotifications());
      setSignupRequests(getSignupRequests());
    }
  }, [userRole]);

  const handleApprove = (requestId) => {
    if (approveSignupRequest(requestId)) {
      setSignupRequests(getSignupRequests());
      setNotifications(getSuperAdminNotifications());
    }
  };

  const handleReject = (requestId) => {
    const reason = prompt('Reason for rejection (optional):');
    if (rejectSignupRequest(requestId, reason)) {
      setSignupRequests(getSignupRequests());
      setNotifications(getSuperAdminNotifications());
    }
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
    setNotifications(getSuperAdminNotifications());
  };

  if (!hasPermission(userRole, PERMISSIONS.APPROVE_USERS)) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6 bg-gradient-to-r from-[#3a7a44] to-[#1b3a2d] text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">🔔</span>
                Super Admin Panel
              </h2>
              <p className="text-white/80 mt-1">Manage signup requests and notifications</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-2xl text-white hover:text-red-300 hover:rotate-90 transition-all duration-300 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'notifications'
                ? 'border-b-2 border-[#3a7a44] text-[#3a7a44]'
                : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Notifications ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'requests'
                ? 'border-b-2 border-[#3a7a44] text-[#3a7a44]'
                : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Requests ({signupRequests.length})
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read
                        ? isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                        : isDark ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {notification.message}
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-sm text-[#3a7a44] hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              {signupRequests.length === 0 ? (
                <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No pending signup requests
                </p>
              ) : (
                signupRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-6 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {request.fullName}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {request.email}
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Role: <span className="font-medium capitalize">{request.role.replace('_', ' ')}</span>
                        </p>
                        <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Requested: {new Date(request.requestDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminNotifications;