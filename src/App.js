import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './screens/HomePage';
import AppPage from './screens/AppPage';
import JournalPage from './screens/JournalPage';
import JournalArticlePage from './screens/JournalArticlePage';
import OurStoryPage from './screens/OurStoryPage';
import PrivacyPage from './screens/PrivacyPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/app" element={<AppPage />} />
  <Route path="/our-story" element={<OurStoryPage />} />
  <Route path="/privacy" element={<PrivacyPage />} />

  {/* NEW */}
  <Route path="/journal" element={<JournalPage />} />
  <Route path="/journal/:slug" element={<JournalArticlePage />} />
</Routes>
    </BrowserRouter>
  );
}
