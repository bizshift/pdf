# API Client Usage Guide

The PDFMaster application includes a client-side API wrapper that simplifies communication with the backend API. This guide explains how to use the API client in your frontend code.

## Setup

The API client is implemented in `src/api/apiClient.ts` and uses Axios for HTTP requests. It automatically determines the base URL based on the environment:

```typescript
const baseURL = import.meta.env.DEV 
  ? 'http://localhost:3000/api' 
  : '/.netlify/functions/api';
```

This means you don't need to worry about different URLs for development and production environments.

## Available Functions

### Convert HTML to PDF

Convert HTML content to a PDF document.

```typescript
import { convertHtmlToPdf } from '../api/apiClient';

const handleConvert = async () => {
  try {
    const result = await convertHtmlToPdf({
      htmlContent: '<div>Your HTML content here</div>',
      options: {
        pageSize: 'A4',
        margin: '1cm',
        headerTemplate: '<div>Header</div>',
        footerTemplate: '<div>Footer</div>'
      },
      expirationDays: 7
    });
    
    console.log('Conversion successful:', result);
    // result contains: fileId, downloadLink, linkId, linkUrl, expiresAt
  } catch (error) {
    console.error('Conversion failed:', error);
  }
};
```

### Get Download URL

Generate a download URL for a PDF file.

```typescript
import { getDownloadUrl } from '../api/apiClient';

// Usage in a component
const downloadLink = getDownloadUrl(fileId);

// Example with a button
<button onClick={() => window.open(getDownloadUrl(fileId), '_blank')}>
  Download PDF
</button>
```

### Get Link Information

Retrieve information about a shared link.

```typescript
import { getLinkInfo } from '../api/apiClient';

const fetchLinkInfo = async (linkId) => {
  try {
    const linkInfo = await getLinkInfo(linkId);
    
    console.log('Link information:', linkInfo);
    // linkInfo contains: valid, expired, fileId, filename, size, etc.
    
    if (linkInfo.valid && !linkInfo.expired) {
      // Link is valid and not expired
    } else {
      // Link is invalid or expired
    }
  } catch (error) {
    console.error('Failed to get link info:', error);
  }
};
```

### Send Email with PDF

Send an email with a PDF download link.

```typescript
import { sendEmailWithPdf } from '../api/apiClient';

const handleSendEmail = async () => {
  try {
    await sendEmailWithPdf({
      fileId: 'your-file-id',
      email: 'recipient@example.com',
      message: 'Here is the PDF document you requested.'
    });
    
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
```

## Integration Examples

### Using with React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { convertHtmlToPdf } from '../api/apiClient';

function ConversionForm() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const response = await convertHtmlToPdf({
        htmlContent: data.htmlContent,
        options: {
          pageSize: data.pageSize,
          margin: data.margin
        },
        expirationDays: data.expirationDays
      });
      
      setResult(response);
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Converting...' : 'Convert to PDF'}
      </button>
      
      {result && (
        <div>
          <a href={result.downloadLink} target="_blank" rel="noopener noreferrer">
            Download PDF
          </a>
        </div>
      )}
    </form>
  );
}
```

### Using with async/await in React Components

```typescript
import { useState, useEffect } from 'react';
import { getLinkInfo, getDownloadUrl } from '../api/apiClient';

function LinkPage() {
  const [linkId, setLinkId] = useState('your-link-id');
  const [linkInfo, setLinkInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const data = await getLinkInfo(linkId);
        setLinkInfo(data);
      } catch (err) {
        setError('Failed to load link information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [linkId]);
  
  const handleDownload = () => {
    if (linkInfo?.fileId) {
      window.open(getDownloadUrl(linkInfo.fileId), '_blank');
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!linkInfo?.valid) return <div>Invalid link</div>;
  if (linkInfo?.expired) return <div>Link has expired</div>;
  
  return (
    <div>
      <h1>Your PDF is ready</h1>
      <p>Filename: {linkInfo.filename}</p>
      <p>Size: {linkInfo.size}</p>
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
}
```

## Error Handling

The API client will throw errors that you should catch and handle appropriately in your application:

```typescript
try {
  const result = await convertHtmlToPdf({
    htmlContent: '<div>Test</div>'
  });
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle axios-specific errors
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.error || error.message;
    
    switch (statusCode) {
      case 400:
        console.error('Invalid request:', errorMessage);
        break;
      case 401:
        console.error('Authentication required');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 500:
        console.error('Server error:', errorMessage);
        break;
      default:
        console.error('Unknown error:', errorMessage);
    }
  } else {
    // Handle other errors
    console.error('Error:', error.message);
  }
}
```

## Best Practices

1. **Loading States**: Always include loading states to improve user experience
2. **Error Handling**: Implement comprehensive error handling for all API calls
3. **Timeouts**: Consider setting timeouts for API calls that might take longer (like PDF conversion)
4. **Validation**: Validate inputs before sending to the API
5. **Caching**: Consider implementing caching for frequently accessed resources
6. **Rate Limiting**: Be aware of the API's rate limits and implement retry logic if necessary

## Advanced Usage

### Custom Headers

If you need to add custom headers to your requests:

```typescript
import apiClient from '../api/apiClient';

// Add custom headers to all requests
apiClient.defaults.headers.common['Custom-Header'] = 'value';

// Add headers to a specific request
const response = await apiClient.post('/endpoint', data, {
  headers: {
    'Special-Header': 'value'
  }
});
```

### Request Interceptors

You can add interceptors to modify requests before they are sent:

```typescript
import apiClient from '../api/apiClient';

// Add a request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add a timestamp to the request
    config.params = {
      ...config.params,
      timestamp: Date.now()
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
```

### Response Interceptors

You can also add interceptors to process responses:

```typescript
import apiClient from '../api/apiClient';

// Add a response interceptor
apiClient.interceptors.response.use(
  response => {
    // Process successful responses
    return response;
  },
  error => {
    // Handle error responses
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error
      console.log('Unauthorized request, redirecting to login');
      // Redirect to login or show authentication modal
    }
    return Promise.reject(error);
  }
);
```