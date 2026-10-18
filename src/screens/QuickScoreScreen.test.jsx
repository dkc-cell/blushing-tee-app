import { vi } from 'vitest';
import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import QuickScoreScreen from './QuickScoreScreen';
import { loadActiveRound, saveActiveRound } from '../utils/activeRoundStorage';
import { calcStats, calcOverallStats, formatScoreToPar, exportToCSV } from '../utils';
vi.mock('canvas-confetti', () => ({ __esModule: true, default: Object.assign(vi.fn(), { reset: vi.fn() }) }));
let container, root, recorded, completed;
function Harness({ pars = { 1: 4, 2: 4, 3: 3 } }) {
  const [hole, setHole] = useState(1);
  const [round, setRound] = useState([]);
  const [courseName, setCourseName] = useState('Test Course');
  return <QuickScoreScreen currentHole={hole} setCurrentHole={setHole} currentRound={round} customPars={pars} setCustomPars={vi.fn()} customYardages={{ 1: 297 }} courseName={courseName} setCourseName={setCourseName} onRecordHole={data => { recorded(data); setRound(r => [...r.filter(h => h.hole !== data.hole), data]); }} onCompleteRound={completed} onBack={vi.fn()} />;
}
const render = () => act(() => root.render(<Harness />));
const click = name => {
  const b = [...container.querySelectorAll('button')].find(b => (b.getAttribute('aria-label') || b.textContent.trim()) === name);
  expect(b).toBeTruthy(); act(() => b.click());
};
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear(); recorded = vi.fn(); completed = vi.fn();
  saveActiveRound({ currentHole: 1, currentRound: [], scoringMode: 'quick' });
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });
test('starts blank, records score only, and starts next hole blank', () => {
  render(); expect(container.querySelector('.qs-total').textContent).toBe('--');
  click('Save & Next Hole →'); expect(recorded).not.toHaveBeenCalled();
  for (let i = 0; i < 5; i++) click('Increase score');
  click('Save & Next Hole →');
  expect(recorded).toHaveBeenCalledWith(expect.objectContaining({ total: 5, scoringMode: 'quick', fairwayHit: null, putts: null }));
  expect(container.querySelector('.qs-total').textContent).toBe('--');
});
test('optional quick stats never change the total and zero putts is explicit', () => {
  render(); for (let i = 0; i < 5; i++) click('Increase score');
  act(() => { container.querySelector('summary').click(); });
  click('✓ Yes'); click('Increase putts'); click('Decrease putts');
  expect(loadActiveRound().holeDraft.putts).toBe(0);
  click('Increase putts'); click('Increase putts');
  expect(container.querySelector('.qs-total').textContent).toBe('5');
  click('Save & Next Hole →');
  expect(recorded).toHaveBeenCalledWith(expect.objectContaining({ total: 5, putts: 2, fairwayHit: true }));
});
test('manual keypad entry and correction persist through remount', () => {
  render(); click('Enter score manually'); click('6'); click('Done'); click('Decrease score');
  act(() => root.unmount()); root = createRoot(container); render();
  expect(container.querySelector('.qs-total').textContent).toBe('5');
  expect(loadActiveRound().scoringMode).toBe('quick');
});
test('unfinished next-hole draft survives visiting a previous recorded hole', () => {
  render(); for (let i = 0; i < 5; i++) click('Increase score'); click('Save & Next Hole →');
  click('Increase score'); click('Increase score'); click('← Previous Hole');
  expect(container.querySelector('.qs-total').textContent).toBe('5');
  click('Save & Next Hole →'); expect(container.querySelector('.qs-total').textContent).toBe('2');
});
test('rejects putts exceeding score', () => {
  render(); click('Increase score'); act(() => container.querySelector('summary').click());
  click('Increase putts'); click('Increase putts'); click('Save & Next Hole →');
  expect(recorded).not.toHaveBeenCalled(); expect(container.textContent).toContain('Putts cannot be greater');
});
test('missing fairway and putt stats do not dilute detailed statistics', () => {
  const detailed = { total: 5, par: 4, fairwayHit: true, putts: 3 };
  const quick = { total: 6, par: 4, fairwayHit: null, putts: null };
  expect(calcStats([detailed, quick])).toMatchObject({ totalScore: 11, fairwayPct: 100, totalFairways: 1, threePuttPercentage: 100 });
  expect(calcOverallStats([{ holes: [detailed, quick] }])).toMatchObject({ fairwaysHit: 100, threePuttPercentage: 100 });
  expect(calcStats([quick])).toMatchObject({ fairwayPct: null, threePuttPercentage: null, totalPutts: null });
});

