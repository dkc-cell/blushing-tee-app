import React from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './screens/HomePage';
import AppPage from './screens/AppPage';
import JournalPage from './screens/JournalPage';
import JournalArticlePage from './screens/JournalArticlePage';
import OurStoryPage from './screens/OurStoryPage';
import PrivacyPage from './screens/PrivacyPage';

function HomeRoute() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
  const hasAuthCallback =
    searchParams.has('code') ||
    searchParams.get('type') === 'recovery' ||
    hashParams.get('type') === 'recovery' ||
    searchParams.get('password-reset') === '1';

  if (hasAuthCallback) {
    return (
      <Navigate
        to={`/app${location.search}${location.hash}`}
        replace
      />
    );
  }

  return <HomePage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
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
