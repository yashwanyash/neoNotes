import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Download, Heart, Share2, MessageSquare, Brain, Send, User as UserIcon, Loader2, FileText, Check, AlertCircle } from 'lucide-react';
import { Note, User } from '../types';
import { chatWithNoteContext } from '../services/geminiService';

interface NoteDetailProps {
  notes: Note[];
  currentUser: User | null;
  likedNoteIds: string[];
  onUpdateNote: (note: Note) => void;
  onLike: (id: string) => void;
  onDownload: (id: string) => void;
}

const NoteDetailPage: React.FC<NoteDetailProps> = ({ 
    notes, 
    currentUser, 
    likedNoteIds, 
    onUpdateNote, 
    onLike, 
    onDownload 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | undefined>(undefined);
  
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  // Interaction States
  const [commentInput, setCommentInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const found = notes.find(n => n.id === id);
    setNote(found);
    // Reset states when note changes
    setChatHistory([]);
  }, [id, notes]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !note) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsChatting(true);
    const response = await chatWithNoteContext(note.content, chatHistory, userMsg);
    setIsChatting(false);

    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
  };

  const toggleLike = () => {
      if (!note) return;
      onLike(note.id);
  };

  const handleDownloadFile = () => {
      if (!note) return;
      
      const element = document.createElement("a");
      
      if (note.fileData) {
          // Download real file
          element.href = note.fileData;
          element.download = note.fileName || `${note.title.replace(/\s+/g, '_')}.pdf`;
      } else {
          // Fallback: Create a text blob if no real file exists (older mock data)
          const file = new Blob([note.content], {type: 'text/plain'});
          element.href = URL.createObjectURL(file);
          element.download = `${note.title.replace(/\s+/g, '_')}.txt`;
      }
      
      document.body.appendChild(element); 
      element.click();
      document.body.removeChild(element);

      // Increment count in storage
      onDownload(note.id);
  };

  const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  const handleViewProfile = () => {
      if(note) {
          navigate(`/browse?author=${note.author.id}`);
      }
  };

  const handlePostComment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!note || !commentInput.trim() || !currentUser) return;
      
      const newComment = {
          id: `c${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content: commentInput,
          createdAt: new Date().toISOString()
      };
      
      const updatedNote = { 
          ...note, 
          comments: [newComment, ...(note.comments || [])] 
      };
      
      onUpdateNote(updatedNote);
      setCommentInput('');
  };

  if (!note) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Note not found.</p>
      </div>
    );
  }

  const isLiked = likedNoteIds.includes(note.id);
  const isPDF = note.mimeType === 'application/pdf';
  const isImage = note.mimeType?.startsWith('image/');
  const hasRealFile = !!note.fileData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/browse" className="hover:text-indigo-600">Browse</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{note.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Note Content (Preview) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{note.title}</h1>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">{note.course}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{note.subject}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{note.year}</span>
                            {hasRealFile && <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">File Available</span>}
                        </div>
                    </div>
                    <button 
                        onClick={toggleLike}
                        className={`p-2 transition-colors transform active:scale-95 rounded-full hover:bg-gray-50 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                        <Heart size={24} className={isLiked ? "fill-current" : ""} />
                    </button>
                </div>
            </div>

            {/* File Viewer / Content Preview */}
            <div className="bg-gray-50 min-h-[500px] flex flex-col items-center justify-center relative">
                {hasRealFile ? (
                    isPDF ? (
                        <iframe 
                            src={note.fileData} 
                            className="w-full h-[600px] border-none" 
                            title="PDF Preview"
                        />
                    ) : isImage ? (
                        <img 
                            src={note.fileData} 
                            alt="Note Preview" 
                            className="max-w-full max-h-[600px] object-contain" 
                        />
                    ) : (
                        <div className="text-center p-8">
                            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">File Preview Not Available</h3>
                            <p className="text-gray-500 mt-2">This file type ({note.mimeType}) cannot be previewed in the browser.</p>
                            <button 
                                onClick={handleDownloadFile}
                                className="mt-4 text-indigo-600 font-medium hover:underline"
                            >
                                Download to view
                            </button>
                        </div>
                    )
                ) : (
                    <div className="p-8 flex flex-col items-center justify-center text-center w-full">
                        <FileText className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">Text Preview Mode</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            This is a text-based preview of the content logic.
                        </p>
                        <div className="bg-white border border-gray-200 p-6 rounded-lg text-left w-full max-w-2xl shadow-sm font-mono text-sm text-gray-600 whitespace-pre-line overflow-auto max-h-[400px]">
                            {note.content}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={handleDownloadFile}
                        className="flex items-center space-x-2 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Download size={18} />
                        <span>Download {hasRealFile ? 'File' : 'Text'}</span>
                    </button>
                    <button 
                        onClick={handleShare}
                        className="flex items-center space-x-2 text-gray-600 hover:bg-white hover:shadow-sm px-4 py-2 rounded-lg font-medium transition-all"
                    >
                        {isCopied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
                        <span>{isCopied ? 'Copied!' : 'Share'}</span>
                    </button>
                </div>
                {note.isPremium && (
                    <div className="text-lg font-bold text-gray-900 bg-yellow-100 px-3 py-1 rounded-md border border-yellow-200">
                        ${note.price}
                    </div>
                )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" /> Comments ({note.comments?.length || 0})
            </h3>
            
            {currentUser && (
                <form onSubmit={handlePostComment} className="mb-6 flex gap-3">
                    <img src={currentUser.avatar} alt="You" className="w-8 h-8 rounded-full" />
                    <div className="flex-grow">
                        <input 
                            type="text" 
                            value={commentInput} 
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-gray-200 border-0 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 text-sm text-black placeholder-gray-500"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!commentInput.trim()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Post
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {note.comments && note.comments.length > 0 ? (
                    note.comments.map((comment, idx) => (
                        <div key={idx} className="flex space-x-3">
                            <img src={comment.userAvatar} alt={comment.userName} className="w-8 h-8 rounded-full" />
                            <div>
                                <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-tl-none">
                                    <span className="font-bold text-sm text-gray-900 block">{comment.userName}</span>
                                    <p className="text-sm text-gray-700">{comment.content}</p>
                                </div>
                                <span className="text-xs text-gray-500 ml-1 mt-1 block">Just now</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No comments yet. Be the first to start the discussion!
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Column: AI & Metadata */}
        <div className="space-y-6">
            
            {/* Author Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                    <img src={note.author.avatar} alt={note.author.name} className="w-12 h-12 rounded-full" />
                    <div>
                        <h4 className="font-bold text-gray-900">{note.author.name}</h4>
                        <p className="text-xs text-gray-500 uppercase">{note.author.role}</p>
                    </div>
                </div>
                <button 
                    onClick={handleViewProfile}
                    className="w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-2 rounded-lg text-sm transition-colors"
                >
                    View Profile
                </button>
            </div>

            {/* AI Tutor Chat */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px]">
                <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 flex items-center">
                        <Brain className="mr-2 h-5 w-5 text-indigo-600" /> Chat with Note
                    </h3>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Beta</span>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {chatHistory.length === 0 && (
                        <div className="text-center text-gray-400 text-sm mt-10">
                            <p>Ask anything about this note.</p>
                            <p className="text-xs mt-2">"What is the main formula?"</p>
                            <p className="text-xs">"Explain the second paragraph."</p>
                            {!hasRealFile && <p className="text-xs mt-4 text-orange-400 flex items-center justify-center"><AlertCircle size={12} className="mr-1"/> AI uses text context, not PDF pixels.</p>}
                        </div>
                    )}
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-gray-100 text-gray-800 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isChatting && (
                        <div className="flex justify-start">
                             <div className="bg-gray-100 rounded-lg p-3 rounded-tl-none">
                                <Loader2 className="animate-spin h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-100">
                    <div className="relative">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-200 text-black placeholder-gray-500"
                        />
                        <button 
                            type="submit" 
                            disabled={!chatInput.trim() || isChatting}
                            className="absolute right-1 top-1 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </form>
            </div>

        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;