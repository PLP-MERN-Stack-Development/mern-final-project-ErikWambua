import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, User, Phone, Star, Navigation, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  // Mock trip data
  const trip = {
    id: tripId,
    status: 'completed', // active, completed, cancelled
    route: 'Route 46',
    routeNumber: '46',
    plate: 'KCA 123A',
    driver: {
      name: 'John Kamau',
      phone: '+254712345678',
      rating: 4.8,
      photo: null,
    },
    pickup: {
      name: 'Kencom Bus Stop',
      time: '2024-01-15 08:30 AM',
      coordinates: { lat: -1.2841, lng: 36.8235 },
    },
    dropoff: {
      name: 'Sarit Centre',
      time: '2024-01-15 09:05 AM',
      coordinates: { lat: -1.2632, lng: 36.7891 },
    },
    fare: 80,
    distance: '12.5 km',
    duration: '35 min',
    paymentMethod: 'M-Pesa',
    transactionId: 'QA12BC3DE4',
    userRating: null,
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      // TODO: Submit rating and feedback to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Thank you for your feedback!');
      setShowFeedback(false);
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  const handleDownloadReceipt = () => {
    toast.success('Receipt downloaded');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Trip Details</h1>
              <p className="text-blue-100">Trip ID: {trip.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(trip.status)}`}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Route and Vehicle Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Route & Vehicle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-nairobi-blue text-white rounded-lg flex items-center justify-center text-xl font-bold">
                {trip.routeNumber}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Route</p>
                <p className="font-semibold text-gray-900 dark:text-white">{trip.route}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Navigation className="w-7 h-7 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle</p>
                <p className="font-semibold text-gray-900 dark:text-white">{trip.plate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Driver</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{trip.driver.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{trip.driver.rating}</span>
                </div>
              </div>
            </div>
            <a
              href={`tel:${trip.driver.phone}`}
              className="flex items-center gap-2 px-4 py-2 bg-nairobi-blue text-white rounded-lg hover:bg-blue-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
          </div>
        </div>

        {/* Trip Route */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Journey</h2>
          <div className="space-y-6">
            {/* Pickup */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pickup</p>
                    <h3 className="font-bold text-gray-900 dark:text-white mt-1">{trip.pickup.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{trip.pickup.time}</p>
                </div>
              </div>
            </div>

            {/* Dropoff */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Dropoff</p>
                    <h3 className="font-bold text-gray-900 dark:text-white mt-1">{trip.dropoff.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{trip.dropoff.time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <MapPin className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
              <p className="font-bold text-gray-900 dark:text-white">{trip.distance}</p>
            </div>
            <div className="text-center">
              <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-bold text-gray-900 dark:text-white">{trip.duration}</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Fare</p>
              <p className="font-bold text-gray-900 dark:text-white">KES {trip.fare}</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment</h2>
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center gap-2 text-nairobi-blue dark:text-blue-400 hover:underline"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
              <span className="font-semibold text-gray-900 dark:text-white">{trip.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
              <span className="font-mono text-sm text-gray-900 dark:text-white">{trip.transactionId}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white">Total Paid</span>
              <span className="text-xl font-bold text-nairobi-blue dark:text-blue-400">KES {trip.fare}</span>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        {trip.status === 'completed' && !trip.userRating && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rate Your Trip</h2>
            {!showFeedback ? (
              <button
                onClick={() => setShowFeedback(true)}
                className="w-full py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
              >
                Leave Feedback
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Comments (Optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    className="flex-1 py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
