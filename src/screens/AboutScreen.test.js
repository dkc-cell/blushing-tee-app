import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import AboutScreen from './AboutScreen';
import { journalArticles } from '../data/journalArticles';
jest.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}), { virtual: true });

test('About contains the complete dated My Story article and returns directly to tracker home', () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  const root = createRoot(container);
  const navigate = jest.fn();
  act(() => root.render(<AboutScreen onNavigate={navigate} />));
  const story = journalArticles.find(article => article.slug === 'my-story');
  const article = container.querySelector('article');
  expect(article.textContent).toContain('March 6, 2026');
  expect(article.textContent).toContain(story.excerpt);
  story.content.forEach(paragraph => expect(article.textContent).toContain(paragraph));
  expect(article.querySelectorAll('p, h2').length).toBe(story.content.length + 3);
  expect(container.querySelector('a[href="/journal"]')).toBeNull();
  expect(container.querySelector('a[href="/our-story"]')).toBeNull();
  expect(container.querySelector('a[href="/"]')).toBeNull();
  expect(container.querySelector('a[href="/privacy"]').target).toBe('_blank');
  act(() => [...container.querySelectorAll('button')].pop().click());
  expect(navigate).toHaveBeenCalledWith('home');
  act(() => root.unmount());
});
