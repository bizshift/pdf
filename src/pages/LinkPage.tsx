import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Download, Clock, Shield, Eye } from 'lucide-react';
import { getLinkInfo, getDownloadUrl } from '../api/apiClient';

interface LinkStatus {
  valid: boolean;
  expired: boolean;
  filename: string;
  size: string;
  createdAt: string;
  expiresAt: string;
  downloads: number;
  maxDownloads: number;
  fileId: string;
}

const LinkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [linkStatus, setLinkStatus] = useState<LinkStatus | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLinkStatus = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        const data = await getLinkInfo(id);
        setLinkStatus(data);
      } catch (error) {
        console.error('Error fetching link info:', error);
        setError('This download link is no longer valid or has expired.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLinkStatus();
  }, [id]);
  
  useEffect(() => {
    if (linkStatus?.valid && !linkStatus?.expired) {
      setCountdown(5);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [linkStatus]);
  
  const handleDownload = async () => {
    if (!linkStatus?.fileId) return;
    
    try {
      // Open the download URL in a new tab
      window.open(getDownloadUrl(linkStatus.fileId), '_blank');
      
      // Update download count locally
      setLinkStatus(prev => {
        if (prev) {
          return {
            ...prev,
            downloads: prev.downloads + 1
          };
        }
        return prev;
      });
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error || !linkStatus || !linkStatus.valid || linkStatus.expired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid or Expired Link</h1>
          <p className="text-gray-600 mb-6">
            {error || "This download link is no longer valid or has expired. Please contact the sender for a new link."}
          </p>
          <a
            href="/"
            className="inline-block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Your File is Ready
          </h1>
          <p className="text-gray-600 text-center mb-6">
            You can download the file using the button below.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">{linkStatus.filename}</h3>
                <p className="text-sm text-gray-500">{linkStatus.size}</p>
              </div>
            </div>
          </div>
          
          {countdown > 0 ? (
            <button
              disabled
              className="w-full px-4 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed flex items-center justify-center"
            >
              <Clock className="mr-2 h-5 w-5" />
              Download available in {countdown}s
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center transition-colors"
            >
              <Download className="mr-2 h-5 w-5" />
              Download File
            </button>
          )}
        </div>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{linkStatus.downloads} of {linkStatus.maxDownloads} downloads</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Expires {new Date(linkStatus.expiresAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkPage;