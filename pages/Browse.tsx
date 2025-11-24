import React, { useState, useEffect } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Note } from '../types';
import NoteCard from '../components/NoteCard';

interface BrowseProps {
  notes: Note[];
  likedNoteIds: string[];
  onLike: (id: string) => void;
}

const BrowsePage: React.FC<BrowseProps> = ({ notes, likedNoteIds, onLike }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  
  // URL Param handling
  const authorId = searchParams.get('author');
  const searchQuery = searchParams.get('q');

  // Initialize/Update search term from URL
  useEffect(() => {
    if (searchQuery) {
        setSearchTerm(searchQuery);
    } else if (!searchTerm && !searchQuery) {
        // If query is removed and we are not typing (this logic can be adjusted based on preference)
        // For now, let's just respect the URL if it exists.
        setSearchTerm('');
    }
  }, [searchQuery]);

  useEffect(() => {
      // If navigating back or clearing, basic sync could happen here if needed
  }, [authorId]);
  
  // Extract unique subjects
  const subjects = ['All', ...Array.from(new Set(notes.map(n => n.subject)))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    const matchesAuthor = authorId ? note.author.id === authorId : true;
    
    return matchesSearch && matchesSubject && matchesAuthor;
  });

  const clearAuthorFilter = () => {
      // Keep search query if it exists, just remove author
      const newParams: any = {};
      if (searchQuery) newParams.q = searchQuery;
      setSearchParams(newParams);
  };

  const clearAllFilters = () => {
      setSearchTerm('');
      setSelectedSubject('All');
      setSearchParams({});
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
              {authorId ? "Author's Notes" : (searchQuery ? `Search Results for "${searchQuery}"` : "Browse Notes")}
          </h1>
          <p className="text-gray-500 mt-1">
              {authorId 
                ? `Showing notes by ${notes.find(n => n.author.id === authorId)?.author.name || 'Author'}` 
                : "Discover materials from students worldwide."
              }
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {authorId && (
              <button 
                onClick={clearAuthorFilter}
                className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200"
              >
                  <X size={16} className="mr-1"/> Clear Author Filter
              </button>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search by title or tag..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 bg-gray-200 text-black placeholder-gray-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-gray-200 text-black w-full sm:w-auto"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.map(note => (
            <NoteCard 
                key={note.id} 
                note={note} 
                isLiked={likedNoteIds.includes(note.id)}
                onLike={onLike}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No notes found matching your criteria.</p>
            <button 
                onClick={clearAllFilters}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-500"
            >
                Clear Filters
            </button>
        </div>
      )}
    </div>
  );
};

export default BrowsePage;