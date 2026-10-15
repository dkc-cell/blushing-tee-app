import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import LogRoundScreen from './LogRoundScreen';
import ActiveRoundCard from '../components/ActiveRoundCard';
import { loadActiveRound, saveActiveRound, saveHoleDraft } from '../utils/activeRoundStorage';

jest.mock('canvas-confetti', () => ({ __esModule: true, default: Object.assign(jest.fn(), { reset: jest.fn() }) }));
let container, root;
const recorded = { hole: 1, par: 4, total: 5, drive: 'left', approaches: 2, chips: 0, putts: 2, penalties: {}, notes: '' };
const props = (hole = 2) => ({ currentHole: hole, setCurrentHole: jest.fn(), customPars: { 1: 4, 2: 4, 3: 4 }, setCustomPars: jest.fn(), customYardages: { 1: 300, 2: 300, 3: 300 }, setCustomYardages: jest.fn(), currentRound: [recorded], recordedHoles: new Set([1]), onRecordHole: jest.fn(), onUnrecordHole: jest.fn(), onCompleteRound: jest.fn(), onBack: jest.fn() });
const render = element => act(() => root.render(element));
const click = text => {
  const button = [...container.querySelectorAll('button')].find(b => b.textContent.trim() === text);
  expect(button).toBeTruthy();
  act(() => button.click());
};
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  saveActiveRound({ currentHole: 2, currentRound: [recorded], recordedHoles: [1], courseName: 'Test Course' });
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

test('tee and approach entries survive returning home and reloading the screen', () => {
  render(<LogRoundScreen {...props()} />);
  click('Left');
  const approach = [...container.querySelectorAll('label')].find(l => l.textContent === 'Approach Shots').parentElement;
  act(() => approach.querySelectorAll('button')[1].click());
  expect(loadActiveRound().holeDraft).toMatchObject({ hole: 2, drive: 'left', approaches: 2 });
  render(<div>Home</div>);
  saveActiveRound({ ...loadActiveRound(), holeDraft: null });
  render(<LogRoundScreen {...props()} />);
  expect(container.textContent).toContain('Your Score3');
  expect(loadActiveRound().holeDraft).toMatchObject({ drive: 'left', approaches: 2 });
});

test('reducing inputs to zero and clearing a recorded draft does not restore stale inputs', () => {
  saveHoleDraft(2, { hole: 2, drive: 'left', approaches: 2 });
  saveHoleDraft(2, { hole: 2, drive: '', approaches: 0 });
  saveActiveRound(loadActiveRound());
  expect(loadActiveRound().holeDraft).toBeNull();
  saveHoleDraft(2, null);
  saveActiveRound({ ...loadActiveRound(), holeDraft: { hole: 2, drive: 'left' } });
  expect(loadActiveRound().holeDraft).toBeNull();
});

test('changing holes restores the target draft without saving the prior hole inputs', () => {
  saveHoleDraft(2, { hole: 2, drive: 'left', approaches: 2 });
  render(<LogRoundScreen {...props()} />);
  render(<LogRoundScreen {...props(3)} />);
  expect(loadActiveRound().holeDraft).toBeNull();
  expect(loadActiveRound().currentHole).toBe(3);
});

test('ending early prompts about unfinished hole and excludes it from recorded holes', () => {
  saveHoleDraft(2, { hole: 2, drive: 'left', approaches: 2 });
  const end = jest.fn();
  render(<ActiveRoundCard activeRound={loadActiveRound()} onResume={jest.fn()} onEndRoundEarly={end} />);
  click('End Round Early');
  expect(container.textContent).toContain("Hole 2 isn't finished");
  click('End Round at Hole 1');
  expect(end).toHaveBeenCalledTimes(1);
  expect(loadActiveRound().currentRound).toEqual([recorded]);
});

test('recording a resumed hole saves its complete score and clears its draft', () => {
  saveHoleDraft(2, { hole: 2, drive: 'left', approaches: 2, putts: 2 });
  const p = props();
  render(<LogRoundScreen {...p} />);
  click('Record Hole 2 & Continue');
  expect(p.onRecordHole).toHaveBeenCalledWith(expect.objectContaining({ hole: 2, total: 5, drive: 'left', approaches: 2, putts: 2 }));
  expect(loadActiveRound().holeDraft).toBeNull();
});
