# PDFMaster API Guide

This guide documents the PDFMaster API endpoints and how to use them in your applications.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `/api` (relative to your deployed domain)
- **Netlify**: `/.netlify/functions/api`

## Authentication

Some endpoints may require authentication using an API key:

```
Authorization: Bearer your-api-key-here
```

The API key should be set in your environment variables as `API_KEY`.

## Endpoints

### Convert HTML to PDF

Convert HTML content to a PDF document.

- **URL**: `/convert`
- **Method**: `POST`
- **Authentication**: Optional

**Request Body**:

```json
{
  "htmlContent": "<html><body><h1>Hello World</h1></body></html>",
  "options": {
    "pageSize": "A4",
    "margin": "1cm",
    "headerTemplate": "<div style='text-align: center; width: 100%;'>Header</div>",
    "footerTemplate": "<div style='text-align: center; width: 100%;'><span class='pageNumber'></span> of <span class='totalPages'></span></div>"
  },
  "expirationDays": 7
}
```

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| htmlContent | string | Yes | The HTML content to convert to PDF |
| options | object | No | PDF configuration options |
| options.pageSize | string | No | Page size (A4, Letter, etc.) |
| options.margin | string | No | Page margins (1cm, 0.5in, etc.) |
| options.headerTemplate | string | No | HTML for the header |
| options.footerTemplate | string | No | HTML for the footer |
| expirationDays | number | No | Number of days until the link expires |

**Response**:

```json
{
  "success": true,
  "fileId": "7f8d4e2a-1c3b-5a9d-8f7e-6b5c4d3a2e1f",
  "downloadLink": "/api/download/7f8d4e2a-1c3b-5a9d-8f7e-6b5c4d3a2e1f",
  "linkId": "6e5d4c3b-2a1e-9f8d-7c6b-5a4e3d2c1f0e",
  "linkUrl": "/link/6e5d4c3b-2a1e-9f8d-7c6b-5a4e3d2c1f0e",
  "expiresAt": "2025-03-29T12:00:00.000Z"
}
```

### Download PDF

Download a generated PDF file.

- **URL**: `/download/:fileId`
- **Method**: `GET`
- **Authentication**: None

**URL Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| fileId | string | Yes | The ID of the PDF file to download |

**Response**:

Binary PDF file with appropriate headers for downloading.

### Get Link Information

Get information about a shared download link.

- **URL**: `/links/:linkId`
- **Method**: `GET`
- **Authentication**: None

**URL Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| linkId | string | Yes | The ID of the link to retrieve information for |

**Response**:

```json
{
  "valid": true,
  "expired": false,
  "fileId": "7f8d4e2a-1c3b-5a9d-8f7e-6b5c4d3a2e1f",
  "filename": "7f8d4e2a-1c3b-5a9d-8f7e-6b5c4d3a2e1f.pdf",
  "size": "256 KB",
  "createdAt": "2025-03-15T12:00:00.000Z",
  "expiresAt": "2025-03-22T12:00:00.000Z",
  "downloads": 2,
  "maxDownloads": 10
}
```

### Send Email with PDF

Send an email with a PDF download link.

- **URL**: `/send-email`
- **Method**: `POST`
- **Authentication**: Optional

**Request Body**:

```json
{
  "fileId": "7f8d4e2a-1c3b-5a9d-8f7e-6b5c4d3a2e1f",
  "email": "recipient@example.com",
  "message": "Here is the PDF document you requested."
}
```

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| fileId | string | Yes | The ID of the PDF file to share |
| email | string | Yes | The recipient's email address |
| message | string | No | Optional message to include in the email |

**Response**:

```json
{
  "success": true,
  "message": "Email sent successfully",
  "linkId": "6e5d4c3b-2a1e-9f8d-7c6b-5a4e3d2c1f0e",
  "linkUrl": "/link/6e5d4c3b-2a1e-9f8d-7c6b-5a4e3d2c1f0e"
}
```

### n8n Integration API

Special endpoint for n8n workflow automation integration.

