import React from 'react';

const SuperAdminNotifications = ({ userRole, onClose }) => {
  if (userRole !== 'super_admin') return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[999999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">👑 Super Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">System Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Active Users:</span>
                <span className="ml-2 font-medium">1</span>
              </div>
              <div>
                <span className="text-gray-600">System Health:</span>
                <span className="ml-2 text-green-600 font-medium">✅ Good</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <div className="text-sm text-gray-600">
              <p>• Super Admin logged in</p>
              <p>• System initialized</p>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">
                📊 View Analytics
              </button>
              <button className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm">
                👥 Manage Users
              </button>
              <button className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm">
                ⚙️ System Settings
              </button>
              <button className="p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm">
                📋 View Logs
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-4 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuperAdminNotifications;