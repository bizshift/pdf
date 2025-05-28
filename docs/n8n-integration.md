# n8n Integration with PDF Master

This guide explains how to integrate PDF Master with n8n to automate HTML to PDF conversion workflows.

## Prerequisites

Before you begin, make sure you have:

1. A running instance of PDF Master
2. Your PDF Master API key
3. Access to an n8n instance

## Setting Up the HTTP Request Node in n8n

### 1. Add an HTTP Request Node

In your n8n workflow, add a new "HTTP Request" node.

### 2. Configure the HTTP Request

Configure the HTTP Request node with the following settings:

- **Method**: POST
- **URL**: `http://your-pdfmaster-domain.com/api/n8n/convert` (replace with your actual domain)
- **Authentication**: "Header Auth"
- **Header Auth Parameters**:
  - **Name**: Authorization
  - **Value**: Bearer your-api-key-here

### 3. Set up Request Body

Configure the JSON body with the following structure:

```json
{
  "html_content": "{{$node.previous.json.htmlContent}}",
  "output_format": "pdf",
  "return_type": "url",
  "document_name": "document-name.pdf"
}
```

Where:
- `html_content`: The HTML content to convert to PDF (can reference data from previous nodes)
- `output_format`: Currently only "pdf" is supported
- `return_type`: Set to "url" to get only the download URL, or omit for full metadata
- `document_name`: (Optional) Custom filename for the generated PDF

### 4. Response Handling

The API will return a JSON response with the following structure:

```json
{
  "success": true,
  "pdf_url": "http://your-domain.com/api/download/file-id",
  "secure_link_url": "http://your-domain.com/link/link-id",
  "expires_at": "2025-03-29T12:00:00.000Z"
}
```

You can use this response in subsequent nodes of your workflow.

## Example Workflow

Here's an example of a simple workflow:

1. **Trigger Node** (e.g., Webhook)
   - Receives incoming data with HTML content

2. **HTTP Request Node**
   - Configured as described above
   - Sends HTML to PDF Master for conversion

3. **Send Email Node**
   - Uses the returned PDF URL to send an email with the download link

## Security Best Practices

1. **Store API Key Securely**
   - Use n8n credentials or environment variables to store your API key
   - Never hardcode the API key in your workflow

2. **Validate HTML Content**
   - Ensure your HTML content is properly formatted before sending
   - Consider sanitizing HTML if it comes from untrusted sources

3. **Handle Errors**
   - Add error handling to your workflow to catch and handle API errors

## Troubleshooting

If you encounter issues with the integration:

1. Check that your API key is correct and properly formatted in the header
2. Verify that your HTML content is valid and properly escaped in the JSON
3. Ensure your PDF Master server is running and accessible
4. Check the n8n execution logs for detailed error messages

For additional help, contact support or refer to the PDF Master documentation.