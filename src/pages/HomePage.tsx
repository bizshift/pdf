import React from 'react';
import { FileText, Upload, Link as LinkIcon, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';

const HomePage: React.FC = () => {
  const stats = [
    { title: 'Conversions', value: '124', icon: FileText, change: '+12%', color: 'bg-blue-500' },
    { title: 'Storage Used', value: '1.2 GB', icon: Upload, change: '+5%', color: 'bg-purple-500' },
    { title: 'Active Links', value: '28', icon: LinkIcon, change: '+8%', color: 'bg-teal-500' },
    { title: 'Emails Sent', value: '86', icon: Mail, change: '+15%', color: 'bg-amber-500' },
  ];

  const recentDocuments = [
    { id: '1', name: 'Invoice-2025-001.pdf', date: '2025-03-01', size: '256 KB' },
    { id: '2', name: 'Contract-Johnson.pdf', date: '2025-02-28', size: '1.2 MB' },
    { id: '3', name: 'Report-Q1-2025.pdf', date: '2025-02-25', size: '3.4 MB' },
    { id: '4', name: 'Invoice-2025-002.pdf', date: '2025-02-22', size: '245 KB' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome to your HTML to PDF conversion dashboard</p>
        </div>
        <Link 
          to="/convert" 
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FileText className="mr-2 h-4 w-4" />
          New Conversion
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard 
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            color={stat.color}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Documents</h2>
          <Link 
            to="/documents" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                    <button className="text-blue-600 hover:text-blue-900">Share</button>
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

export default HomePage;