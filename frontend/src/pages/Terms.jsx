import React from 'react';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="bg-nairobi-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last updated: December 2024
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                By accessing and using MatPulse254, you accept and agree to be bound by the terms 
                and provisions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Use of Service
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                You agree to use this service only for lawful purposes and in accordance with these terms:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>You must be at least 13 years old to use this service</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must provide accurate registration information</li>
                <li>You will not misuse or abuse the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. Service Availability
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                While we strive to provide accurate real-time information, we cannot guarantee 100% 
                accuracy or continuous availability of the service. Service may be interrupted for 
                maintenance or technical issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Intellectual Property
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                All content, features, and functionality of MatPulse254 are owned by us and protected 
                by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                MatPulse254 shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Modifications
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the service 
                after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                For questions about these Terms of Service, contact us at legal@matpulse254.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
