import React, { useState } from 'react';
import { AlertTriangle, Phone, Shield, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EmergencyButton = ({ onEmergency }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [alerting, setAlerting] = useState(false);

  const emergencyTypes = [
    {
      id: 'accident',
      label: 'Accident',
      icon: '🚨',
      color: 'bg-red-600',
    },
    {
      id: 'breakdown',
      label: 'Breakdown',
      icon: '🔧',
      color: 'bg-yellow-600',
    },
    {
      id: 'security',
      label: 'Security Issue',
      icon: '🚓',
      color: 'bg-orange-600',
    },
    {
      id: 'medical',
      label: 'Medical Emergency',
      icon: '🏥',
      color: 'bg-purple-600',
    },
  ];

  const handleEmergency = async (type) => {
    setAlerting(true);
    try {
      // Simulate emergency alert
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (onEmergency) {
        onEmergency(type);
      }

      toast.success(
        'Emergency alert sent! Help is on the way. Stay safe.',
        { duration: 5000 }
      );

      setShowConfirm(false);
    } catch (error) {
      toast.error('Failed to send emergency alert');
    } finally {
      setAlerting(false);
    }
  };

  return (
    <>
      {/* Emergency Button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-500/50 hover:from-red-700 hover:to-red-800 transition-all transform active:scale-95 flex items-center justify-center gap-3"
      >
        <AlertTriangle className="w-6 h-6" />
        EMERGENCY
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Emergency Alert
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select emergency type
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Emergency Types */}
            <div className="space-y-3 mb-6">
              {emergencyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleEmergency(type)}
                  disabled={alerting}
                  className={`w-full p-4 ${type.color} text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="flex-1 text-left">{type.label}</span>
                  {alerting && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
              ))}
            </div>

            {/* Emergency Contacts Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-nairobi-blue dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Your emergency will alert:
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Sacco management</li>
                    <li>• Emergency services</li>
                    <li>• Your emergency contact</li>
                    <li>• Nearby drivers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Emergency Numbers */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Emergency Hotlines:
              </p>
              <div className="flex items-center gap-4 text-sm">
                <a
                  href="tel:999"
                  className="flex items-center gap-2 text-nairobi-blue dark:text-blue-400 font-semibold hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  Police: 999
                </a>
                <a
                  href="tel:911"
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  Ambulance: 911
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>>
  );
};

export default EmergencyButton;
