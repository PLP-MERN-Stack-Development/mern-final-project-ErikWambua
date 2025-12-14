import React from 'react';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="bg-nairobi-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last updated: December 2024
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We collect information you provide directly to us, including your name, phone number, 
                email address, and location data when you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Your information is used to provide and improve our services, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Providing real-time matatu tracking</li>
                <li>Sending service notifications and updates</li>
                <li>Improving user experience</li>
                <li>Ensuring safety and security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We implement appropriate security measures to protect your personal information from 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Location Data
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We collect location data to provide real-time tracking services. You can disable location 
                services at any time through your device settings, though this may limit app functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Your Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Request data correction or deletion</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at 
                privacy@matpulse254.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
