import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './screens/HomePage';
import AppPage from './screens/AppPage';
import JournalPage from './screens/JournalPage';
import JournalArticlePage from './screens/JournalArticlePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/app" element={<AppPage />} />

  {/* NEW */}
  <Route path="/journal" element={<JournalPage />} />
  <Route path="/journal/:slug" element={<JournalArticlePage />} />
</Routes>
    </BrowserRouter>
  );
}