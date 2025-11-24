import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Clock, TrendingUp } from 'lucide-react';
import { Note } from '../types';
import NoteCard from '../components/NoteCard';

interface HomeProps {
  notes: Note[];
  likedNoteIds: string[];
  onLike: (id: string) => void;
}

const HomePage: React.FC<HomeProps> = ({ notes, likedNoteIds, onLike }) => {
  // Sort notes for different sections
  const recentNotes = [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  const popularNotes = [...notes].sort((a, b) => b.downloads - a.downloads).slice(0, 4);

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="bg-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center bg-indigo-600 rounded-full px-3 py-1 mb-6 border border-indigo-500">
                <Sparkles className="text-yellow-300 w-4 h-4 mr-2" />
                <span className="text-indigo-100 text-xs font-semibold uppercase tracking-wide">AI-Powered Learning</span>
            </div>
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl mb-6">
              Share Knowledge,<br/>
              <span className="text-indigo-200">Study Smarter.</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Access thousands of study notes, summarized and enhanced by Gemini AI. Join a community of top students and educators today.
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <Link
                  to="/browse"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                >
                  Browse Notes
                </Link>
                <Link
                  to="/upload"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70 sm:px-8 backdrop-blur-sm"
                >
                  Start Uploading
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                    <Zap />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Instant AI Summaries</h3>
                <p className="text-gray-500 text-sm">Don't have time? Get key insights from long documents in seconds using Gemini.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
                    <ShieldCheck />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Verified Content</h3>
                <p className="text-gray-500 text-sm">Quality controlled notes from verified authors and top students.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                    <Sparkles />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Smart Search</h3>
                <p className="text-gray-500 text-sm">Find exactly what you need with semantic search powered by advanced AI models.</p>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Recent Uploads Section */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Clock className="text-indigo-600 mr-2" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Recent Uploads</h2>
                </div>
                <Link to="/browse" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center text-sm">
                    View all <ArrowRight size={16} className="ml-1" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentNotes.map(note => (
                <NoteCard 
                    key={note.id} 
                    note={note} 
                    isLiked={likedNoteIds.includes(note.id)}
                    onLike={onLike}
                />
            ))}
            </div>
        </div>

        {/* Popular Notes Section */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <TrendingUp className="text-indigo-600 mr-2" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Most Popular</h2>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularNotes.map(note => (
                <NoteCard 
                    key={note.id} 
                    note={note} 
                    isLiked={likedNoteIds.includes(note.id)}
                    onLike={onLike}
                />
            ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;