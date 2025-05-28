import React, { useState } from 'react';
import { FileText, Download, Trash2, Share2, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  created: Date;
  size: string;
  downloads: number;
  expires: Date | null;
}

const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  
  const documents: Document[] = [
    { 
      id: 'doc1', 
      name: 'Invoice-2025-001.pdf', 
      created: new Date(2025, 2, 15), 
      size: '256 KB',
      downloads: 5,
      expires: new Date(2025, 3, 15)
    },
    { 
      id: 'doc2', 
      name: 'Contract-Johnson.pdf', 
      created: new Date(2025, 2, 10), 
      size: '1.2 MB',
      downloads: 2,
      expires: new Date(2025, 3, 10)
    },
    { 
      id: 'doc3', 
      name: 'Report-Q1-2025.pdf', 
      created: new Date(2025, 2, 5), 
      size: '3.4 MB',
      downloads: 8,
      expires: null
    },
    { 
      id: 'doc4', 
      name: 'Invoice-2025-002.pdf', 
      created: new Date(2025, 2, 1), 
      size: '245 KB',
      downloads: 3,
      expires: new Date(2025, 3, 1)
    },
    { 
      id: 'doc5', 
      name: 'Project-Proposal.pdf', 
      created: new Date(2025, 1, 25), 
      size: '1.7 MB',
      downloads: 12,
      expires: null
    },
    { 
      id: 'doc6', 
      name: 'Marketing-Plan-2025.pdf', 
      created: new Date(2025, 1, 20), 
      size: '4.2 MB',
      downloads: 7,
      expires: new Date(2025, 2, 20)
    },
    { 
      id: 'doc7', 
      name: 'Business-Cards-Design.pdf', 
      created: new Date(2025, 1, 15), 
      size: '512 KB',
      downloads: 1,
      expires: new Date(2025, 2, 15)
    },
  ];

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDocumentSelection = (id: string) => {
    setSelectedDocuments(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id)
        : [...prev, id]
    );
  };

  const selectAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleDelete = () => {
    // In a real application, we would delete the selected documents
    // For this demo, we'll just clear the selection
    setSelectedDocuments([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
          <p className="text-gray-600">Manage your PDF documents</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              {selectedDocuments.length > 0 && (
                <>
                  <button 
                    onClick={handleDelete}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-gray-500" />
                    Delete
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
                    <Share2 className="mr-2 h-4 w-4 text-gray-500" />
                    Share
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                      onChange={selectAllDocuments}
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">No documents found</p>
                    <p className="text-sm">Try adjusting your search or create a new document.</p>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => toggleDocumentSelection(doc.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(doc.created, 'PPP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.downloads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.expires ? format(doc.expires, 'PPP') : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredDocuments.length}</span> of{' '}
              <span className="font-medium">{documents.length}</span> documents
            </p>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;