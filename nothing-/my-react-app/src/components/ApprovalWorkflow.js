import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses } from '../utils/themeUtils';
import { Alert, Button, Modal } from './ProfessionalUX';

const ApprovalWorkflow = ({ data, onApprove, onReject, onClose }) => {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);
  const [currentStep, setCurrentStep] = useState('maker');
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [comments, setComments] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const workflowSteps = [
    { id: 'maker', name: 'Data Entry', status: 'completed', user: 'Data Analyst' },
    { id: 'checker', name: 'Review & Validation', status: 'pending', user: 'ESG Manager' },
    { id: 'approver', name: 'Final Approval', status: 'waiting', user: 'ESG Director' }
  ];

  const handleApproval = (action) => {
    const newEntry = {
      step: currentStep,
      action,
      user: getCurrentUser(),
      timestamp: new Date().toISOString(),
      comments
    };
    
    setApprovalHistory([...approvalHistory, newEntry]);
    
    if (action === 'approve') {
      if (currentStep === 'checker') {
        setCurrentStep('approver');
      } else if (currentStep === 'approver') {
        onApprove?.(selectedItems, comments);
      }
    } else {
      onReject?.(selectedItems, comments);
    }
    
    setComments('');
  };

  const getCurrentUser = () => {
    const userMap = {
      maker: 'Data Analyst',
      checker: 'ESG Manager', 
      approver: 'ESG Director'
    };
    return userMap[currentStep] || 'Unknown User';
  };

  const getStepStatus = (stepId) => {
    if (stepId === currentStep) return 'active';
    const stepIndex = workflowSteps.findIndex(s => s.id === stepId);
    const currentIndex = workflowSteps.findIndex(s => s.id === currentStep);
    return stepIndex < currentIndex ? 'completed' : 'pending';
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="ESG Data Approval Workflow" size="xl">
      <div className="space-y-6">
        {/* Workflow Progress */}
        <div className="flex items-center justify-between">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                getStepStatus(step.id) === 'completed' ? 'bg-green-500 text-white' :
                getStepStatus(step.id) === 'active' ? 'bg-blue-500 text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {getStepStatus(step.id) === 'completed' ? '✓' : index + 1}
              </div>
              <div className="ml-3">
                <p className={`font-medium ${theme.text.primary}`}>{step.name}</p>
                <p className={`text-sm ${theme.text.secondary}`}>{step.user}</p>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${
                  getStepStatus(step.id) === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Data Summary */}
        <div className={`p-4 rounded-lg ${theme.bg.subtle}`}>
          <h3 className={`font-semibold mb-3 ${theme.text.primary}`}>Data Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className={`text-sm ${theme.text.secondary}`}>Total Entries</p>
              <p className={`text-lg font-bold ${theme.text.primary}`}>{data?.length || 0}</p>
            </div>
            <div>
              <p className={`text-sm ${theme.text.secondary}`}>Categories</p>
              <p className={`text-lg font-bold ${theme.text.primary}`}>
                {data ? [...new Set(data.map(d => d.category))].length : 0}
              </p>
            </div>
            <div>
              <p className={`text-sm ${theme.text.secondary}`}>Status</p>
              <p className={`text-lg font-bold text-yellow-600`}>Pending Approval</p>
            </div>
          </div>
        </div>

        {/* Data Items */}
        <div className="max-h-60 overflow-y-auto">
          <table className={`min-w-full text-sm ${theme.text.primary}`}>
            <thead className={`${theme.bg.subtle}`}>
              <tr>
                <th className="px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(data?.map((_, i) => i) || []);
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Metric</th>
                <th className="px-4 py-2 text-left">Value</th>
                <th className="px-4 py-2 text-left">Company</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr key={index} className={`hover:${theme.bg.subtle}`}>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, index]);
                        } else {
                          setSelectedItems(selectedItems.filter(i => i !== index));
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 capitalize">{item.category}</td>
                  <td className="px-4 py-2">{item.metric}</td>
                  <td className="px-4 py-2 font-bold">{item.value}</td>
                  <td className="px-4 py-2">{item.companyName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comments */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>
            Comments
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className={`w-full p-3 border rounded-lg ${theme.bg.input} ${theme.border.input}`}
            rows={3}
            placeholder="Add comments for this approval step..."
          />
        </div>

        {/* Approval History */}
        {approvalHistory.length > 0 && (
          <div>
            <h3 className={`font-semibold mb-3 ${theme.text.primary}`}>Approval History</h3>
            <div className="space-y-2">
              {approvalHistory.map((entry, index) => (
                <div key={index} className={`p-3 rounded-lg ${theme.bg.subtle}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-medium ${theme.text.primary}`}>
                        {entry.user} - {entry.action}
                      </p>
                      <p className={`text-sm ${theme.text.secondary}`}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      entry.action === 'approve' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.action}
                    </span>
                  </div>
                  {entry.comments && (
                    <p className={`mt-2 text-sm ${theme.text.secondary}`}>{entry.comments}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleApproval('reject')}
            disabled={selectedItems.length === 0}
          >
            Reject Selected
          </Button>
          <Button 
            variant="success" 
            onClick={() => handleApproval('approve')}
            disabled={selectedItems.length === 0}
          >
            {currentStep === 'approver' ? 'Final Approve' : 'Approve & Forward'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApprovalWorkflow;