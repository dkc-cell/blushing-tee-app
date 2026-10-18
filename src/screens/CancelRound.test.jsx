import React, { act } from 'react';
import { vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import AppPage from './AppPage';
import { loadActiveRound } from '../utils/activeRoundStorage';
import { STORAGE_KEYS } from '../constants';

let container, root;
const click = text => {
  const button = [...container.querySelectorAll('button')].find(b => b.textContent.includes(text));
  expect(button).toBeTruthy();
  act(() => button.click());
};
beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  container = document.createElement('div'); document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount()); container.remove();
  vi.restoreAllMocks(); vi.useRealTimers();
});
const start = mode => {
  act(() => root.render(<AppPage />));
  act(() => vi.advanceTimersByTime(1500));
  click('Start a Round'); click('Start Without a Saved Course'); click(mode);
};

test.each(['Quick Score', 'Detailed Tracking'])('%s can cancel before recording or selecting par without creating a saved round', mode => {
  start(mode);
  click('Cancel Round');
  expect(window.confirm).toHaveBeenCalled();
  expect(container.textContent).toContain('Start a Round');
  expect(container.textContent).not.toContain('Round in Progress');
  expect(loadActiveRound()).toBeNull();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.ROUNDS))).toEqual([]);
});

test.each(['Quick Score', 'Detailed Tracking'])('%s preserves the active round when cancellation is declined and can cancel from Home', mode => {
  start(mode);
  window.confirm.mockReturnValue(false);
  click('Cancel Round');
  expect(loadActiveRound()).not.toBeNull();
  expect(container.textContent).toContain('Cancel Round');
  click('Back to Home');
  expect(container.textContent).toContain('Round in Progress');
  window.confirm.mockReturnValue(true);
  click('Cancel Round');
  expect(loadActiveRound()).toBeNull();
  expect(container.textContent).not.toContain('Round in Progress');
});

test('canceling an unfinished first-hole draft clears it while retaining saved history and courses', () => {
  const savedRound = { id: 'saved', date: '2026-10-18', courseName: 'Saved course', holes: [{ hole: 1, par: 4, total: 5 }] };
  localStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify([savedRound]));
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify([{ id: 'course', name: 'Saved course', pars: { 1: 4 } }]));
  start('Quick Score');
  act(() => container.querySelector('[aria-label="Increase score"]').click());
  expect(loadActiveRound().holeDraft.score).toBe(1);
  click('Cancel Round');
  expect(loadActiveRound()).toBeNull();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.ROUNDS))).toHaveLength(1);
  expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES))).toHaveLength(1);
});
