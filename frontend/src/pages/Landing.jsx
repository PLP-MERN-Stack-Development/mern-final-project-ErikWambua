import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Shield, Smartphone, Users, TrendingUp } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Track Your Matatu in <span className="text-nairobi-blue">Real-Time</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Never miss your ride again. MatPulse254 brings real-time matatu tracking to Nairobi, 
            making your commute easier and more predictable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-nairobi-blue text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-900 transition-colors text-lg shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white dark:bg-gray-800 text-nairobi-blue dark:text-blue-400 px-8 py-4 rounded-lg font-semibold border-2 border-nairobi-blue hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-lg shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-nairobi-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Live Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              See exactly where your matatu is on the map in real-time, updated every few seconds.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-nairobi-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Accurate ETAs
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get precise arrival times based on real traffic conditions and current location.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-nairobi-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Safety First
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Verified vehicles and drivers. Share your trip with friends and family for added safety.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-nairobi-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Mobile First
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Works perfectly on your phone. Install as a PWA and use offline when needed.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-nairobi-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Crowd Levels
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Know how full the matatu is before it arrives. Save time and avoid overcrowded rides.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-nairobi-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Route Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              View historical data, peak hours, and best times to travel on your favorite routes.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-nairobi-blue dark:bg-blue-900 rounded-2xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Commute?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Nairobians who are already using MatPulse254 to make their daily travel easier.
          </p>
          <Link
            to="/register"
            className="inline-block bg-matatu-yellow text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-yellow-500 transition-colors text-lg shadow-lg"
          >
            Start Tracking Now
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 MatPulse254. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/about" className="hover:text-nairobi-blue transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-nairobi-blue transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-nairobi-blue transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-nairobi-blue transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
