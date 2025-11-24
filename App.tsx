import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Upload, User, Search, Menu, X, Home, Compass, Shield, LogOut } from 'lucide-react';
import { Note, User as UserType } from './types';
import { storage } from './services/storage';

// Pages
import HomePage from './pages/Home';
import BrowsePage from './pages/Browse';
import NoteDetailPage from './pages/NoteDetail';
import UploadPage from './pages/Upload';
import AdminPage from './pages/Admin';
import LoginPage from './pages/Login';
import AboutPage from './pages/About';
import PrivacyPage from './pages/Privacy';
import TermsPage from './pages/Terms';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [likedNoteIds, setLikedNoteIds] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search State
  const [navSearchTerm, setNavSearchTerm] = useState('');

  // Initialize storage and load data
  useEffect(() => {
    storage.init();
    setNotes(storage.getNotes());
    setCurrentUser(storage.getUser());
    setLikedNoteIds(storage.getLikedNoteIds());
  }, []);

  const handleAddNote = (newNote: Note) => {
    const updatedNotes = storage.addNote(newNote);
    setNotes(updatedNotes);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    const updatedNotes = storage.updateNote(updatedNote);
    setNotes(updatedNotes);
  };

  const handleLikeNote = (noteId: string) => {
      const result = storage.toggleLike(noteId);
      setNotes(result.notes);
      setLikedNoteIds(result.likedIds);
  };

  const handleDownloadNote = (noteId: string) => {
      const updatedNotes = storage.incrementDownload(noteId);
      setNotes(updatedNotes);
  };

  const handleLogin = (user: UserType) => {
      setCurrentUser(user);
  };

  const handleLogout = () => {
      storage.logout();
      setCurrentUser(null);
      setIsMobileMenuOpen(false);
  };

  const handleNavSearch = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          navigate(`/browse?q=${encodeURIComponent(navSearchTerm)}`);
          setIsMobileMenuOpen(false);
      }
  };

  const NavLink = ({ to, icon: Icon, label, active }: any) => (
    <Link 
      to={to} 
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );

  return (
      <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                  <div className="bg-indigo-600 p-2 rounded-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">NeoNotes</span>
                </Link>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                  <NavLink to="/" icon={Home} label="Home" />
                  <NavLink to="/browse" icon={Compass} label="Browse" />
                  <NavLink to="/upload" icon={Upload} label="Upload" />
                  {currentUser?.role === 'admin' && (
                      <NavLink to="/admin" icon={Shield} label="Admin" />
                  )}
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search notes..." 
                    value={navSearchTerm}
                    onChange={(e) => setNavSearchTerm(e.target.value)}
                    onKeyDown={handleNavSearch}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all bg-gray-200 text-black placeholder-gray-500"
                  />
                </div>
                {currentUser ? (
                  <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                    <div className="flex flex-col items-end mr-1">
                        <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
                        <span className="text-xs text-gray-500 uppercase">{currentUser.role}</span>
                    </div>
                    <img 
                      src={currentUser.avatar} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full border border-gray-200"
                    />
                    <button 
                        onClick={handleLogout}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 px-3 py-2 rounded-md hover:bg-indigo-50 transition-colors">
                      Sign In
                  </Link>
                )}
              </div>
              <div className="flex items-center sm:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden bg-white border-t border-gray-200">
              <div className="pt-2 pb-3 space-y-1 px-2">
                <div className="px-3 pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input 
                            type="text" 
                            placeholder="Search notes..." 
                            value={navSearchTerm}
                            onChange={(e) => setNavSearchTerm(e.target.value)}
                            onKeyDown={handleNavSearch}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full bg-gray-100 text-black"
                        />
                    </div>
                </div>
                <NavLink to="/" icon={Home} label="Home" />
                <NavLink to="/browse" icon={Compass} label="Browse Notes" />
                <NavLink to="/upload" icon={Upload} label="Upload Note" />
                {currentUser?.role === 'admin' && (
                    <NavLink to="/admin" icon={Shield} label="Admin Panel" />
                )}
                <div className="border-t border-gray-200 my-2 pt-2">
                    {currentUser ? (
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            <LogOut size={18} />
                            <span>Sign Out ({currentUser.name})</span>
                        </button>
                    ) : (
                        <Link 
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                        >
                            <User size={18} />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  notes={notes} 
                  likedNoteIds={likedNoteIds}
                  onLike={handleLikeNote}
                />
              } 
            />
            <Route 
              path="/browse" 
              element={
                <BrowsePage 
                  notes={notes} 
                  likedNoteIds={likedNoteIds}
                  onLike={handleLikeNote}
                />
              } 
            />
            <Route 
              path="/note/:id" 
              element={
                <NoteDetailPage 
                  notes={notes} 
                  currentUser={currentUser}
                  likedNoteIds={likedNoteIds}
                  onUpdateNote={handleUpdateNote} 
                  onLike={handleLikeNote}
                  onDownload={handleDownloadNote}
                />
              } 
            />
            <Route path="/upload" element={<UploadPage onUpload={handleAddNote} currentUser={currentUser} />} />
            
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Protected Admin Route */}
            <Route 
                path="/admin" 
                element={
                    currentUser?.role === 'admin' 
                    ? <AdminPage notes={notes} /> 
                    : <Navigate to="/login" replace state={{ from: { pathname: '/admin' } }} />
                } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex justify-center md:justify-start space-x-6 md:order-2">
                <Link to="/about" className="text-gray-400 hover:text-gray-500 text-sm">About</Link>
                <Link to="/privacy" className="text-gray-400 hover:text-gray-500 text-sm">Privacy</Link>
                <Link to="/terms" className="text-gray-400 hover:text-gray-500 text-sm">Terms</Link>
              </div>
              <div className="mt-8 md:mt-0 md:order-1">
                <p className="text-center text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} NeoNotes. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      </>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;