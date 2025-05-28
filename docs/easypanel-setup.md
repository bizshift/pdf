# Setting up PDFMaster on EasyPanel

This guide will walk you through the process of deploying PDFMaster to EasyPanel.

## Prerequisites

1. A server with EasyPanel installed and configured
2. Docker installed on your server
3. Basic knowledge of Docker and containerization

## Deployment Steps

### 1. Create a Project in EasyPanel

1. Log in to your EasyPanel dashboard
2. Click on "Create Service"
3. Select "Docker Image" as the service type

### 2. Configure the Service

Use the following settings:

- **Name**: pdfmaster
- **Image**: Your Docker image name (if using GitHub Container Registry or Docker Hub)
- **Port**: 3000
- **Environment Variables**:
  - `PORT`: 3000
  - `NODE_ENV`: production
  - `SMTP_HOST`: Your SMTP server
  - `SMTP_PORT`: Your SMTP port (usually 587)
  - `SMTP_USER`: Your SMTP username
  - `SMTP_PASS`: Your SMTP password
  - `SMTP_FROM`: The email address to send from
  - `BASE_URL`: The public URL of your service (e.g., https://pdfmaster.yourdomain.com)
  - `API_KEY`: A secure random string for API authentication

### 3. Configure Volumes

Add a persistent volume:

- **Host Path**: (Create a new volume in EasyPanel)
- **Container Path**: /app/storage

### 4. Set Up Domain

Configure your domain settings:

- Add your domain (e.g., pdfmaster.yourdomain.com)
- Enable HTTPS (recommended)

### 5. Deploy

Click "Deploy" to start your service.

## Building and Pushing the Docker Image

If you need to build and push the image manually:

```bash
# Build the Docker image
docker build -t yourusername/pdfmaster:latest .

# Push to Docker Hub
docker push yourusername/pdfmaster:latest
```

## Using the EasyPanel YML Definition

Alternatively, you can use the `easypanel.yml` file to define your service:

1. Go to "Add Service" in EasyPanel
2. Select "Custom YAML"
3. Paste the contents of the `easypanel.yml` file
4. Configure the required environment variables
5. Click "Create Service"

## Troubleshooting

If you encounter issues:

1. Check the container logs in EasyPanel
2. Verify all environment variables are set correctly
3. Ensure your SMTP settings are correct
4. Check if the persistent volume is properly mounted
5. Verify that Puppeteer can run in the container environment

## Upgrading

To upgrade to a new version:

1. Build and push a new version of your Docker image
2. In EasyPanel, go to your service
3. Click "Rebuild" or update the image tag and click "Deploy"