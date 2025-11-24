import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Heart, Clock } from 'lucide-react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  isLiked?: boolean;
  onLike?: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, isLiked = false, onLike }) => {
  
  const handleLikeClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onLike) {
          onLike(note.id);
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={note.thumbnail} 
          alt={note.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        {note.isPremium && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            PREMIUM
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-2">
            {note.tags.slice(0, 2).map(tag => (
                <span key={tag} className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                    {tag}
                </span>
            ))}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">{note.subject}</span>
            <span>•</span>
            <span>{note.year}</span>
        </div>

        <Link to={`/note/${note.id}`} className="block mb-2 group">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {note.title}
          </h3>
        </Link>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
          {note.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div className="flex items-center space-x-2">
            <img 
              src={note.author.avatar} 
              alt={note.author.name} 
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-gray-600 font-medium truncate max-w-[80px]">
              {note.author.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-400 text-xs">
            <span className="flex items-center">
              <Download size={14} className="mr-1" />
              {note.downloads}
            </span>
            <button 
                onClick={handleLikeClick}
                className={`flex items-center transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            >
              <Heart size={14} className={`mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {note.likes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;