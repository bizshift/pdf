# PDFMaster

A professional system that converts HTML content to PDF documents with secure storage, download links, and email delivery.

## Project Structure

This project is divided into two main components:

1. **Frontend**: React application for user interface
2. **Backend**: Node.js API for PDF conversion and management

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- SMTP server for email functionality

## Local Development

### Setting up the environment

1. Clone the repository
2. Create `.env` files:
   - Copy `.env.frontend.example` to `.env` in the frontend directory
   - Copy `.env.backend.example` to `.env` in the backend directory

### Running the application

```bash
# For local development with both frontend and backend
npm run dev:all

# For frontend only
npm run dev

# For backend only
npm run server
```

## EasyPanel Deployment

This project uses separate EasyPanel configurations for frontend and backend deployments.

### Backend Deployment

1. Use `backend-easypanel.yml` for the API server
2. Configure the following environment variables:
   - `PORT`: 3000
   - `NODE_ENV`: production
   - `SMTP_HOST`: SMTP server address
   - `SMTP_PORT`: SMTP port
   - `SMTP_USER`: SMTP username
   - `SMTP_PASS`: SMTP password
   - `SMTP_FROM`: Sender email address
   - `BASE_URL`: Backend URL
   - `FRONTEND_URL`: Frontend URL
   - `API_KEY`: API authentication key

### Frontend Deployment

1. Use `frontend-easypanel.yml` for the React application
2. Configure the following environment variables:
   - `VITE_API_URL`: URL of the backend API

## API Endpoints

See `docs/api-guide.md` for detailed API documentation.

## Features

- HTML to PDF conversion with professional formatting
- Secure file storage with access controls
- Unique, expiring download links
- Email notification system
- Comprehensive document tracking
- Template system for common document types
- Responsive web interface

## License

MIT