import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-nairobi-blue dark:text-blue-400 mb-4">
          404
        </h1>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have taken a different route.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-nairobi-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-lg"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-nairobi-blue dark:text-blue-400 px-6 py-3 rounded-lg font-semibold border-2 border-nairobi-blue hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
