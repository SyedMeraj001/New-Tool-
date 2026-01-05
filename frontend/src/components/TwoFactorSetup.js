import React, { useState } from 'react';

const TwoFactorSetup = ({ onComplete, onCancel, userEmail }) => {
  const [method, setMethod] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);

  const handleMethodSelect = (selectedMethod) => {
    setMethod(selectedMethod);
    setStep(2);
    
    // Simulate sending code
    setTimeout(() => {
      alert(`Verification code sent to your ${selectedMethod === 'email' ? 'email' : 'phone'}`);
    }, 1000);
  };

  const handleVerify = () => {
    if (code === '123456') {
      localStorage.setItem('2fa_enabled', 'true');
      localStorage.setItem('2fa_method', method);
      alert('2FA enabled successfully!');
      onComplete();
    } else {
      alert('Invalid code. Try 123456');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[999999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Setup Two-Factor Authentication</h2>
        
        {step === 1 && (
          <div>
            <p className="mb-4">Choose your 2FA method:</p>
            <div className="space-y-2">
              <button
                onClick={() => handleMethodSelect('email')}
                className="w-full p-3 border rounded-lg hover:bg-gray-50 text-left"
              >
                📧 Email ({userEmail})
              </button>
              <button
                onClick={() => handleMethodSelect('sms')}
                className="w-full p-3 border rounded-lg hover:bg-gray-50 text-left"
              >
                📱 SMS
              </button>
              <button
                onClick={() => handleMethodSelect('app')}
                className="w-full p-3 border rounded-lg hover:bg-gray-50 text-left"
              >
                🔐 Authenticator App
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-4">Enter the verification code:</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full p-3 border rounded-lg mb-4"
              maxLength="6"
            />
            <p className="text-sm text-gray-600 mb-4">
              Demo: Use code "123456"
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleVerify}
                className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
              >
                Verify
              </button>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 border rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onCancel}
          className="w-full mt-4 p-3 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TwoFactorSetup;