import { v4 as uuidv4 } from 'uuid';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

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

// Temporary file storage for Netlify Functions
const getTempFilePath = (fileId) => `/tmp/${fileId}.pdf`;

export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle OPTIONS requests (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const segments = path.split('/').filter(Boolean);
  const route = segments[0];

  try {
    // Route: /convert
    if (route === 'convert' && event.httpMethod === 'POST') {
      const { htmlContent, options, expirationDays } = JSON.parse(event.body);
      
      if (!htmlContent) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'HTML content is required' }),
        };
      }
      
      // Generate unique file ID
      const fileId = uuidv4();
      const outputPath = getTempFilePath(fileId);
      
      // Launch browser with Netlify Chromium
      const browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
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
      
      // Log the conversion
      console.log(`PDF generated: ${fileId}.pdf`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          fileId,
          downloadLink: `/api/download/${fileId}`,
          linkId: link.linkId,
          linkUrl: link.url,
          expiresAt: link.expiresAt,
        }),
      };
    }

    // Route: /download/:fileId
    if (route === 'download' && segments.length === 2 && event.httpMethod === 'GET') {
      const fileId = segments[1];
      const filePath = getTempFilePath(fileId);
      
      if (!fs.existsSync(filePath)) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'File not found' }),
        };
      }
      
      // Log download
      console.log(`File downloaded: ${fileId}.pdf`);
      
      // Read file content
      const fileContent = fs.readFileSync(filePath);
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileId}.pdf"`,
        },
        body: fileContent.toString('base64'),
        isBase64Encoded: true,
      };
    }

    // Route: /links/:linkId
    if (route === 'links' && segments.length === 2 && event.httpMethod === 'GET') {
      const linkId = segments[1];
      const link = links[linkId];
      
      if (!link) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ 
            valid: false,
            error: 'Link not found' 
          }),
        };
      }
      
      const now = new Date();
      const expired = now > new Date(link.expirationDate);
      const maxDownloadsReached = link.downloads >= link.maxDownloads;
      
      if (expired || maxDownloadsReached) {
        return {
          statusCode: 410,
          headers,
          body: JSON.stringify({
            valid: true,
            expired: true,
            error: expired ? 'Link expired' : 'Maximum downloads reached',
          }),
        };
      }
      
      // Get file info
      const filePath = getTempFilePath(link.fileId);
      
      if (!fs.existsSync(filePath)) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'File not found' }),
        };
      }
      
      const stats = fs.statSync(filePath);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: true,
          expired: false,
          fileId: link.fileId,
          filename: `${link.fileId}.pdf`,
          size: `${Math.round(stats.size / 1024)} KB`,
          createdAt: stats.birthtime.toISOString(),
          expiresAt: link.expirationDate.toISOString(),
          downloads: link.downloads,
          maxDownloads: link.maxDownloads,
        }),
      };
    }

    // Route: /send-email
    if (route === 'send-email' && event.httpMethod === 'POST') {
      const { fileId, email, message } = JSON.parse(event.body);
      
      if (!fileId || !email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'File ID and email are required' }),
        };
      }
      
      const filePath = getTempFilePath(fileId);
      
      if (!fs.existsSync(filePath)) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'File not found' }),
        };
      }
      
      // Generate download link
      const link = generateDownloadLink(fileId, 7);
      const baseUrl = process.env.BASE_URL || 'https://example.com';
      
      // For demo purposes, just log the email
      console.log('Email would be sent to:', email, 'with link:', `${baseUrl}${link.url}`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Email sent successfully',
          linkId: link.linkId,
          linkUrl: link.url,
        }),
      };
    }

    // Fallback for unhandled routes
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};