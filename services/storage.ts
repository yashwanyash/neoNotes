import { Note, User } from '../types';
import { MOCK_NOTES, MOCK_USER, MOCK_ADMIN } from './mockData';

const NOTES_KEY = 'neonotes_data';
const USER_KEY = 'neonotes_user';
const LIKED_KEY = 'neonotes_liked_ids';

export const storage = {
  init: () => {
    if (!localStorage.getItem(NOTES_KEY)) {
      localStorage.setItem(NOTES_KEY, JSON.stringify(MOCK_NOTES));
    }
    if (!localStorage.getItem(LIKED_KEY)) {
      localStorage.setItem(LIKED_KEY, JSON.stringify([]));
    }
    // We intentionally do NOT set a default user to allow testing the login flow.
  },

  getNotes: (): Note[] => {
    try {
      const data = localStorage.getItem(NOTES_KEY);
      return data ? JSON.parse(data) : MOCK_NOTES;
    } catch (e) {
      return MOCK_NOTES;
    }
  },

  saveNotes: (notes: Note[]) => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  },

  addNote: (note: Note): Note[] => {
    const notes = storage.getNotes();
    const newNotes = [note, ...notes];
    localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
    return newNotes;
  },
  
  updateNote: (updatedNote: Note): Note[] => {
      const notes = storage.getNotes();
      const newNotes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
      localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
      return newNotes;
  },

  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  login: (email: string, password: string): User => {
    // Simulate backend authentication
    if (email === MOCK_ADMIN.email && password === 'admin') {
        localStorage.setItem(USER_KEY, JSON.stringify(MOCK_ADMIN));
        return MOCK_ADMIN;
    }
    
    if (email === MOCK_USER.email && password === 'student') {
        localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
        return MOCK_USER;
    }

    throw new Error('Invalid credentials');
  },

  logout: () => {
      localStorage.removeItem(USER_KEY);
  },

  // Liked Notes Management
  getLikedNoteIds: (): string[] => {
    try {
        const data = localStorage.getItem(LIKED_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
  },

  toggleLike: (noteId: string): { notes: Note[], likedIds: string[] } => {
      const likedIds = storage.getLikedNoteIds();
      const notes = storage.getNotes();
      const isLiked = likedIds.includes(noteId);
      
      let newLikedIds;
      if (isLiked) {
          newLikedIds = likedIds.filter(id => id !== noteId);
      } else {
          newLikedIds = [...likedIds, noteId];
      }
      localStorage.setItem(LIKED_KEY, JSON.stringify(newLikedIds));

      // Update the note count
      const newNotes = notes.map(note => {
          if (note.id === noteId) {
              return { 
                  ...note, 
                  likes: isLiked ? Math.max(0, note.likes - 1) : note.likes + 1 
              };
          }
          return note;
      });
      localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));

      return { notes: newNotes, likedIds: newLikedIds };
  },

  incrementDownload: (noteId: string): Note[] => {
      const notes = storage.getNotes();
      const newNotes = notes.map(note => {
          if (note.id === noteId) {
              return { ...note, downloads: note.downloads + 1 };
          }
          return note;
      });
      localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
      return newNotes;
  }
};