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

// Keep Journal navigation consistent with the slash-free URLs in our sitemap.
// This is a client-side normalization; Netlify's CDN handles HTTP URL behavior.
function JournalRoute({ children }) {
  const location = useLocation();
  if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
    return (
      <Navigate
        to={location.pathname.replace(/\\/+$/, '') + location.search + location.hash}
        replace
      />
    );
  }
  return children;
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
        <Route path="/journal" element={<JournalRoute><JournalPage /></JournalRoute>} />
        <Route path="/journal/:slug" element={<JournalRoute><JournalArticlePage /></JournalRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
