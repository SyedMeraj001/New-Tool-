import React, { useState } from 'react';

const RegulatoryDataEntry = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Pending',
    progress: 0,
    priority: 'Medium',
    deadline: '',
    category: 'Environmental',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/regulatory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      onSave();
      onClose();
    }
  } catch (error) {
    console.error('Error saving:', error);
  }
};

return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Add Regulatory Requirement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Regulation Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full p-2 border rounded"
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className="w-full p-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Review Required">Review Required</option>
          <option value="Compliant">Compliant</option>
        </select>
        <input
          type="number"
          placeholder="Progress %"
          value={formData.progress}
          onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
          className="w-full p-2 border rounded"
          min="0"
          max="100"
        />
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({...formData, deadline: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default RegulatoryDataEntry;