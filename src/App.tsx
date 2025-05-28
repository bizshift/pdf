import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout components
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import ConvertPage from './pages/ConvertPage';
import DocumentsPage from './pages/DocumentsPage';
import SettingsPage from './pages/SettingsPage';
import LinkPage from './pages/LinkPage';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="convert" element={<ConvertPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/link/:id" element={<LinkPage />} />
      </Routes>
    </Router>
  );
}

export default App;