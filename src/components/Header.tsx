import React from 'react';
import { Bell, Settings, HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">HTML to PDF Converter</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <HelpCircle size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button>
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;