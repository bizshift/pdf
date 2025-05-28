import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create storage directories if they don't exist
const storagePath = path.join(__dirname, '..', 'storage');
const pdfPath = path.join(storagePath, 'pdfs');
const uploadPath = path.join(storagePath, 'uploads');

if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath);
}

if (!fs.existsSync(pdfPath)) {
  fs.mkdirSync(pdfPath);
}

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', process.env.FRONTEND_URL];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// In-memory storage for links (in a real app, use a database)
const links = {};

// Helper function to generate secure download links
const generateDownloadLink = (fileId, expirationDays = 7) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);
  
  const linkId = uuidv4();
  
  links[linkId] = {
    fileId,
    expirationDate,
    downloads: 0,
    maxDownloads: 10,
  };
  
  return {
    linkId,
    url: `/link/${linkId}`,
    expiresAt: expirationDate.toISOString(),
  };
};

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'password',
  },
});

// Routes
app.post('/api/convert', async (req, res) => {
  try {
    const { htmlContent, options, expirationDays } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ error: 'HTML content is required' });
    }
    
    // Generate unique file ID
    const fileId = uuidv4();
    const outputPath = path.join(pdfPath, `${fileId}.pdf`);
    
    // Launch browser and create PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Apply PDF options
    const pdfOptions = {
      path: outputPath,
      format: options?.pageSize || 'A4',
      margin: {
        top: options?.margin || '1cm',
        right: options?.margin || '1cm',
        bottom: options?.margin || '1cm',
        left: options?.margin || '1cm',
      },
      printBackground: true,
      displayHeaderFooter: !!(options?.headerTemplate || options?.footerTemplate),
      headerTemplate: options?.headerTemplate || '',
      footerTemplate: options?.footerTemplate || '',
    };
    
    await page.pdf(pdfOptions);
    await browser.close();
    
    // Generate download link
    const link = generateDownloadLink(fileId, expirationDays || 7);
    
    // Base URL for download and link URLs
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    
    // Log the conversion
    console.log(`PDF generated: ${fileId}.pdf`);
    
    res.status(200).json({
      success: true,
      fileId,
      downloadLink: `${baseUrl}/api/download/${fileId}`,
      linkId: link.linkId,
      linkUrl: `${baseUrl}/link/${link.linkId}`,
      expiresAt: link.expiresAt,
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to convert HTML to PDF' });
  }
});

app.get('/api/download/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(pdfPath, `${fileId}.pdf`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Log download
    console.log(`File downloaded: ${fileId}.pdf`);
    
    // Send file
    res.download(filePath);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

app.get('/api/links/:linkId', (req, res) => {
  try {
    const { linkId } = req.params;
    const link = links[linkId];
    
    if (!link) {
      return res.status(404).json({ 
        valid: false,
        error: 'Link not found' 
      });
    }
    
    const now = new Date();
    const expired = now > new Date(link.expirationDate);
    const maxDownloadsReached = link.downloads >= link.maxDownloads;
    
    if (expired || maxDownloadsReached) {
      return res.status(410).json({
        valid: true,
        expired: true,
        error: expired ? 'Link expired' : 'Maximum downloads reached',
      });
    }
    
    // Get file info
    const filePath = path.join(pdfPath, `${link.fileId}.pdf`);
    const stats = fs.statSync(filePath);
    
    res.status(200).json({
      valid: true,
      expired: false,
      fileId: link.fileId,
      filename: `${link.fileId}.pdf`,
      size: `${Math.round(stats.size / 1024)} KB`,
      createdAt: stats.birthtime.toISOString(),
      expiresAt: link.expirationDate.toISOString(),
      downloads: link.downloads,
      maxDownloads: link.maxDownloads,
    });
  } catch (error) {
    console.error('Link info error:', error);
    res.status(500).json({ error: 'Failed to get link information' });
  }
});

app.post('/api/send-email', (req, res) => {
  try {
    const { fileId, email, message } = req.body;
    
    if (!fileId || !email) {
      return res.status(400).json({ error: 'File ID and email are required' });
    }
    
    const filePath = path.join(pdfPath, `${fileId}.pdf`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Generate download link
    const link = generateDownloadLink(fileId, 7);
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    
    // Send email
    const mailOptions = {
      from: `"PDF Service" <${process.env.SMTP_FROM || 'noreply@example.com'}>`,
      to: email,
      subject: 'Your PDF Document',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1E40AF;">Your PDF Document is Ready</h2>
          <p>You can download your document using the link below:</p>
          <p><a href="${baseUrl}${link.url}" style="display: inline-block; background-color: #1E40AF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Download Document</a></p>
          <p style="margin-top: 20px;">This link will expire in 7 days.</p>
          ${message ? `<p style="margin-top: 20px; padding: 10px; background-color: #f3f4f6; border-left: 4px solid #d1d5db;">Message: ${message}</p>` : ''}
          <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };
    
    // For demo purposes, just log the email
    console.log('Email would be sent with:', mailOptions);
    
    // In a real app, you would uncomment this:
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      emailTransporter.sendMail(mailOptions);
    }
    
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      linkId: link.linkId,
      linkUrl: `${baseUrl}${link.url}`,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// n8n integration endpoint
app.post('/api/n8n/convert', async (req, res) => {
  try {
    // Check API key (if provided in headers)
    const authHeader = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    
    if (apiKey && (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== apiKey)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { html_content, document_name, return_type } = req.body;
    
    if (!html_content) {
      return res.status(400).json({ error: 'HTML content is required' });
    }
    
    // Generate unique file ID
    const fileId = uuidv4();
    const filename = document_name || `${fileId}.pdf`;
    const outputPath = path.join(pdfPath, `${fileId}.pdf`);
    
    // Launch browser and create PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });
    
    const page = await browser.newPage();
    await page.setContent(html_content, { waitUntil: 'networkidle0' });
    
    // Apply PDF options
    const pdfOptions = {
      path: outputPath,
      format: 'A4',
      printBackground: true,
    };
    
    await page.pdf(pdfOptions);
    await browser.close();
    
    // Generate download link
    const link = generateDownloadLink(fileId, 7);
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    
    // Log the conversion
    console.log(`PDF generated via n8n: ${fileId}.pdf`);
    
    // If return_type is "url", only return the URL
    if (return_type === 'url') {
      return res.status(200).json({
        pdf_url: `${baseUrl}/api/download/${fileId}`,
      });
    }
    
    // Otherwise return full metadata
    res.status(200).json({
      success: true,
      pdf_url: `${baseUrl}/api/download/${fileId}`,
      secure_link_url: `${baseUrl}/link/${link.linkId}`,
      expires_at: link.expiresAt,
      filename: filename,
    });
  } catch (error) {
    console.error('n8n PDF generation error:', error);
    res.status(500).json({ error: 'Failed to convert HTML to PDF' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;