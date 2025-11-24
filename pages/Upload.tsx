import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, Sparkles, Loader2, FileText, AlertTriangle } from 'lucide-react';
import { Note, User } from '../types';
import { generateTagsForNote } from '../services/geminiService';

interface UploadProps {
  onUpload: (note: Note) => void;
  currentUser: User | null;
}

const UploadPage: React.FC<UploadProps> = ({ onUpload, currentUser }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    course: '',
    year: '',
    content: '',
    price: '',
    isPremium: false,
  });
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  if (!currentUser) {
    return (
        <div className="max-w-md mx-auto mt-20 text-center p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to upload notes.</p>
            <button 
                onClick={() => navigate('/login')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700"
            >
                Go to Login
            </button>
        </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData(prev => ({ ...prev, isPremium: e.target.checked }));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file size (limit to ~2MB for localStorage safety)
      if (selectedFile.size > 2 * 1024 * 1024) {
          alert("For this browser-based demo, please upload files smaller than 2MB to avoid storage limits.");
          return;
      }
      setFile(selectedFile);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleGenerateTags = async () => {
    if (!formData.title || !formData.description) {
        alert("Please enter a title and description first.");
        return;
    }
    setIsGeneratingTags(true);
    const aiTags = await generateTagsForNote(formData.title, formData.description);
    setTags(prev => [...new Set([...prev, ...aiTags])]);
    setIsGeneratingTags(false);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingFile(true);
    
    const noteId = `n${Date.now()}`;
    let fileData = undefined;
    
    try {
        if (file) {
            fileData = await convertFileToBase64(file);
        }

        const newNote: Note = {
            id: noteId,
            title: formData.title,
            description: formData.description,
            // Keep content fallback for AI context if provided, otherwise default msg
            content: formData.content || "This note contains a file attachment. The text content was not extracted.",
            course: formData.course,
            year: formData.year,
            subject: formData.subject,
            tags: tags,
            thumbnail: `https://picsum.photos/seed/${noteId}/400/250`,
            author: currentUser,
            downloads: 0,
            likes: 0,
            isPremium: formData.isPremium,
            price: formData.isPremium ? parseFloat(formData.price) : undefined,
            createdAt: new Date().toISOString().split('T')[0],
            comments: [],
            // New file fields
            fileData: fileData,
            fileName: file ? file.name : undefined,
            mimeType: file ? file.type : undefined,
        };

        onUpload(newNote);
        navigate('/');
    } catch (error) {
        console.error("Error processing file", error);
        alert("Failed to process file upload.");
    } finally {
        setIsProcessingFile(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-xl font-bold text-white flex items-center">
            <UploadIcon className="mr-2" /> Upload New Note
          </h1>
          <p className="text-indigo-200 text-sm mt-1">Share your knowledge with the community.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
            {file ? (
                <div className="flex items-center justify-center space-x-2 text-indigo-600">
                    <FileText size={24} />
                    <span className="font-medium">{file.name}</span>
                    <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    <button type="button" onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <>
                    <div className="mx-auto h-12 w-12 text-gray-400">
                    <UploadIcon className="h-full w-full" />
                    </div>
                    <div className="mt-4 flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.jpg,.png" required />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, Images, Text up to 2MB (Browser Limit)</p>
                </>
            )}
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                        Note: Files are stored in your browser's local storage. Large files may fail to save.
                    </p>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input 
                type="text" 
                name="title" 
                required
                value={formData.title} 
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-200 text-black placeholder-gray-500" 
                placeholder="e.g. Introduction to Quantum Physics"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                name="description" 
                rows={3} 
                required
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-200 text-black placeholder-gray-500"
                placeholder="What is this note about?"
              />
            </div>
            
            {/* Note Content (Hidden simulated text for AI) */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                  AI Context (Optional)
                  <span className="text-xs text-gray-500 font-normal ml-2">Paste text content here to help the AI tutor (since it cannot read the PDF pixels in this demo).</span>
              </label>
              <textarea 
                name="content" 
                rows={4} 
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono text-xs text-black placeholder-gray-500 bg-gray-200"
                placeholder="Paste some text from your document here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input 
                type="text" 
                name="subject" 
                required
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-200 text-black placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Course / Module</label>
              <input 
                type="text" 
                name="course" 
                value={formData.course}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-200 text-black placeholder-gray-500"
              />
            </div>
            
             <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-200 text-black"
              >
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-indigo-900">Tags</label>
                <button 
                    type="button" 
                    onClick={handleGenerateTags}
                    disabled={isGeneratingTags}
                    className="text-xs flex items-center bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-200 hover:bg-indigo-50"
                >
                    {isGeneratingTags ? <Loader2 className="animate-spin h-3 w-3 mr-1"/> : <Sparkles className="h-3 w-3 mr-1" />}
                    Auto-Generate
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-indigo-400 hover:text-indigo-600 focus:outline-none">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black placeholder-gray-500" 
              placeholder="Type and press Enter to add tags..."
            />
          </div>

          <div className="flex items-center space-x-4">
             <div className="flex items-center h-5">
                <input
                    id="isPremium"
                    name="isPremium"
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={handleCheckboxChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-200"
                />
             </div>
             <div className="ml-2 text-sm">
                <label htmlFor="isPremium" className="font-medium text-gray-700">Sell this note (Premium)</label>
                <p className="text-gray-500">Students will have to pay to download.</p>
             </div>
             
             {formData.isPremium && (
                 <div className="ml-4">
                     <input 
                        type="number" 
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price ($)"
                        className="w-24 border border-gray-300 rounded-md py-1 px-2 text-sm bg-gray-200 text-black placeholder-gray-500"
                     />
                 </div>
             )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isProcessingFile}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
            >
              {isProcessingFile ? <span className="flex items-center"><Loader2 className="animate-spin mr-2 h-4 w-4"/> Processing...</span> : 'Upload Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;