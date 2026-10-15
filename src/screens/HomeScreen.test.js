import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import HomeScreen from './HomeScreen';
let container, root;
beforeEach(() => { global.IS_REACT_ACT_ENVIRONMENT = true; container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
test('home prioritizes three actions and hides secondary options until More opens', () => {
  const navigate = jest.fn();
  act(() => root.render(<HomeScreen onNavigate={navigate} savedCourses={[]} />));
  expect(container.textContent).not.toContain('Shop');
  expect(container.textContent).not.toContain('About & Help');
  const buttons = [...container.querySelectorAll('button')];
  act(() => buttons.find(b => b.textContent.includes('My Courses')).click());
  expect(navigate).toHaveBeenLastCalledWith('manageCourses');
  act(() => buttons.find(b => b.textContent.includes('Start a Round')).click());
  expect(navigate).toHaveBeenLastCalledWith('selectCourse');
  act(() => buttons.find(b => b.textContent.includes('My Rounds & Stats')).click());
  expect(navigate).toHaveBeenLastCalledWith('stats');
  act(() => buttons.find(b => b.textContent.startsWith('More')).click());
  expect(container.textContent).toContain('About & Help');
  act(() => [...container.querySelectorAll('button')].find(b => b.textContent.includes('Backup & Account')).click());
  expect(navigate).toHaveBeenLastCalledWith('accountBackup');
});
test('in-progress round remains resumable from the redesigned home', () => {
  const resume = jest.fn();
  act(() => root.render(<HomeScreen onNavigate={jest.fn()} activeRound={{ currentHole: 2, currentRound: [{ hole: 1 }], courseName: 'Test Course' }} onResumeRound={resume} />));
  act(() => [...container.querySelectorAll('button')].find(b => b.textContent === 'Resume Round').click());
  expect(resume).toHaveBeenCalledTimes(1);
});
