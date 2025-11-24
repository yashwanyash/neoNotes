import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <div className="prose prose-indigo text-gray-500 space-y-4">
        <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

        <p>
          Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the NeoNotes website operated by us.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Accounts</h2>
        <p>
          When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Content</h2>
        <p>
          Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
        <p>
          The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of NeoNotes and its licensors.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Termination</h2>
        <p>
          We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;