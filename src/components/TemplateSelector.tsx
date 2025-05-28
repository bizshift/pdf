import React from 'react';
import { cn } from '../lib/utils';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: string | null;
  onSelect: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  templates, 
  selectedTemplate, 
  onSelect 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Choose a Template</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
              selectedTemplate === template.id 
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" 
                : "border-gray-200 hover:border-blue-300"
            )}
            onClick={() => onSelect(template.id)}
          >
            <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">
              {template.id === 'blank' && (
                <span className="text-xl">+</span>
              )}
              {template.id === 'invoice' && (
                <div className="w-16 h-20 border border-gray-300 flex flex-col p-1">
                  <div className="h-3 w-full bg-gray-300 mb-1"></div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <div className="h-1 w-full bg-gray-200"></div>
                    <div className="h-1 w-full bg-gray-200"></div>
                    <div className="h-1 w-full bg-gray-200"></div>
                  </div>
                </div>
              )}
              {template.id === 'report' && (
                <div className="w-16 h-20 border border-gray-300 flex flex-col p-1">
                  <div className="h-3 w-full bg-gray-300 mb-1"></div>
                  <div className="h-2 w-3/4 bg-gray-200 mb-1"></div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <div className="h-1 w-full bg-gray-200"></div>
                    <div className="h-1 w-full bg-gray-200"></div>
                  </div>
                </div>
              )}
              {template.id === 'receipt' && (
                <div className="w-12 h-20 border border-gray-300 flex flex-col p-1">
                  <div className="h-2 w-full bg-gray-300 mb-1"></div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <div className="h-1 w-full bg-gray-200"></div>
                    <div className="h-1 w-full bg-gray-200"></div>
                    <div className="h-1 w-3/4 bg-gray-200"></div>
                  </div>
                </div>
              )}
            </div>
            <h4 className="font-medium text-gray-900">{template.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;