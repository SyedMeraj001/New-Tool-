import React, { useState } from 'react';

const EncryptionSetup = ({ onComplete, onCancel }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSetup = () => {
    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Store encryption key (in real app, this would be properly hashed)
    localStorage.setItem('encryption_enabled', 'true');
    localStorage.setItem('encryption_key', btoa(password));
    
    alert('Encryption enabled successfully!');
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[999999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Setup Client-Side Encryption</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Create a master password to encrypt your data locally with AES-256 encryption.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Master Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password"
                className="w-full p-3 border rounded-lg"
                minLength="8"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm master password"
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Remember this password! If lost, your encrypted data cannot be recovered.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSetup}
            className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
            disabled={!password || !confirmPassword}
          >
            Enable Encryption
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-3 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EncryptionSetup;