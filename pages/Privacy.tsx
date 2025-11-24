import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-indigo text-gray-500 space-y-4">
        <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          At NeoNotes, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
        <p>
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data:</strong> includes email address.</li>
          <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Data</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>To register you as a new customer.</li>
          <li>To manage our relationship with you.</li>
          <li>To improve our website, products/services, marketing or customer relationships.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;