import axios from 'axios';

// Define the base URL based on the environment
const baseURL = import.meta.env.DEV 
  ? 'http://localhost:3000/api' 
  : '/api';

// Create an axios instance with the base URL
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Conversion API
export const convertHtmlToPdf = async (data: {
  htmlContent: string;
  options?: {
    pageSize?: string;
    margin?: string;
    headerTemplate?: string;
    footerTemplate?: string;
  };
  expirationDays?: number;
}) => {
  const response = await apiClient.post('/convert', data);
  return response.data;
};

// Download API
export const getDownloadUrl = (fileId: string) => {
  return `${baseURL}/download/${fileId}`;
};

// Link API
export const getLinkInfo = async (linkId: string) => {
  const response = await apiClient.get(`/links/${linkId}`);
  return response.data;
};

// Email API
export const sendEmailWithPdf = async (data: {
  fileId: string;
  email: string;
  message?: string;
}) => {
  const response = await apiClient.post('/send-email', data);
  return response.data;
};

export default apiClient;