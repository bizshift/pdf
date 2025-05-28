# PDFMaster

A professional system that converts HTML content to PDF documents with secure storage, download links, and email delivery.

## Project Structure

This project is divided into two main components:

1. **Frontend**: React application for user interface (in the `frontend` directory)
2. **Backend**: Node.js API for PDF conversion and management (in the `backend` directory)

## Features

- HTML to PDF conversion with professional formatting
- Secure file storage with access controls
- Unique, expiring download links
- Email notification system
- Comprehensive document tracking
- Template system for common document types
- Responsive web interface

## Branches

- `main`: Contains the original monolithic application
- `front`: Contains the separated frontend and backend components

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- SMTP server for email functionality

## Development Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## EasyPanel Deployment

This project includes separate EasyPanel configurations for frontend and backend deployments.

### Backend Deployment

1. Use `backend/easypanel.yml` for the API server
2. Configure the required environment variables

### Frontend Deployment

1. Use `frontend/easypanel.yml` for the React application
2. Configure the `VITE_API_URL` to point to your backend API

## API Documentation

See `docs/api-guide.md` for detailed API documentation.

## License

MIT