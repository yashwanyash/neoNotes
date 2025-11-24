export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'author' | 'admin';
  avatar: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  content: string; // Plain text simulation for the note content
  course: string;
  year: string;
  subject: string;
  tags: string[];
  thumbnail: string;
  author: User;
  downloads: number;
  likes: number;
  isPremium: boolean;
  price?: number;
  createdAt: string;
  comments: Comment[];
  // New fields for real file handling
  fileData?: string; // Base64 Data URI
  fileName?: string;
  mimeType?: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}