import React, { useState } from 'react';
import { Send, Bell, Mail, MessageSquare, Users, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const Communications = () => {
  const [messageType, setMessageType] = useState('sms');
  const [recipientType, setRecipientType] = useState('all');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const [messageHistory, setMessageHistory] = useState([
    { id: 1, title: 'Service Update', type: 'push', recipients: 'All Users', sent: '2024-01-15 10:30', status: 'delivered' },
    { id: 2, title: 'Route Change Alert', type: 'sms', recipients: 'Passengers', sent: '2024-01-14 15:20', status: 'delivered' },
    { id: 3, title: 'Payment Reminder', type: 'email', recipients: 'Drivers', sent: '2024-01-13 09:00', status: 'delivered' },
  ]);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement send message API
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${messageType.toUpperCase()} sent successfully!`);
      setMessage('');
      setTitle('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Communications</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Send messages to users and drivers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Message Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send New Message</h2>
            
            <form onSubmit={handleSend} className="space-y-6">
              {/* Message Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Message Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setMessageType('sms')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      messageType === 'sms'
                        ? 'border-nairobi-blue bg-blue-50 dark:bg-blue-900/20 text-nairobi-blue'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-semibold">SMS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageType('email')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      messageType === 'email'
                        ? 'border-nairobi-blue bg-blue-50 dark:bg-blue-900/20 text-nairobi-blue'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-semibold">Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageType('push')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      messageType === 'push'
                        ? 'border-nairobi-blue bg-blue-50 dark:bg-blue-900/20 text-nairobi-blue'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="font-semibold">Push</span>
                  </button>
                </div>
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipients
                </label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Users</option>
                  <option value="passengers">All Passengers</option>
                  <option value="drivers">All Drivers</option>
                  <option value="active_drivers">Active Drivers</option>
                  <option value="route">Specific Route</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Message title..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {message.length} characters
                </p>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-nairobi-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50 shadow-lg"
              >
                {loading ? (
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
            </form>
          </div>
        </div>

        {/* Message History */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Messages</h2>
            <div className="space-y-4">
              {messageHistory.map((msg) => (
                <div key={msg.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{msg.title}</h3>
                    {msg.type === 'sms' && <MessageSquare className="w-4 h-4 text-gray-400" />}
                    {msg.type === 'email' && <Mail className="w-4 h-4 text-gray-400" />}
                    {msg.type === 'push' && <Bell className="w-4 h-4 text-gray-400" />}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    To: {msg.recipients}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">{msg.sent}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                      {msg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communications;
