import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Target, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            About MatPulse254
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12">
            Revolutionizing public transport in Nairobi
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              MatPulse254 is dedicated to making public transportation in Nairobi more accessible, 
              reliable, and efficient. We provide real-time tracking of matatus, helping thousands 
              of commuters plan their journeys better and save time every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-nairobi-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Real-Time Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your matatu in real-time and know exactly when it will arrive at your stage.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-nairobi-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built for Nairobians by Nairobians, with feedback from thousands of daily commuters.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-nairobi-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Accuracy First
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Using advanced algorithms to provide accurate ETAs based on real traffic conditions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-nairobi-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Safety & Trust
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                All vehicles and drivers are verified to ensure a safe journey for every passenger.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-block bg-nairobi-blue text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-lg"
            >
              Join Us Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
