import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Navigation, Clock, DollarSign, Users, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ActiveTrip = () => {
  const navigate = useNavigate();
  const [tripStatus, setTripStatus] = useState('pickup'); // pickup, in-transit, dropoff, completed
  const [duration, setDuration] = useState(0);
  const [passengers, setPassengers] = useState(1);
  const [maxPassengers] = useState(14);

  // Mock trip data
  const trip = {
    id: 1,
    passenger: 'Jane Doe',
    phone: '+254712345678',
    pickup: {
      name: 'Kencom Bus Stop',
      time: '08:30 AM',
      coordinates: { lat: -1.2841, lng: 36.8235 },
    },
    dropoff: {
      name: 'Sarit Centre, Westlands',
      coordinates: { lat: -1.2632, lng: 36.7891 },
    },
    fare: 80,
    distance: '12.5 km',
    route: 'Route 46',
  };

  // Timer for trip duration
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTrip = () => {
    setTripStatus('in-transit');
    toast.success('Trip started!');
  };

  const handleCompleteTrip = () => {
    setTripStatus('completed');
    toast.success('Trip completed!');
    setTimeout(() => navigate('/driver/dashboard'), 2000);
  };

  const handleEmergency = () => {
    toast.error('Emergency alert sent!');
  };

  const handleAddPassenger = () => {
    if (passengers < maxPassengers) {
      setPassengers(passengers + 1);
      toast.success('Passenger added');
    } else {
      toast.error('Vehicle is full');
    }
  };

  const handleRemovePassenger = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
      toast.success('Passenger removed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Trip Status */}
      <div className={`p-6 text-white ${
        tripStatus === 'completed'
          ? 'bg-gradient-to-r from-green-600 to-green-800'
          : 'bg-gradient-to-r from-nairobi-blue to-blue-900'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {tripStatus === 'pickup' && 'Heading to Pickup'}
                {tripStatus === 'in-transit' && 'Trip in Progress'}
                {tripStatus === 'completed' && 'Trip Completed!'}
              </h1>
              <p className="text-blue-100">{trip.route}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{formatDuration(duration)}</p>
              <p className="text-sm text-blue-100">Duration</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              tripStatus === 'completed' ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
            }`} />
            <span className="text-sm font-medium">
              {tripStatus === 'pickup' && 'Navigating to pickup point'}
              {tripStatus === 'in-transit' && 'En route to destination'}
              {tripStatus === 'completed' && 'Journey complete'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Map Placeholder */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Map View</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Live location tracking</p>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trip Details</h2>
          
          {/* Route Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Pickup</p>
                <h3 className="font-bold text-gray-900 dark:text-white">{trip.pickup.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{trip.pickup.time}</p>
              </div>
              {tripStatus === 'pickup' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-semibold">
                  Current
                </span>
              )}
            </div>

            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Dropoff</p>
                <h3 className="font-bold text-gray-900 dark:text-white">{trip.dropoff.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{trip.distance}</p>
              </div>
              {tripStatus === 'in-transit' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-semibold">
                  Heading Here
                </span>
              )}
            </div>
          </div>

          {/* Trip Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <DollarSign className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Fare</p>
              <p className="text-lg font-bold text-matatu-green">KES {trip.fare}</p>
            </div>
            <div className="text-center">
              <Navigation className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{trip.distance}</p>
            </div>
            <div className="text-center">
              <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Passengers</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{passengers}/{maxPassengers}</p>
            </div>
          </div>
        </div>

        {/* Passenger Management */}
        {tripStatus !== 'completed' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Passengers</h2>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Current: {passengers} passengers</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {maxPassengers - passengers} seats available
                  </p>
                </div>
              </div>
              <a
                href={`tel:${trip.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-nairobi-blue text-white rounded-lg hover:bg-blue-900 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddPassenger}
                disabled={passengers >= maxPassengers}
                className="flex-1 py-2 bg-matatu-green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Passenger
              </button>
              <button
                onClick={handleRemovePassenger}
                disabled={passengers <= 1}
                className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                - Remove Passenger
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {tripStatus === 'pickup' && (
            <button
              onClick={handleStartTrip}
              className="w-full flex items-center justify-center gap-2 bg-matatu-green text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Passenger Picked Up - Start Trip
            </button>
          )}

          {tripStatus === 'in-transit' && (
            <button
              onClick={handleCompleteTrip}
              className="w-full flex items-center justify-center gap-2 bg-nairobi-blue text-white py-4 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Trip
            </button>
          )}

          {tripStatus === 'completed' && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Trip Completed!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">You earned KES {trip.fare}</p>
              <button
                onClick={() => navigate('/driver/dashboard')}
                className="px-6 py-3 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {tripStatus !== 'completed' && (
            <button
              onClick={handleEmergency}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <AlertCircle className="w-5 h-5" />
              Emergency
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveTrip;
