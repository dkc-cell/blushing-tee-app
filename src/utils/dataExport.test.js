import { exportToCSV, readBackupFile } from './index';
const round = { id: 'r1', date: '2026-10-18', courseName: 'Test Course', holes: [
  { hole: 1, par: 4, total: 4, putts: 2, fairwayHit: true },
  { hole: 2, par: 4, total: 5, putts: null, fairwayHit: null },
  { hole: 3, par: 3, total: 1, putts: 0, greenInRegulation: true },
] };
const row = csv => {
  const [headers, data] = csv.split('\n').map(line => line.split(','));
  return Object.fromEntries(headers.map((header, i) => [header, data[i]]));
};
test('CSV calculates stats only over recorded optional details, including zero putts and an ace', () => {
  const data = row(exportToCSV([round]));
  expect(data['Putts (Recorded Holes)']).toBe('2');
  expect(data['Holes with Putts Recorded']).toBe('2');
  expect(data['Avg Putts per Recorded Hole']).toBe('1.00');
  expect(data['Fairways Recorded']).toBe('1');
  expect(data['Fairways %']).toBe('100.0%');
  expect(data['Par 3 Greens %']).toBe('100.0%');
  expect(data['Eagles or Better']).toBe('1');
});
test('CSV leaves unrecorded stats and unknown par blank and respects date range', () => {
  const data = row(exportToCSV([{ ...round, holes: [{ hole: 1, total: 6 }] }]));
  ['Par', 'Score to Par', 'Putts (Recorded Holes)', 'Fairways Hit', 'Fairways %', 'Birdies'].forEach(key => expect(data[key]).toBe(''));
  expect(exportToCSV([round], '2026-10-19')).toBeNull();
  expect(exportToCSV([round], '2026-10-18', '2026-10-18')).not.toBeNull();
});
test('CSV escapes text that could be interpreted as a spreadsheet formula', () => {
  expect(exportToCSV([{ ...round, courseName: '=1+1' }])).toContain('"\'=1+1"');
  expect(exportToCSV([{ ...round, courseName: 'A, "B"' }])).toContain('"A, ""B"""');
});
test('JSON backup round trips full records, including optional details and reflections', async () => {
  const backup = { app: 'Blushing Birdie', version: 1, rounds: [{ ...round, highlight: 'Great ace' }], courses: [{ id: 'c1', name: 'Test Course', pars: { 1: 4 }, yardages: {} }] };
  await expect(readBackupFile(new File([JSON.stringify(backup)], 'backup.json'))).resolves.toEqual(backup);
});
test('JSON restore rejects CSV and malformed records', async () => {
  await expect(readBackupFile(new File(['Date,Course\n2026-10-18,Test'], 'stats.csv'))).rejects.toThrow();
  await expect(readBackupFile(new File([JSON.stringify({ app: 'Blushing Birdie', rounds: [null], courses: [] })], 'bad.json'))).rejects.toThrow();
});
