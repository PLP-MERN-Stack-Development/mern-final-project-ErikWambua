import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Users,
  CreditCard,
  Smartphone,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ReservationModal = ({ isOpen, onClose, route, onConfirm }) => {
  const [formData, setFormData] = useState({
    passengers: 1,
    pickupPoint: '',
    dropoffPoint: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    paymentMethod: 'mpesa',
  });
  const [booking, setBooking] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBooking(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (onConfirm) {
        onConfirm({ ...formData, route });
      }
      toast.success('Reservation confirmed! You will receive an SMS shortly.');
      onClose();
    } catch (error) {
      toast.error('Failed to make reservation');
    } finally {
      setBooking(false);
    }
  };

  const totalFare = (route?.fare || 100) * formData.passengers;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reserve Your Seat
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Route {route?.id}: {route?.origin} → {route?.destination}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Number of Passengers */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Number of Passengers
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, passengers: Math.max(1, formData.passengers - 1) })
                }
                className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formData.passengers}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, passengers: Math.min(4, formData.passengers + 1) })
                }
                className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Time (Optional)
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Pickup & Dropoff Points */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2 text-green-600" />
              Pickup Point
            </label>
            <input
              type="text"
              value={formData.pickupPoint}
              onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
              placeholder="e.g., Kencom Stage"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2 text-red-600" />
              Dropoff Point
            </label>
            <input
              type="text"
              value={formData.dropoffPoint}
              onChange={(e) => setFormData({ ...formData, dropoffPoint: e.target.value })}
              placeholder="e.g., ABC Place"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.paymentMethod === 'mpesa'
                    ? 'border-nairobi-blue bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mpesa"
                  checked={formData.paymentMethod === 'mpesa'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="hidden"
                />
                <Smartphone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">M-PESA</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pay with M-PESA</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.paymentMethod === 'card'
                    ? 'border-nairobi-blue bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="hidden"
                />
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Card</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Debit/Credit card</p>
                </div>
              </label>
            </div>
          </div>

          {/* Total Fare */}
          <div className="p-4 bg-gradient-to-br from-nairobi-blue to-blue-700 text-white rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Fare</p>
                <p className="text-xs opacity-75 mt-1">
                  KES {route?.fare || 100} × {formData.passengers} passenger(s)
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  <span className="text-3xl font-bold">KES {totalFare}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={booking}
              className="flex-1 px-6 py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {booking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Reservation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