test('unknown par prompts for par and par 3 asks about the green', () => {
  act(() => root.render(<Harness pars={{}} />));
  act(() => container.querySelector('summary').click());
  expect(container.textContent).toContain('Select par (required)');
  act(() => root.render(<Harness pars={{ 1: 3 }} />));
  expect(container.textContent).not.toContain('Fairway hit?');
  expect(container.textContent).toContain('Green hit?');
});

test('does not save or celebrate a score without par', () => {
  act(() => root.render(<Harness pars={{}} />));
  for (let i = 0; i < 4; i++) click('Increase score');
  click('Save & Next Hole →');
  expect(recorded).not.toHaveBeenCalled();
  expect(container.querySelector('.birdie-overlay')).toBeNull();
});

test('course name can be edited during the round and yardage stays hidden but preserved', () => {
  render();
  expect(container.textContent).not.toContain('Yardage');
  click('Edit course name');
  act(() => Simulate.change(container.querySelector('input'), { target: { value: 'Olympic Hills' } }));
  click('Save Name');
  expect(container.querySelector('.qs-course-name').textContent).toContain('Olympic Hills');
  for (let i = 0; i < 5; i++) click('Increase score');
  click('Save & Next Hole →');
  expect(recorded).toHaveBeenCalledWith(expect.objectContaining({ yardage: 297 }));
});
test('par 3 green response is saved separately from fairways', () => {
  act(() => root.render(<Harness pars={{ 1: 3 }} />));
  for (let i = 0; i < 4; i++) click('Increase score');
  act(() => container.querySelector('summary').click()); click('✓ Yes'); click('Save & Next Hole →');
  expect(recorded).toHaveBeenCalledWith(expect.objectContaining({ total: 4, greenInRegulation: true, fairwayHit: null }));
});
test('unknown pars are excluded from comparisons and export handicap is removed', () => {
  const holes = [{ total: 5, par: 4 }, { total: 6, par: null }];
  expect(calcStats(holes)).toMatchObject({ totalScore: 11, totalPar: null, scoreToPar: null, avgToParPerHole: '1.00', knownParCount: 1 });
  expect(calcStats([{ total: 6, par: null }])).toMatchObject({ scoreToPar: null, avgToParPerHole: null });
  expect(formatScoreToPar(6, null)).toBe('—');
  expect(exportToCSV([{ holes }])).not.toContain('Unofficial Handicap');
});

test('birdie uses artwork without duplicate caption and advances after four seconds', () => {
  vi.useFakeTimers();
  render(); for (let i = 0; i < 3; i++) click('Increase score'); click('Save & Next Hole →');
  const overlay = container.querySelector('.birdie-overlay');
  expect(overlay.querySelector('img').alt).toBe('Birdie');
  expect(overlay.textContent).toBe('');
  act(() => vi.advanceTimersByTime(4000));
  expect(container.querySelector('.birdie-overlay')).toBeNull();
  expect(container.querySelector('.qs-total').textContent).toBe('--');
  vi.useRealTimers();
});

test('requires par before saving a quick score', () => {
  act(() => root.render(<Harness pars={{}} />));
  click('Increase score'); click('Save & Next Hole →');
  expect(recorded).not.toHaveBeenCalled();
  expect(container.textContent).toContain('Select par for Hole 1');
  expect(container.textContent).not.toContain('Leave par blank');
});
