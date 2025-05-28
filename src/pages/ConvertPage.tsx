import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FileText, RefreshCw, Send, Download, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import CodeEditor from '../components/CodeEditor';
import EmailModal from '../components/EmailModal';
import { cn } from '../lib/utils';
import PreviewPane from '../components/PreviewPane';
import OptionsPanel from '../components/OptionsPanel';
import TemplateSelector from '../components/TemplateSelector';
import { convertHtmlToPdf, getDownloadUrl, sendEmailWithPdf } from '../api/apiClient';

interface FormData {
  htmlContent: string;
  expirationDays: number;
  emailRecipient: string;
  options: {
    pageSize: string;
    margin: string;
    headerTemplate: string;
    footerTemplate: string;
  }
}

const templates = [
  { id: 'blank', name: 'Blank', description: 'Start from scratch' },
  { id: 'invoice', name: 'Invoice', description: 'Professional invoice template' },
  { id: 'report', name: 'Report', description: 'Business report with sections' },
  { id: 'receipt', name: 'Receipt', description: 'Simple receipt template' },
];

const ConvertPage: React.FC = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFileId, setConvertedFileId] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { handleSubmit, control, watch, setValue } = useForm<FormData>({
    defaultValues: {
      htmlContent: '<div style="font-family: Arial; padding: 20px;">\n  <h1>Sample Invoice</h1>\n  <p>This is a sample invoice template that will be converted to PDF.</p>\n  <table style="width: 100%; border-collapse: collapse;">\n    <tr>\n      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>\n      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>\n      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Amount</th>\n    </tr>\n    <tr>\n      <td style="border: 1px solid #ddd; padding: 8px;">Item 1</td>\n      <td style="border: 1px solid #ddd; padding: 8px;">Description for item 1</td>\n      <td style="border: 1px solid #ddd; padding: 8px;">$100.00</td>\n    </tr>\n    <tr>\n      <td style="border: 1px solid #ddd; padding: 8px;">Item 2</td>\n      <td style="border: 1px solid #ddd; padding: 8px;">Description for item 2</td>\n      <td style="border: 1px solid #ddd; padding: 8px;">$150.00</td>\n    </tr>\n  </table>\n  <div style="margin-top: 20px; text-align: right;">\n    <strong>Total: $250.00</strong>\n  </div>\n</div>',
      expirationDays: 7,
      emailRecipient: '',
      options: {
        pageSize: 'A4',
        margin: '1cm',
        headerTemplate: '',
        footerTemplate: '<div style="text-align: center; width: 100%; font-size: 10px;"><span class="pageNumber"></span> of <span class="totalPages"></span></div>'
      }
    }
  });
  
  const htmlContent = watch('htmlContent');

  const handleConvert = async (data: FormData) => {
    setIsConverting(true);
    
    try {
      const response = await convertHtmlToPdf({
        htmlContent: data.htmlContent,
        options: data.options,
        expirationDays: data.expirationDays
      });
      
      setConvertedFileId(response.fileId);
      setDownloadLink(getDownloadUrl(response.fileId));
      
      toast.success('HTML converted to PDF successfully!');
    } catch (error) {
      toast.error('Failed to convert HTML to PDF.');
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleSendEmail = async (email: string) => {
    if (!convertedFileId) return;
    
    try {
      await sendEmailWithPdf({
        fileId: convertedFileId,
        email
      });
      
      toast.success(`Email sent to ${email} successfully!`);
      setShowEmailModal(false);
    } catch (error) {
      toast.error('Failed to send email.');
      console.error(error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    // In a real application, we would fetch the template content and set it
    // For this demo, we'll just update with some sample content
    if (templateId === 'invoice') {
      setValue('htmlContent', '<div style="font-family: Arial; padding: 20px;">\n  <h1 style="color: #333;">INVOICE</h1>\n  <div style="display: flex; justify-content: space-between;">\n    <div>\n      <p><strong>From:</strong> Your Company Name</p>\n      <p>123 Business Street</p>\n      <p>City, State ZIP</p>\n      <p>Phone: (123) 456-7890</p>\n    </div>\n    <div>\n      <p><strong>To:</strong> Client Name</p>\n      <p>456 Client Address</p>\n      <p>City, State ZIP</p>\n      <p>Phone: (987) 654-3210</p>\n    </div>\n  </div>\n  <div style="margin: 20px 0;">\n    <p><strong>Invoice #:</strong> INV-2025-001</p>\n    <p><strong>Date:</strong> March 15, 2025</p>\n    <p><strong>Due Date:</strong> April 15, 2025</p>\n  </div>\n  <table style="width: 100%; border-collapse: collapse;">\n    <tr style="background-color: #f2f2f2;">\n      <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Item</th>\n      <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Description</th>\n      <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Quantity</th>\n      <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Unit Price</th>\n      <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Amount</th>\n    </tr>\n    <tr>\n      <td style="border: 1px solid #ddd; padding: 12px;">Web Design</td>\n      <td style="border: 1px solid #ddd; padding: 12px;">Website redesign services</td>\n      <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">1</td>\n      <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$1,500.00</td>\n      <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$1,500.00</td>\n    </tr>\n    <tr>\n      <td style="border: 1px solid #ddd; padding: 12px;">Hosting</td>\n      <td style="border: 1px solid #ddd; padding: 12px;">Annual web hosting fee</td>\n      <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">12</td>\n      <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$25.00</td>\n      <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$300.00</td>\n    </tr>\n  </table>\n  <div style="margin-top: 20px; text-align: right;">\n    <p><strong>Subtotal:</strong> $1,800.00</p>\n    <p><strong>Tax (10%):</strong> $180.00</p>\n    <p style="font-size: 18px; font-weight: bold;">Total: $1,980.00</p>\n  </div>\n  <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">\n    <p><strong>Payment Terms:</strong> Net 30</p>\n    <p><strong>Payment Method:</strong> Bank Transfer</p>\n    <p style="margin-top: 20px;"><strong>Notes:</strong> Thank you for your business!</p>\n  </div>\n</div>');
    } else if (templateId === 'report') {
      setValue('htmlContent', '<div style="font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto;">\n  <div style="text-align: center; margin-bottom: 30px;">\n    <h1 style="color: #2c3e50;">Quarterly Business Report</h1>\n    <p style="color: #7f8c8d;">Q1 2025 | Prepared on March 15, 2025</p>\n  </div>\n  \n  <div style="margin-bottom: 30px;">\n    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Executive Summary</h2>\n    <p>This report provides an overview of our company\'s performance during the first quarter of 2025. Overall, we have seen positive growth in revenue and customer acquisition, while maintaining operational costs within budget parameters.</p>\n  </div>\n  \n  <div style="margin-bottom: 30px;">\n    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Financial Highlights</h2>\n    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">\n      <tr style="background-color: #f2f2f2;">\n        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Metric</th>\n        <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Q1 2024</th>\n        <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Q1 2025</th>\n        <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Change</th>\n      </tr>\n      <tr>\n        <td style="border: 1px solid #ddd; padding: 12px;">Revenue</td>\n        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$1,245,000</td>\n        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$1,578,000</td>\n        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: green;">+26.7%</td>\n      </tr>\n      <tr>\n        <td style="border: 1px solid #ddd; padding: 12px;">Operating Expenses</td>\n        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$876,000</td>\n        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$942,000</td>\n        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: red;">+7.5%</td>\n      </tr>\n      <tr>\n        <td style="border: 1px solid #ddd; padding: 12px;">Net Profit</td>\n        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$369,000</td>\n        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$636,000</td>\n        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: green;">+72.4%</td>\n      </tr>\n    </table>\n  </div>\n  \n  <div style="margin-bottom: 30px;">\n    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Customer Metrics</h2>\n    <ul style="line-height: 1.6;">\n      <li><strong>New Customers:</strong> 246 (↑18% from previous quarter)</li>\n      <li><strong>Customer Retention Rate:</strong> 94% (↑2% from previous quarter)</li>\n      <li><strong>Average Revenue Per User:</strong> $1,420 (↑5% from previous quarter)</li>\n      <li><strong>Customer Satisfaction Score:</strong> 4.7/5.0 (unchanged from previous quarter)</li>\n    </ul>\n  </div>\n  \n  <div style="margin-bottom: 30px;">\n    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Key Initiatives</h2>\n    <ol style="line-height: 1.6;">\n      <li><strong>Product Launch:</strong> Successfully launched our new cloud service offering, exceeding first-month sales targets by 15%.</li>\n      <li><strong>Market Expansion:</strong> Entered three new metropolitan markets, acquiring 78 new enterprise customers.</li>\n      <li><strong>Operational Efficiency:</strong> Implemented new automation systems, reducing processing time by 35%.</li>\n    </ol>\n  </div>\n  \n  <div style="margin-bottom: 30px;">\n    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Outlook for Q2 2025</h2>\n    <p>Based on current trends and our strategic initiatives, we forecast continued growth in Q2. We aim to:</p>\n    <ul style="line-height: 1.6;">\n      <li>Increase revenue by 8-10% compared to Q1</li>\n      <li>Launch two additional product features</li>\n      <li>Expand our team with 15 new hires across engineering and sales</li>\n      <li>Maintain operating expenses below 65% of revenue</li>\n    </ul>\n  </div>\n  \n  <div style="margin-top: 40px; text-align: center; color: #7f8c8d; font-size: 12px;">\n    <p>Confidential Document | For Internal Use Only</p>\n    <p>© 2025 Company Name. All rights reserved.</p>\n  </div>\n</div>');
    } else if (templateId === 'receipt') {
      setValue('htmlContent', '<div style="font-family: Arial; padding: 20px; max-width: 400px; margin: 0 auto; border: 1px solid #ddd;">\n  <div style="text-align: center; margin-bottom: 20px;">\n    <h2 style="margin-bottom: 5px;">RECEIPT</h2>\n    <p style="color: #777; font-size: 14px;">Thank you for your purchase</p>\n  </div>\n  \n  <div style="margin-bottom: 20px; display: flex; justify-content: space-between; font-size: 14px;">\n    <div>\n      <p><strong>Receipt #:</strong> RCT-10584</p>\n      <p><strong>Date:</strong> March 15, 2025</p>\n      <p><strong>Payment Method:</strong> Credit Card</p>\n    </div>\n    <div style="text-align: right;">\n      <p><strong>Store:</strong> Main Street Shop</p>\n      <p>123 Main Street</p>\n      <p>Anytown, ST 12345</p>\n    </div>\n  </div>\n  \n  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">\n    <tr style="border-bottom: 1px solid #ddd; border-top: 1px solid #ddd;">\n      <th style="padding: 10px 5px; text-align: left;">Item</th>\n      <th style="padding: 10px 5px; text-align: center;">Qty</th>\n      <th style="padding: 10px 5px; text-align: right;">Price</th>\n      <th style="padding: 10px 5px; text-align: right;">Total</th>\n    </tr>\n    <tr style="border-bottom: 1px solid #eee;">\n      <td style="padding: 10px 5px;">Widget Pro</td>\n      <td style="padding: 10px 5px; text-align: center;">1</td>\n      <td style="padding: 10px 5px; text-align: right;">$29.99</td>\n      <td style="padding: 10px 5px; text-align: right;">$29.99</td>\n    </tr>\n    <tr style="border-bottom: 1px solid #eee;">\n      <td style="padding: 10px 5px;">Premium Accessory</td>\n      <td style="padding: 10px 5px; text-align: center;">2</td>\n      <td style="padding: 10px 5px; text-align: right;">$12.50</td>\n      <td style="padding: 10px 5px; text-align: right;">$25.00</td>\n    </tr>\n    <tr style="border-bottom: 1px solid #eee;">\n      <td style="padding: 10px 5px;">Extended Warranty</td>\n      <td style="padding: 10px 5px; text-align: center;">1</td>\n      <td style="padding: 10px 5px; text-align: right;">$9.99</td>\n      <td style="padding: 10px 5px; text-align: right;">$9.99</td>\n    </tr>\n  </table>\n  \n  <div style="margin-top: 20px; text-align: right; font-size: 14px;">\n    <p><strong>Subtotal:</strong> $64.98</p>\n    <p><strong>Tax (8%):</strong> $5.20</p>\n    <p style="font-size: 16px; font-weight: bold;">Total: $70.18</p>\n  </div>\n  \n  <div style="margin-top: 30px; text-align: center; border-top: 1px dotted #ddd; padding-top: 20px;">\n    <p style="font-size: 14px;">Thank you for shopping with us!</p>\n    <p style="font-size: 12px; color: #777; margin-top: 10px;">For returns and exchanges, please present this receipt within 30 days of purchase.</p>\n  </div>\n</div>');
    } else {
      // Blank template
      setValue('htmlContent', '<div style="font-family: Arial; padding: 20px;">\n  <h1>Your Content Here</h1>\n  <p>Start typing your HTML content...</p>\n</div>');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Convert HTML to PDF</h1>
          <p className="text-gray-600">Create and customize your PDF documents</p>
        </div>
        <div className="mt-4 lg:mt-0 flex space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
          >
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            <button
              className="px-6 py-4 text-blue-600 border-b-2 border-blue-600 font-medium text-sm"
              aria-current="page"
            >
              Editor
            </button>
            <button
              className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium text-sm"
            >
              Templates
            </button>
            <button
              className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium text-sm"
            >
              Import
            </button>
          </nav>
        </div>

        {!previewMode && (
          <div className="p-6">
            <TemplateSelector 
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelect={handleTemplateSelect}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(handleConvert)}>
          <div className="flex flex-col lg:flex-row">
            <div className={cn(
              "lg:border-r border-gray-200 transition-all",
              previewMode ? "w-0 overflow-hidden" : "w-full lg:w-1/2"
            )}>
              {!previewMode && (
                <div className="p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HTML Content
                  </label>
                  <Controller
                    name="htmlContent"
                    control={control}
                    render={({ field }) => (
                      <CodeEditor
                        value={field.value}
                        onChange={field.onChange}
                        language="html"
                        height="400px"
                      />
                    )}
                  />
                </div>
              )}
            </div>
            
            <div className={cn(
              "transition-all",
              previewMode ? "w-full" : "w-full lg:w-1/2"
            )}>
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                <div className="border border-gray-200 rounded-lg bg-gray-50 h-[400px] overflow-auto">
                  <PreviewPane htmlContent={htmlContent} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 lg:pr-6 mb-6 lg:mb-0">
                <OptionsPanel control={control} />
              </div>
              
              <div className="w-full lg:w-1/2 lg:pl-6 lg:border-l border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Sharing Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Expiration
                    </label>
                    <Controller
                      name="expirationDays"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        >
                          <option value={1}>1 day</option>
                          <option value={3}>3 days</option>
                          <option value={7}>7 days</option>
                          <option value={14}>14 days</option>
                          <option value={30}>30 days</option>
                        </select>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-6 flex justify-end space-x-4">
            {!convertedFileId ? (
              <button
                type="submit"
                disabled={isConverting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Convert to PDF
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (downloadLink) {
                      window.open(downloadLink, '_blank');
                      toast.success('Downloading PDF...');
                    }
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/link/' + convertedFileId);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center transition-colors"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Copy Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center transition-colors"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Email PDF
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          onSend={handleSendEmail}
        />
      )}
    </div>
  );
};

export default ConvertPage;