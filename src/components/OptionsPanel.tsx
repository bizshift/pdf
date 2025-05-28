import React from 'react';
import { Control, Controller } from 'react-hook-form';

interface OptionsPanelProps {
  control: Control<any>;
}

const pageSizes = [
  { value: 'A4', label: 'A4 (210 × 297 mm)' },
  { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
  { value: 'Legal', label: 'Legal (8.5 × 14 in)' },
  { value: 'Tabloid', label: 'Tabloid (11 × 17 in)' },
];

const margins = [
  { value: '0.5cm', label: 'Narrow (0.5 cm)' },
  { value: '1cm', label: 'Normal (1 cm)' },
  { value: '2cm', label: 'Wide (2 cm)' },
  { value: '3cm', label: 'Extra Wide (3 cm)' },
];

const OptionsPanel: React.FC<OptionsPanelProps> = ({ control }) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-4">PDF Options</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Size
          </label>
          <Controller
            name="options.pageSize"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                {pageSizes.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Margin
          </label>
          <Controller
            name="options.margin"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                {margins.map(margin => (
                  <option key={margin.value} value={margin.value}>
                    {margin.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Header Template (HTML)
          </label>
          <Controller
            name="options.headerTemplate"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="<div style='text-align: center; width: 100%; font-size: 10px;'>Header content</div>"
                rows={2}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            )}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Footer Template (HTML)
          </label>
          <Controller
            name="options.footerTemplate"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="<div style='text-align: center; width: 100%; font-size: 10px;'><span class='pageNumber'></span> of <span class='totalPages'></span></div>"
                rows={2}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default OptionsPanel;