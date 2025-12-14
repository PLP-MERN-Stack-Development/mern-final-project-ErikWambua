import React, { useState } from 'react';
import { Send, Users, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BulkMessenger = ({ onSend }) => {
  const [formData, setFormData] = useState({
    audience: 'all', // all, drivers, passengers
    subject: '',
    message: '',
    priority: 'normal', // low, normal, high
  });
  const [sending, setSending] = useState(false);

  const recipientOptions = [
    { value: 'all', label: 'All Users', count: 250 },
    { value: 'drivers', label: 'All Drivers', count: 98 },
    { value: 'passengers', label: 'All Passengers', count: 152 },
    { value: 'route-46', label: 'Route 46 Users', count: 45 },
    { value: 'route-33', label: 'Route 33 Users', count: 38 },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (onSend) {
        await onSend(formData);
      }

      const selectedOption = recipientOptions.find((opt) => opt.value === formData.audience);
      toast.success(`Message sent to ${selectedOption?.count || 0} recipients!`);

      // Reset form
      setFormData({
        audience: 'all',
        subject: '',
        message: '',
        priority: 'normal',
      });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const selectedRecipient = recipientOptions.find((opt) => opt.value === formData.audience);
  const charCount = formData.message.length;
  const maxChars = 500;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-nairobi-blue text-white rounded-lg flex items-center justify-center">
          <Send className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bulk Messenger</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Send messages to multiple users</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Audience Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Recipients *
          </label>
          <select
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
          >
            {recipientOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count} users)
              </option>
            ))}
          </select>
          {selectedRecipient && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>
                This message will be sent to <strong>{selectedRecipient.count}</strong> recipients
              </span>
            </div>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <div className="flex gap-3">
            {priorityOptions.map((option) => (
              <label
                key={option.value}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor:
                    formData.priority === option.value
                      ? 'var(--color-nairobi-blue)'
                      : 'var(--color-gray-300)',
                  backgroundColor:
                    formData.priority === option.value
                      ? 'var(--color-blue-50)'
                      : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="priority"
                  value={option.value}
                  checked={formData.priority === option.value}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="hidden"
                />
                <span className={`text-sm font-semibold ${option.color}`}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Subject *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Enter message subject"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Type your message here..."
            rows={6}
            maxLength={maxChars}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white resize-none"
            required
          />
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-sm ${
                charCount > maxChars * 0.9 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {charCount} / {maxChars} characters
            </span>
            {charCount > maxChars * 0.9 && (
              <span className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Approaching character limit
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={sending || !formData.subject.trim() || !formData.message.trim()}
            className="flex-1 px-6 py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                audience: 'all',
                subject: '',
                message: '',
                priority: 'normal',
              })
            }
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkMessenger;
