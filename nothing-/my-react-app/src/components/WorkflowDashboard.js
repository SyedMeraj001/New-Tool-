import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses } from '../utils/themeUtils';
import { Alert, Button, Modal, Toast } from './ProfessionalUX';
import ApprovalWorkflow from './ApprovalWorkflow';
import DataValidation from '../utils/dataValidation';
import AuditTrail from '../utils/AuditTrail';
import NotificationSystem from '../utils/NotificationSystem';

const WorkflowDashboard = () => {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditEntries, setAuditEntries] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentUser] = useState('esg_manager');

  useEffect(() => {
    loadWorkflowData();
    setupNotificationSubscription();
  }, []);

  const loadWorkflowData = () => {
    // Load pending approvals from localStorage
    const esgData = JSON.parse(localStorage.getItem('esgData') || '[]');
    const pending = esgData.filter(item => item.status === 'Pending' || !item.status);
    setPendingApprovals(pending);

    // Load notifications
    const userNotifications = NotificationSystem.getNotifications(currentUser);
    setNotifications(userNotifications);

    // Load recent audit entries
    const recentAudit = AuditTrail.getAuditLog({ 
      user: currentUser,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    });
    setAuditEntries(recentAudit.slice(0, 10));

    // Validate recent data
    if (pending.length > 0) {
      const validation = DataValidation.validateESGData(pending[0]);
      setValidationResults(validation);
    }
  };

  const setupNotificationSubscription = () => {
    NotificationSystem.subscribe(currentUser, (notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
      showToast(notification.title, 'info');
    });
  };

  const handleApproveItems = (selectedItems, comments) => {
    const approvedData = selectedItems.map(index => pendingApprovals[index]);
    
    // Update status
    approvedData.forEach(item => {
      item.status = 'Approved';
      item.approvedBy = currentUser;
      item.approvedAt = new Date().toISOString();
      item.approvalComments = comments;
    });

    // Update localStorage
    const allData = JSON.parse(localStorage.getItem('esgData') || '[]');
    const updatedData = allData.map(item => {
      const approved = approvedData.find(a => a.id === item.id);
      return approved || item;
    });
    localStorage.setItem('esgData', JSON.stringify(updatedData));

    // Log audit trail
    AuditTrail.trackApproval(approvedData, currentUser, 'approve');

    // Create notification
    NotificationSystem.createNotification(
      'approval_completed',
      'Items Approved',
      `${approvedData.length} ESG data entries have been approved.`,
      currentUser,
      'low'
    );

    setPendingApprovals(prev => prev.filter((_, index) => !selectedItems.includes(index)));
    setShowApprovalModal(false);
    showToast('Items approved successfully', 'success');
  };

  const handleRejectItems = (selectedItems, comments) => {
    const rejectedData = selectedItems.map(index => pendingApprovals[index]);
    
    // Update status
    rejectedData.forEach(item => {
      item.status = 'Rejected';
      item.rejectedBy = currentUser;
      item.rejectedAt = new Date().toISOString();
      item.rejectionComments = comments;
    });

    // Log audit trail
    AuditTrail.trackApproval(rejectedData, currentUser, 'reject');

    // Create notification
    NotificationSystem.createNotification(
      'approval_rejected',
      'Items Rejected',
      `${rejectedData.length} ESG data entries have been rejected and require revision.`,
      currentUser,
      'medium'
    );

    setPendingApprovals(prev => prev.filter((_, index) => !selectedItems.includes(index)));
    setShowApprovalModal(false);
    showToast('Items rejected', 'warning');
  };

  const runDataValidation = () => {
    const esgData = JSON.parse(localStorage.getItem('esgData') || '[]');
    if (esgData.length === 0) {
      showToast('No data available for validation', 'warning');
      return;
    }

    const validation = DataValidation.generateValidationReport(esgData[0]);
    setValidationResults(validation);
    
    AuditTrail.logChange('VALIDATION_RUN', validation, currentUser);
    
    if (validation.status === 'failed') {
      NotificationSystem.notifyDataValidationFailed(currentUser, validation.details);
    }
    
    showToast(`Validation completed with ${validation.summary.totalErrors} errors`, 
      validation.status === 'passed' ? 'success' : 'error');
  };

  const markNotificationRead = (notificationId) => {
    NotificationSystem.markAsRead(notificationId, currentUser);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const dismissNotification = (notificationId) => {
    NotificationSystem.markAsDismissed(notificationId, currentUser);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getValidationStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen p-6 ${theme.bg.gradient}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme.text.primary}`}>
            Workflow & Approval Dashboard
          </h1>
          <p className={`text-lg ${theme.text.secondary}`}>
            Manage ESG data approvals, validation, and audit trail
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl shadow-lg ${theme.bg.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.text.secondary}`}>Pending Approvals</p>
                <p className={`text-2xl font-bold ${theme.text.primary}`}>
                  {pendingApprovals.length}
                </p>
              </div>
              <div className="text-3xl">⏳</div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${theme.bg.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.text.secondary}`}>Unread Notifications</p>
                <p className={`text-2xl font-bold ${theme.text.primary}`}>
                  {notifications.filter(n => !n.read).length}
                </p>
              </div>
              <div className="text-3xl">🔔</div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${theme.bg.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.text.secondary}`}>Validation Status</p>
                <p className={`text-lg font-bold ${
                  validationResults ? getValidationStatusColor(validationResults.status) : theme.text.primary
                }`}>
                  {validationResults ? validationResults.status.toUpperCase() : 'NOT RUN'}
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${theme.bg.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.text.secondary}`}>Audit Entries</p>
                <p className={`text-2xl font-bold ${theme.text.primary}`}>
                  {auditEntries.length}
                </p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            variant="primary"
            onClick={() => setShowApprovalModal(true)}
            disabled={pendingApprovals.length === 0}
          >
            Review Approvals ({pendingApprovals.length})
          </Button>
          <Button variant="outline" onClick={runDataValidation}>
            Run Data Validation
          </Button>
          <Button variant="outline" onClick={loadWorkflowData}>
            Refresh Dashboard
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications Panel */}
          <div className={`p-6 rounded-xl shadow-lg ${theme.bg.card}`}>
            <h2 className={`text-xl font-bold mb-4 ${theme.text.primary}`}>
              Recent Notifications
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      notification.read ? theme.bg.subtle : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${theme.text.primary}`}>
                            {notification.title}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${theme.text.secondary}`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs mt-2 ${theme.text.muted}`}>
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-center py-8 ${theme.text.secondary}`}>
                  No notifications available
                </p>
              )}
            </div>
          </div>

          {/* Validation Results Panel */}
          <div className={`p-6 rounded-xl shadow-lg ${theme.bg.card}`}>
            <h2 className={`text-xl font-bold mb-4 ${theme.text.primary}`}>
              Data Validation Results
            </h2>
            {validationResults ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${theme.text.secondary}`}>Validation Score</p>
                    <p className={`text-2xl font-bold ${getValidationStatusColor(validationResults.status)}`}>
                      {validationResults.validationScore}%
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme.text.secondary}`}>Completeness</p>
                    <p className={`text-2xl font-bold ${theme.text.primary}`}>
                      {validationResults.completenessScore}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className={`p-3 rounded-lg ${theme.bg.subtle}`}>
                    <p className="text-red-600 font-bold text-lg">
                      {validationResults.summary.totalErrors}
                    </p>
                    <p className={`text-sm ${theme.text.secondary}`}>Errors</p>
                  </div>
                  <div className={`p-3 rounded-lg ${theme.bg.subtle}`}>
                    <p className="text-yellow-600 font-bold text-lg">
                      {validationResults.summary.totalWarnings}
                    </p>
                    <p className={`text-sm ${theme.text.secondary}`}>Warnings</p>
                  </div>
                  <div className={`p-3 rounded-lg ${theme.bg.subtle}`}>
                    <p className="text-blue-600 font-bold text-lg">
                      {validationResults.summary.totalSuggestions}
                    </p>
                    <p className={`text-sm ${theme.text.secondary}`}>Suggestions</p>
                  </div>
                </div>

                {validationResults.details.errors.length > 0 && (
                  <div>
                    <h3 className={`font-semibold mb-2 text-red-600`}>Critical Errors</h3>
                    <ul className="space-y-1">
                      {validationResults.details.errors.slice(0, 3).map((error, index) => (
                        <li key={index} className={`text-sm ${theme.text.secondary}`}>
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className={`${theme.text.secondary} mb-4`}>
                  No validation results available
                </p>
                <Button variant="outline" onClick={runDataValidation}>
                  Run Validation
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Audit Trail */}
        <div className={`mt-8 p-6 rounded-xl shadow-lg ${theme.bg.card}`}>
          <h2 className={`text-xl font-bold mb-4 ${theme.text.primary}`}>
            Recent Audit Trail
          </h2>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${theme.text.primary}`}>
              <thead className={`${theme.bg.subtle}`}>
                <tr>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {auditEntries.map((entry) => (
                  <tr key={entry.id} className={`hover:${theme.bg.subtle}`}>
                    <td className="px-4 py-3">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium">{entry.action}</td>
                    <td className="px-4 py-3">{entry.user}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        entry.metadata?.category === 'esg_data' ? 'bg-green-100 text-green-800' :
                        entry.metadata?.category === 'workflow' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.metadata?.category || 'system'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {entry.metadata?.recordCount && `${entry.metadata.recordCount} records`}
                      {entry.metadata?.decision && ` - ${entry.metadata.decision}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Workflow Modal */}
        {showApprovalModal && (
          <ApprovalWorkflow
            data={pendingApprovals}
            onApprove={handleApproveItems}
            onReject={handleRejectItems}
            onClose={() => setShowApprovalModal(false)}
          />
        )}

        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default WorkflowDashboard;