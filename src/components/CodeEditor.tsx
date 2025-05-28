import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language, 
  height = '300px' 
}) => {
  return (
    <div className="rounded-md border border-gray-300 overflow-hidden\" style={{ height }}>
      <div className="flex items-center justify-between bg-gray-100 border-b border-gray-300 px-4 py-2">
        <span className="text-sm font-medium text-gray-700">{language.toUpperCase()}</span>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="relative h-[calc(100%-40px)]">
        <SyntaxHighlighter
          language={language}
          style={docco}
          customStyle={{
            margin: 0,
            padding: '1rem',
            height: '100%',
            borderRadius: 0,
            fontSize: '14px',
            backgroundColor: '#f8f9fa',
          }}
        >
          {value}
        </SyntaxHighlighter>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full font-mono text-transparent bg-transparent border-none resize-none outline-none p-4 caret-gray-900"
          spellCheck="false"
          style={{ caretColor: '#333' }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;