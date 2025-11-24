import { Note, User } from '../types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Student',
  email: 'alex@example.com',
  role: 'student',
  avatar: 'https://picsum.photos/id/64/100/100'
};

export const MOCK_ADMIN: User = {
  id: 'admin1',
  name: 'System Admin',
  email: 'admin@neonotes.com',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff'
};

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Introduction to React Hooks',
    description: 'A comprehensive guide to useState, useEffect, and custom hooks.',
    content: `React Hooks are functions that let you "hook into" React state and lifecycle features from function components. 
    
    1. useState: Returns a stateful value, and a function to update it.
    2. useEffect: Accepts a function that contains imperative, possibly effectful code.
    3. useContext: Accepts a context object and returns the current context value.
    
    Rules of Hooks:
    - Only Call Hooks at the Top Level
    - Only Call Hooks from React Functions`,
    course: 'Web Development',
    year: '2024',
    subject: 'Frontend',
    tags: ['React', 'JavaScript', 'Frontend'],
    thumbnail: 'https://picsum.photos/seed/react/400/250',
    author: { id: 'a1', name: 'Sarah Dev', email: 'sarah@dev.com', role: 'author', avatar: 'https://picsum.photos/id/237/100/100' },
    downloads: 1205,
    likes: 342,
    isPremium: false,
    createdAt: '2024-03-10',
    comments: [],
    fileName: 'react_hooks_intro.pdf',
    mimeType: 'application/pdf'
  },
  {
    id: 'n2',
    title: 'Advanced Calculus: Limits & Derivatives',
    description: 'Detailed notes on limits, continuity, and differentiation rules.',
    content: `A limit is the value that a function (or sequence) approaches as the input (or index) approaches some value.
    
    Derivatives represent the rate of change of a function with respect to a variable. Geometrically, the derivative is the slope of the tangent line to the graph of the function at a given point.
    
    Common Rules:
    - Power Rule
    - Product Rule
    - Quotient Rule
    - Chain Rule`,
    course: 'Mathematics',
    year: '2023',
    subject: 'Calculus',
    tags: ['Math', 'Calculus', 'Limits'],
    thumbnail: 'https://picsum.photos/seed/math/400/250',
    author: { id: 'a2', name: 'Prof. Math', email: 'prof@math.com', role: 'author', avatar: 'https://picsum.photos/id/20/100/100' },
    downloads: 850,
    likes: 120,
    isPremium: true,
    price: 4.99,
    createdAt: '2024-02-15',
    comments: []
  },
  {
    id: 'n3',
    title: 'Organic Chemistry: Hydrocarbons',
    description: 'Study notes covering Alkanes, Alkenes, and Alkynes.',
    content: `Hydrocarbons are organic compounds consisting entirely of hydrogen and carbon.
    
    Alkanes: Saturated hydrocarbons (single bonds). Formula CnH2n+2.
    Alkenes: Unsaturated hydrocarbons (double bonds). Formula CnH2n.
    Alkynes: Unsaturated hydrocarbons (triple bonds). Formula CnH2n-2.
    
    Reactions:
    - Combustion
    - Halogenation
    - Hydrogenation`,
    course: 'Chemistry',
    year: '2024',
    subject: 'Science',
    tags: ['Chemistry', 'Organic', 'Science'],
    thumbnail: 'https://picsum.photos/seed/chem/400/250',
    author: { id: 'a1', name: 'Sarah Dev', email: 'sarah@dev.com', role: 'author', avatar: 'https://picsum.photos/id/237/100/100' },
    downloads: 543,
    likes: 89,
    isPremium: false,
    createdAt: '2024-03-01',
    comments: []
  },
   {
    id: 'n4',
    title: 'Machine Learning Basics',
    description: 'Introduction to Supervised and Unsupervised Learning.',
    content: `Machine learning is a field of inquiry devoted to understanding and building methods that 'learn', that is, methods that leverage data to improve performance on some set of tasks.
    
    Supervised Learning:
    The algorithm learns on a labeled dataset, providing an answer key that the algorithm can use to evaluate its accuracy on training data.
    
    Unsupervised Learning:
    Provides unlabeled data that the algorithm tries to make sense of by extracting features and patterns on its own.`,
    course: 'Computer Science',
    year: '2024',
    subject: 'AI',
    tags: ['AI', 'ML', 'Python'],
    thumbnail: 'https://picsum.photos/seed/ai/400/250',
    author: { id: 'a3', name: 'Tech Guru', email: 'tech@guru.com', role: 'author', avatar: 'https://picsum.photos/id/60/100/100' },
    downloads: 2100,
    likes: 560,
    isPremium: true,
    price: 9.99,
    createdAt: '2024-01-20',
    comments: []
  },
];