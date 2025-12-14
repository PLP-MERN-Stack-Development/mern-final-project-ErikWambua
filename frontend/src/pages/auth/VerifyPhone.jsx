import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyPhone = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { verifyPhone } = useAuth();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setLoading(true);

    try {
      await verifyPhone(verificationCode);
      toast.success('Phone verified successfully!');
      navigate('/passenger');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-nairobi-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Phone
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-nairobi-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Verifying...' : 'Verify Phone'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Didn&apos;t receive the code?{' '}
            <button className="text-nairobi-blue hover:text-blue-800 font-semibold">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
