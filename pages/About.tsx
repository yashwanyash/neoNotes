import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About NeoNotes</h1>
      <div className="prose prose-indigo text-gray-500 space-y-4">
        <p className="text-lg leading-relaxed">
          NeoNotes is a modern, community-driven study platform designed to democratize education. We believe that knowledge grows when it is shared, which is why we've built a space for students, educators, and lifelong learners to connect.
        </p>
        
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to make high-quality study materials accessible to everyone. By allowing students to upload, share, and discover notes, we aim to reduce the stress of exam preparation and foster a collaborative learning environment.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How It Works</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Share:</strong> Upload your lecture notes, summaries, and guides.</li>
          <li><strong>Discover:</strong> Search through a vast library of student-contributed content.</li>
          <li><strong>Learn:</strong> Use our tools to study smarter and improve your academic performance.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;