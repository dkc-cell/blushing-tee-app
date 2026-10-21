import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router-dom';
import HomePage from './screens/HomePage';
import JournalPage from './screens/JournalPage';
import JournalArticlePage from './screens/JournalArticlePage';
import OurStoryPage from './screens/OurStoryPage';
import PrivacyPage from './screens/PrivacyPage';
import { journalArticles } from './data/journalArticles';
import { SeoContext, applyPageSeo, usePageSeo } from './utils/seo';

// The tracker remains client-rendered, with its own canonical and noindex policy.
function TrackerShell() {
  usePageSeo({ title: 'Blushing Birdie App',
    description: 'Open the Blushing Birdie private golf round tracker and scorecard app.',
    path: '/app', robots: 'noindex,nofollow' });
  return null;
}

export const paths = ['/', '/our-story', '/privacy', '/journal',
  ...journalArticles.map(({ slug }) => `/journal/${slug}`), '/app'];
export { applyPageSeo };
export function render(path) {
  const metadata = { current: null };
  const html = renderToString(
    <SeoContext.Provider value={metadata}>
      <StaticRouter location={path}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:slug" element={<JournalArticlePage />} />
          <Route path="/app" element={<TrackerShell />} />
        </Routes>
      </StaticRouter>
    </SeoContext.Provider>
  );
  if (!metadata.current) throw new Error(`Missing SEO metadata for ${path}`);
  return { html, metadata: metadata.current };
}
