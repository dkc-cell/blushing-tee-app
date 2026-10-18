import { exportToCSV, readBackupFile, exportHolesToCSV } from './index';
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
  const backup = { app: 'Blushing Birdie', version: 1, rounds: [{ ...round, highlight: 'Great ace', holes: round.holes.map(hole => ({ ...hole, penalties: { water: false, lost: false, ob: false } })) }], courses: [{ id: 'c1', name: 'Test Course', pars: { 1: 4 }, yardages: {} }] };
  await expect(readBackupFile(new File([JSON.stringify(backup)], 'backup.json'))).resolves.toEqual(backup);
});
test('JSON restore rejects CSV and malformed records', async () => {
  await expect(readBackupFile(new File(['Date,Course\n2026-10-18,Test'], 'stats.csv'))).rejects.toThrow();
  await expect(readBackupFile(new File([JSON.stringify({ app: 'Blushing Birdie', rounds: [null], courses: [] })], 'bad.json'))).rejects.toThrow();
});

test('JSON restore rejects oversized, deeply nested and dangerous-key backups before importing', async () => {
  await expect(readBackupFile(new File([' '.repeat(2 * 1024 * 1024 + 1)], 'large.json'))).rejects.toThrow('too large');
  const base = { app: 'Blushing Birdie', version: 1, rounds: [round], courses: [] };
  const unsafe = JSON.stringify(base).replace('"version":1', '"version":1,"__proto__":{"polluted":true}');
  await expect(readBackupFile(new File([unsafe], 'unsafe.json'))).rejects.toThrow('Invalid');
  let nested = {};
  for (let i = 0; i < 15; i++) nested = { nested };
  await expect(readBackupFile(new File([JSON.stringify({ ...base, extra: nested })], 'deep.json'))).rejects.toThrow('Invalid');
  expect({}.polluted).toBeUndefined();
});

test('JSON restore rejects display objects and preserves script-like strings as inert text', async () => {
  const backup = { app: 'Blushing Birdie', version: 1, rounds: [{ ...round, courseName: { malicious: true } }], courses: [] };
  await expect(readBackupFile(new File([JSON.stringify(backup)], 'bad.json'))).rejects.toThrow('Invalid');
  backup.rounds[0].courseName = '<script>alert(1)</script>';
  await expect(readBackupFile(new File([JSON.stringify(backup)], 'text.json'))).resolves.toEqual(backup);
});

test('hole CSV preserves actual hole numbers, orders them, and leaves legacy unknown stats blank', () => {
  const csv = exportHolesToCSV([{ ...round, holes: [
    { hole: 10, total: 5, par: 4, putts: 0, fairwayHit: false },
    { hole: 8, total: 4 },
    { hole: 9, total: 3, par: 3, greenInRegulation: true },
  ] }]);
  const rows = csv.split('\n').slice(1).map(line => line.split(','));
  expect(rows.map(r => r[3])).toEqual(['8', '9', '10']);
  expect(rows[0].slice(4)).toEqual(['', '4', '', '', '', '', '']);
  expect(rows[1][10]).toBe('Yes');
  expect(rows[2][8]).toBe('0');
  expect(rows[2][9]).toBe('No');
  expect(exportHolesToCSV([round], '2026-10-19')).toBeNull();
});
