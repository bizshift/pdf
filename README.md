# HTML to PDF Conversion System

A professional system that converts HTML content to PDF documents with secure storage, download links, and email delivery.

## Features

- HTML to PDF conversion with professional formatting
- Secure file storage with access controls
- Unique, expiring download links
- Email notification system
- Comprehensive document tracking
- Template system for common document types
- Responsive web interface

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **PDF Generation**: Puppeteer
- **Email**: Nodemailer
- **Security**: UUID for secure links, rate limiting

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
PORT=3000
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@example.com
BASE_URL=http://localhost:3000
```

### Running the Application

Start both the frontend and backend with:

```bash
npm run dev:all
```

## Usage

1. Navigate to the Convert page
2. Enter or paste your HTML content
3. Customize PDF options as needed
4. Click "Convert to PDF"
5. Download the generated PDF or share via secure link/email

## Security Features

- Time-limited download links
- Rate limiting for API endpoints
- Download tracking
- Access controls for file retrieval
- Secure email delivery

## License

MIT