- **URL**: `/n8n/convert`
- **Method**: `POST`
- **Authentication**: Required

**Request Body**:

```json
{
  "html_content": "<html><body><h1>Hello from n8n</h1></body></html>",
  "document_name": "n8n-document.pdf",
  "return_type": "url"
}
```

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| html_content | string | Yes | The HTML content to convert to PDF |
| document_name | string | No | Custom filename for the generated PDF |
| return_type | string | No | If set to "url", only returns the download URL |

**Response** (with `return_type=url`):

```json
{
  "pdf_url": "http://your-domain.com/api/download/7f8d4e2a-1c3b-5a9d-8f7e-6b5c4d3a2e1f"
}
```

**Response** (default):

```json
{
  "success": true,
  "pdf_url": "http://your-domain.com/api/download/7f8d4e2a-1c3b-5a9d-8f7e-6b5c4d3a2e1f",
  "secure_link_url": "http://your-domain.com/link/6e5d4c3b-2a1e-9f8d-7c6b-5a4e3d2c1f0e",
  "expires_at": "2025-03-22T12:00:00.000Z",
  "filename": "n8n-document.pdf"
}
```

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `404 Not Found`: Resource not found
- `410 Gone`: Resource expired or no longer available
- `500 Internal Server Error`: Server-side error

Error responses have the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Client-Side Integration

### JavaScript Example

```javascript
// Using the fetch API
async function convertHtmlToPdf(html) {
  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        htmlContent: html,
        options: {
          pageSize: 'A4',
          margin: '1cm'
        },
        expirationDays: 7
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to convert HTML to PDF');
    }
    
    return data;
  } catch (error) {
    console.error('Error converting HTML to PDF:', error);
    throw error;
  }
}
```

### React Example (using apiClient.ts)

```typescript
import { convertHtmlToPdf, getDownloadUrl, sendEmailWithPdf } from '../api/apiClient';

// Convert HTML to PDF
const handleConvert = async () => {
  try {
    const response = await convertHtmlToPdf({
      htmlContent: '<html><body><h1>Hello World</h1></body></html>',
      options: {
        pageSize: 'A4',
        margin: '1cm'
      },
      expirationDays: 7
    });
    
    console.log('PDF generated:', response.fileId);
    
    // Get download URL
    const downloadUrl = getDownloadUrl(response.fileId);
    
    // Send email with PDF
    await sendEmailWithPdf({
      fileId: response.fileId,
      email: 'recipient@example.com',
      message: 'Here is your PDF document'
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Integration with External Services

### cURL Examples

**Convert HTML to PDF**:

```bash
curl -X POST https://your-domain.com/api/convert \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "htmlContent": "<html><body><h1>Hello World</h1></body></html>",
    "options": {
      "pageSize": "A4",
      "margin": "1cm"
    },
    "expirationDays": 7
  }'
```

**Download PDF**:

```bash
curl -X GET https://your-domain.com/api/download/7f8d4e2a-1c3b-5a9d-8f7e-6b5c4d3a2e1f \
  -o document.pdf
```

### n8n Integration

See the separate [n8n Integration Guide](n8n-integration.md) for detailed instructions on setting up workflow automation with n8n.

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per IP address per 15-minute window
- When the limit is exceeded, the API will return a `429 Too Many Requests` status code

## Security Recommendations

1. **API Key Protection**:
   - Store your API key securely
   - Rotate keys periodically
   - Use different keys for different environments

2. **HTTPS**:
   - Always use HTTPS in production to encrypt API traffic
   - Ensure certificates are valid and up-to-date

3. **Input Validation**:
   - Sanitize HTML content before sending to the API
   - Validate all parameters client-side to improve user experience

4. **Error Handling**:
   - Implement proper error handling in your application
   - Log errors for debugging but don't expose sensitive information

## Resources

For more information:

- [n8n Integration Guide](n8n-integration.md)
- [EasyPanel Setup Guide](easypanel-setup.md)
- [Docker Deployment](../Dockerfile)