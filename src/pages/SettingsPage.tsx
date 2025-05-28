import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface APISettings {
  apiKey: string;
  rateLimit: number;
  enableCORS: boolean;
}

interface EmailSettings {
  senderName: string;
  senderEmail: string;
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
}

interface StorageSettings {
  storageLocation: string;
  maxFileSize: number;
  retentionPeriod: number;
  autoDelete: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'email' | 'storage'>('api');
  
  const apiForm = useForm<APISettings>({
    defaultValues: {
      apiKey: 'YOUR_API_KEY_HERE',
      rateLimit: 100,
      enableCORS: true,
    }
  });
  
  const emailForm = useForm<EmailSettings>({
    defaultValues: {
      senderName: 'PDF Service',
      senderEmail: 'noreply@example.com',
      smtpServer: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'smtp_user',
      smtpPassword: 'YOUR_PASSWORD_HERE',
    }
  });
  
  const storageForm = useForm<StorageSettings>({
    defaultValues: {
      storageLocation: 'local',
      maxFileSize: 10,
      retentionPeriod: 30,
      autoDelete: true,
    }
  });
  
  const handleSaveAPI = (data: APISettings) => {
    // In a real app, this would save to the server
    console.log('API settings:', data);
    toast.success('API settings saved successfully!');
  };
  
  const handleSaveEmail = (data: EmailSettings) => {
    // In a real app, this would save to the server
    console.log('Email settings:', data);
    toast.success('Email settings saved successfully!');
  };
  
  const handleSaveStorage = (data: StorageSettings) => {
    // In a real app, this would save to the server
    console.log('Storage settings:', data);
    toast.success('Storage settings saved successfully!');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Configure your PDF conversion service</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('api')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'api'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              API Settings
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'email'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Email Settings
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'storage'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Storage Settings
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'api' && (
            <form onSubmit={apiForm.handleSubmit(handleSaveAPI)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="flex">
                  <input
                    type="password"
                    {...apiForm.register('apiKey')}
                    className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-700 hover:bg-gray-200"
                  >
                    Regenerate
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Keep this key secret. It provides full access to your API.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate Limit (requests per minute)
                </label>
                <input
                  type="number"
                  {...apiForm.register('rateLimit')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableCORS"
                  {...apiForm.register('enableCORS')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableCORS" className="ml-2 block text-sm text-gray-700">
                  Enable CORS (Cross-Origin Resource Sharing)
                </label>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save API Settings
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'email' && (
            <form onSubmit={emailForm.handleSubmit(handleSaveEmail)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    {...emailForm.register('senderName')}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    {...emailForm.register('senderEmail')}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    {...emailForm.register('smtpServer')}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    {...emailForm.register('smtpPort')}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    {...emailForm.register('smtpUsername')}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    {...emailForm.register('smtpPassword')}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Email Settings
                </button>
                <button
                  type="button"
                  className="ml-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Test Email
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'storage' && (
            <form onSubmit={storageForm.handleSubmit(handleSaveStorage)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Location
                </label>
                <select
                  {...storageForm.register('storageLocation')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="local">Local Storage</option>
                  <option value="s3">Amazon S3</option>
                  <option value="gcs">Google Cloud Storage</option>
                  <option value="azure">Azure Blob Storage</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum File Size (MB)
                </label>
                <input
                  type="number"
                  {...storageForm.register('maxFileSize')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retention Period (days)
                </label>
                <input
                  type="number"
                  {...storageForm.register('retentionPeriod')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Files will be automatically deleted after this period. Set to 0 for unlimited retention.
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoDelete"
                  {...storageForm.register('autoDelete')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="autoDelete" className="ml-2 block text-sm text-gray-700">
                  Automatically delete files after retention period
                </label>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Storage Settings
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;