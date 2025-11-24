import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { storage } from '../services/storage';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get return URL from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user = storage.login(email, password);
        onLogin(user);
        
        // Redirect logic
        if (user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate(from);
        }
    } catch (err: any) {
        setError(err.message || 'Login failed');
    } finally {
        setIsLoading(false);
    }
  };

  const fillAdmin = () => {
      setEmail('admin@neonotes.com');
      setPassword('admin');
  };

  const fillStudent = () => {
      setEmail('alex@example.com');
      setPassword('student');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or <button onClick={fillStudent} className="font-medium text-indigo-600 hover:text-indigo-500">try demo student account</button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center">
                  <AlertCircle className="text-red-400 mr-2" size={20} />
                  <p className="text-sm text-red-700">{error}</p>
              </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-200 text-black"
                    placeholder="Enter your email"
                  />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-200 text-black"
                    placeholder="Enter your password"
                  />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-gray-200"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in'}
            </button>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
              <p className="mb-2">Test Credentials:</p>
              <div className="flex justify-center space-x-4">
                  <button type="button" onClick={fillAdmin} className="text-indigo-600 hover:underline">
                      Fill Admin (admin/admin)
                  </button>
                  <button type="button" onClick={fillStudent} className="text-indigo-600 hover:underline">
                      Fill Student (alex/student)
                  </button>
              </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;