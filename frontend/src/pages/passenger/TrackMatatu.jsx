import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Phone, ArrowLeft, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

const TrackMatatu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matatu, setMatatu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching matatu data
    const fetchMatatu = async () => {
      try {
        // Mock data - replace with actual API call
        const mockData = {
          id: id,
          route: '46',
          plate: 'KCA 123A',
          distance: '0.5 km',
          eta: '3 min',
          occupancy: 10,
          capacity: 14,
          driver: {
            name: 'John Doe',
            phone: '+254712345678',
            rating: 4.5
          },
          currentLocation: {
            lat: -1.2921,
            lng: 36.8219
          },
          destination: 'Westlands',
          nextStops: ['Town', 'Museum Hill', 'Westlands']
        };
        
        setMatatu(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matatu:', error);
        toast.error('Failed to load matatu details');
        setLoading(false);
      }
    };

    fetchMatatu();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-nairobi-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading matatu details...</p>
        </div>
      </div>
    );
  }

  if (!matatu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Matatu not found</p>
          <button
            onClick={() => navigate('/passenger')}
            className="px-6 py-2 bg-nairobi-blue text-white rounded-lg hover:bg-blue-900"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-nairobi-blue to-blue-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/passenger')}
            className="flex items-center gap-2 mb-4 hover:opacity-80"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Route {matatu.route}</h1>
              <p className="text-blue-100 mt-1">{matatu.plate}</p>
            </div>
            <div className="w-16 h-16 bg-white text-nairobi-blue rounded-lg flex items-center justify-center text-2xl font-bold">
              {matatu.route}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Map Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-nairobi-blue dark:text-blue-400 animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold z-10 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-lg">
              Live Map View (Coming Soon)
            </p>
          </div>
        </div>

        {/* ETA Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-nairobi-blue dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Arrival</p>
                <p className="text-3xl font-bold text-nairobi-blue dark:text-blue-400">{matatu.eta}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{matatu.distance}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Navigation className="w-4 h-4" />
            <span>Heading to {matatu.destination}</span>
          </div>
        </div>

        {/* Occupancy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-nairobi-blue dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Occupancy</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {matatu.occupancy}/{matatu.capacity} Seats
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${
                matatu.occupancy / matatu.capacity > 0.8
                  ? 'text-red-500'
                  : matatu.occupancy / matatu.capacity > 0.5
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}>
                {matatu.occupancy / matatu.capacity > 0.8
                  ? 'Almost Full'
                  : matatu.occupancy / matatu.capacity > 0.5
                  ? 'Moderate'
                  : 'Available'}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                matatu.occupancy / matatu.capacity > 0.8
                  ? 'bg-red-500'
                  : matatu.occupancy / matatu.capacity > 0.5
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${(matatu.occupancy / matatu.capacity) * 100}%` }}
            />
          </div>
        </div>

        {/* Next Stops */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Next Stops</h2>
          <div className="space-y-3">
            {matatu.nextStops.map((stop, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-8 h-8 bg-nairobi-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-900 dark:text-white font-medium">{stop}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Driver Information</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-nairobi-blue text-white rounded-full flex items-center justify-center text-xl font-bold">
                {matatu.driver.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{matatu.driver.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{matatu.driver.rating}</span>
                </div>
              </div>
            </div>
            <a
              href={`tel:${matatu.driver.phone}`}
              className="flex items-center gap-2 px-4 py-2 bg-nairobi-blue text-white rounded-lg hover:bg-blue-900"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackMatatu;
