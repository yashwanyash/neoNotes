import React from 'react';
import { BarChart, Users, FileText, DollarSign, AlertTriangle, Check, X } from 'lucide-react';
import { Note } from '../types';

interface AdminProps {
  notes: Note[];
}

const AdminPage: React.FC<AdminProps> = ({ notes }) => {
  const pendingNotes = notes.slice(0, 2); // Simulate pending notes
  const totalDownloads = notes.reduce((acc, note) => acc + note.downloads, 0);
  const totalRevenue = notes.reduce((acc, note) => acc + (note.isPremium && note.price ? note.price * 12 : 0), 0); // Fake revenue calculation

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-full text-indigo-600 mr-4">
                    <FileText size={20} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Notes</p>
                    <p className="text-2xl font-bold text-gray-900">{notes.length}</p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
                    <DownloadIcon size={20} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Downloads</p>
                    <p className="text-2xl font-bold text-gray-900">{totalDownloads}</p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 mr-4">
                    <DollarSign size={20} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full text-red-600 mr-4">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Reports</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
            </div>
        </div>
      </div>

      {/* Content Moderation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Pending Uploads (Moderation Queue)</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pendingNotes.map(note => (
                        <tr key={note.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        <img className="h-10 w-10 rounded object-cover" src={note.thumbnail} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{note.title}</div>
                                        <div className="text-sm text-gray-500">{note.subject}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{note.author.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {note.createdAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-green-600 hover:text-green-900 mr-3"><Check size={18} /></button>
                                <button className="text-red-600 hover:text-red-900"><X size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

// Quick fix for missing icon in this file context
const DownloadIcon = ({size}: {size:number}) => (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="lucide lucide-download"
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
    </svg>
)

export default AdminPage;
