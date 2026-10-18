import React, { useRef, useState } from 'react';
import './BackupRestore.css';
import { COLORS } from '../constants';
import { downloadBackupJSON, readBackupFile } from '../utils';

export default function AccountBackupScreen({ rounds, courses, onRestoreData, onBack, onFileBackup }) {
  const fileInput = useRef(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const card = { background: 'white', borderRadius: 16, padding: '24px 20px', marginBottom: 24, lineHeight: 1.7 };
  const button = { border: 0, borderRadius: 12, padding: '14px 18px', minHeight: 44, background: COLORS.darkTeal, color: COLORS.cream, fontFamily: 'inherit', fontSize: 17, fontWeight: 700, lineHeight: 1.4, cursor: 'pointer' };
  const exportBackup = () => {
    downloadBackupJSON({ app: 'Blushing Birdie', version: 1, exportedAt: new Date().toISOString(), rounds, courses }, `blushing-birdie-backup-${new Date().toISOString().slice(0, 10)}.json`);
    setMessage('Backup download started. Save the JSON file outside this browser, such as in Files or iCloud Drive.');
  };
  const importBackup = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    setMessage('');
    try {
      const backup = await readBackupFile(file);
      if (!window.confirm(`Restore ${backup.rounds.length} saved rounds and ${backup.courses.length} courses? This replaces the saved rounds and courses on this device. Save a backup of this device first if you want to keep them.`)) return;
      onRestoreData(backup);
      setMessage('Backup restored. Your saved rounds and courses are available on this device.');
    } catch (error) {
      setMessage('Unable to restore this file. Choose a valid Blushing Birdie JSON backup, not a CSV file. Your saved data has not been changed.');
    } finally { setBusy(false); }
  };
  return <main className="backup-restore" style={{ background: COLORS.cream, color: COLORS.darkTeal, minHeight: '100dvh', padding: '20px 18px' }}><div style={{ maxWidth: 560, margin: 'auto' }}>
    <button onClick={onBack} style={{ ...button, background: 'none', color: COLORS.darkTeal, paddingLeft: 0 }}>← Back to Home</button>
    <h1 style={{ margin: '16px 0 28px' }}>Backup & Restore</h1>
    <section style={card}><h2 style={{ marginTop: 0 }}>Your data stays on this device</h2><p>{rounds.length} saved rounds · {courses.length} saved courses</p><p>No account is required. There is no automatic backup or device sync. Clearing browser data or losing your phone can remove your local data.</p></section>
    <section style={card}><h2 style={{ marginTop: 0 }}>Recommended backup schedule</h2><ul style={{ paddingLeft: 22 }}><li style={{ marginBottom: 12 }}>After each saved round or course change.</li><li style={{ marginBottom: 12 }}>Before switching phones, changing browsers, or clearing browser data.</li><li>Keep your two most recent backup files in Files, iCloud Drive, or another location outside this browser.</li></ul><p>Backups include saved rounds and courses. Finish or end an active round before exporting to include it. A backup only restores what was saved when you created it.</p></section>
    <section style={card}><h2 style={{ marginTop: 0 }}>Save or restore your backup</h2><p><strong>Export Backup</strong> saves a JSON file. On a new device, open Blushing Birdie and choose <strong>Import Backup</strong> to select that file.</p><p>Importing replaces saved rounds and courses on this device. It does not combine two devices’ records.</p><div className="backup-actions"><button type="button" onClick={exportBackup} style={button} disabled={busy}>Export Backup</button><p className="backup-action-help">Save a copy of your saved rounds and courses.</p><button type="button" onClick={() => fileInput.current?.click()} style={{ ...button, background: '#FFFFFF', color: COLORS.darkTeal, border: `2px solid ${COLORS.darkTeal}` }} disabled={busy}>{busy ? 'Reading Backup…' : 'Import Backup'}</button><p className="backup-action-help">Choose a previously saved Blushing Birdie JSON backup.</p><input ref={fileInput} aria-label="Choose backup file" type="file" accept="application/json,.json" onChange={importBackup} disabled={busy} hidden /></div></section>
    <section style={card}><h2 style={{ marginTop: 0 }}>Golf stats spreadsheet</h2><p>CSV exports are for reviewing stats in a spreadsheet. They cannot restore the app.</p><button onClick={onFileBackup} style={button}>Open My Rounds & Stats</button></section>
    <p role="status" style={{ lineHeight: 1.7 }}>{message}</p>
  </div></main>;
}
