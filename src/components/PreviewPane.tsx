import React from 'react';

interface PreviewPaneProps {
  htmlContent: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ htmlContent }) => {
  // Create a sanitized version of the HTML content
  // In a real app, you would use a library like DOMPurify to sanitize HTML
  
  return (
    <div className="w-full h-full p-6 bg-white shadow-inner">
      <iframe
        title="PDF Preview"
        srcDoc={htmlContent}
        className="w-full h-full border-0"
        sandbox="allow-same-origin"
      />
    </div>
  );
};

export default PreviewPane;