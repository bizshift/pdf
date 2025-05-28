import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Folder, Settings, LogOut, FileCode } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: FileCode, label: 'Convert', path: '/convert' },
  { icon: Folder, label: 'Documents', path: '/documents' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="bg-blue-900 w-64 flex-shrink-0 hidden md:flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-blue-800">
        <FileText className="h-8 w-8 text-white" />
        <span className="text-white font-bold text-lg ml-2">PDFMaster</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="px-2 space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-100 rounded-lg transition-colors",
                  location.pathname === item.path 
                    ? "bg-blue-800 text-white" 
                    : "hover:bg-blue-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-blue-800">
        <button className="flex items-center px-4 py-2 text-gray-100 rounded-lg hover:bg-blue-800 hover:text-white transition-colors w-full">
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;