import './ScreenSpacing.css';
import React, { useRef, useState } from 'react';
import { COLORS } from '../constants';
import {
  calcStats,
  getRoundPar,
  formatDateForDisplay,
  formatScoreToPar,
  exportToCSV,
  exportHolesToCSV,
  downloadCSV,
  downloadBackupJSON,
  readBackupFile,
} from '../utils';

const StatsScreen = ({
  rounds,
  courses,
  setRounds,
  setCourses,
  onBack,
  onUpdateRound,
  onDeleteRound
}) => {
  const [selectedRound, setSelectedRound] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const backupFileInput = useRef(null);
  const [exportType, setExportType] = useState('summary');
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [isEditingRound, setIsEditingRound] = useState(false);
  const [editRoundDate, setEditRoundDate] = useState('');
  const [editRoundCourse, setEditRoundCourse] = useState('');
  const [editCourseRating, setEditCourseRating] = useState('');
  const [editSlopeRating, setEditSlopeRating] = useState('');

  // All-time stats
const allHoles = rounds.flatMap(r => r.holes || []);
const allTimeStats = calcStats(allHoles);


// Recent stats (Last 10 logged rounds, including partial rounds)
const sortedRounds = [...rounds]
  .filter(r => r?.date)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const recentRounds = sortedRounds.slice(0, 10);
const recentHoles = recentRounds.flatMap(r => r.holes || []);
const recentStats = calcStats(recentHoles);

const recentRoundCount = recentRounds.length;


// ✅ CSV Export (existing)
const handleExport = () => {
  const csvContent = (exportType === 'holes' ? exportHolesToCSV : exportToCSV)(rounds, exportStartDate || null, exportEndDate || null);
  if (!csvContent) {
    alert('No rounds found in the selected date range.');
    return;
  }
  downloadCSV(
    csvContent,
    `blushing-birdie-${exportType === 'holes' ? 'hole-by-hole' : 'round-summary'}-${new Date().toISOString().slice(0, 10)}.csv`
  );
  setShowExportModal(false);
  setExportStartDate('');
  setExportEndDate('');
  alert('CSV file downloaded successfully!');
};

// ✅ Backup Export (NEW)
const handleExportBackup = () => {
  const backupData = {
    app: 'Blushing Birdie',
    version: 1,
    exportedAt: new Date().toISOString(),
    rounds,
    courses,
  };

  downloadBackupJSON(
    backupData,
    `blushing-birdie-backup-${new Date().toISOString().slice(0, 10)}.json`
  );

  alert('Backup download started. Save the JSON file in Files, iCloud Drive, or another safe location outside this browser.');
};

// ✅ Backup Import (NEW)
const handleImportBackup = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const confirmed = window.confirm(
    'Importing a backup will replace all current rounds and courses on this device. Do you want to continue?'
  );

  if (!confirmed) {
    event.target.value = '';
    return;
  }

  try {
    const backupData = await readBackupFile(file);

    setRounds(backupData.rounds);
    setCourses(backupData.courses);

    alert('Backup imported successfully!');
  } catch (error) {
    alert('That file could not be imported. Please choose a valid Blushing Birdie backup.');
  }

  event.target.value = '';
};

  const startEditingRound = () => {
  setEditRoundDate(selectedRound.date);
  setEditRoundCourse(selectedRound.courseName || '');
  setEditCourseRating(selectedRound.courseRating ?? '');
  setEditSlopeRating(selectedRound.slopeRating ?? '');
  setIsEditingRound(true);
};

 const saveRoundMetadata = () => {
  if (!editRoundCourse.trim()) {
    alert('Please enter a course name');
    return;
  }

  const courseRating =
    editCourseRating === '' ? null : Number.parseFloat(editCourseRating);
  const slopeRating =
    editSlopeRating === '' ? null : Number.parseInt(editSlopeRating, 10);

  if (
    courseRating !== null &&
    (Number.isNaN(courseRating) || courseRating < 60 || courseRating > 85)
  ) {
    alert('Please enter a valid Course Rating (usually between 60.0 and 85.0).');
    return;
  }

  if (
    slopeRating !== null &&
    (Number.isNaN(slopeRating) || slopeRating < 55 || slopeRating > 155)
  ) {
    alert('Please enter a valid Slope Rating (55-155).');
    return;
  }

  const updatedRound = {
    date: editRoundDate,
    courseName: editRoundCourse.trim(),
    courseRating,
    slopeRating
  };

  onUpdateRound(selectedRound.id, updatedRound);
  setSelectedRound({ ...selectedRound, ...updatedRound });
  setIsEditingRound(false);
  alert('Round updated successfully!');
};

  const handleDeleteRound = () => {
    const dateStr = formatDateForDisplay(selectedRound.date, { month: 'long', day: 'numeric', year: 'numeric' });
    if (window.confirm(`Are you sure you want to delete this round from ${dateStr}?`)) {
      onDeleteRound(selectedRound.id);
      setSelectedRound(null);
      alert('Round deleted successfully!');
    }
  };

  return (
  <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '80px' }}>
    {/* Header */}
    <div
      style={{
        backgroundColor: '#FFFFFF',
        padding: '20px 24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '24px',
      }}
    >
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: COLORS.darkTeal,
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '8px',
        }}
      >
        ← Back
      </button>
      <h2
        style={{
          color: COLORS.darkTeal,
          fontSize: '28px',
          fontWeight: 'bold',
          margin: 0,
        }}
      >
        My Rounds & Stats
      </h2>
      <p
        style={{
          color: COLORS.charcoal,
          fontSize: '18px',
          margin: '4px 0 0 0',
        }}
      >
        Track your progress over time
      </p>
    </div>

    <div style={{ padding: '0 24px' }}>
      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.blush}33 0%, #FFFFFF 100%)`,
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: COLORS.darkTeal,
            }}
          >
            {rounds.length}
          </div>
          <div
            style={{
              color: COLORS.charcoal,
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Total Rounds
          </div>
        </div>

        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.mistyBlue}33 0%, #FFFFFF 100%)`,
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: COLORS.darkTeal,
            }}
          >
            {recentRoundCount}
          </div>
          <div
            style={{
              color: COLORS.charcoal,
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Rounds (Last 10)
          </div>
        </div>
      </div>

      {/* Empty State OR Stats */}
      {rounds.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏌️‍♀️</div>
          <p style={{ color: COLORS.charcoal }}>
            No rounds logged yet. You can still import a backup file to restore your data.
          </p>
        </div>
      ) : (
        <>
          {/* Last 10 Rounds Stats */}
          {recentStats && (
            <StatsCard
              title={`📊 Last ${recentRoundCount} Round${recentRoundCount === 1 ? '' : 's'}`}
              stats={recentStats}
            />
          )}

          {/* All-Time Stats */}
          {allTimeStats && (
            <StatsCard
              title="🌟 All-Time Statistics"
              stats={allTimeStats}
              totalHoles={allHoles.length}
            />
          )}

        </>
      )}

      <div style={{ maxWidth: 560, margin: '0 auto 28px', display: 'grid', gap: 24 }}>
        <section aria-labelledby="stats-csv-title" style={{ background: '#FFFFFF', border: `1px solid ${COLORS.mistyBlue}`, borderRadius: 16, padding: '24px 20px', color: COLORS.darkTeal }}>
          <h3 id="stats-csv-title" style={{ margin: '0 0 18px', fontSize: 22 }}>Golf stats spreadsheet</h3>
          <p style={{ margin: '0 0 24px', fontSize: 16, lineHeight: 1.7 }}>Export CSV creates a spreadsheet for reviewing your scores and progress. Choose Round Summary or Hole-by-Hole. CSV files cannot restore the app.</p>
          <button onClick={() => setShowExportModal(true)} disabled={rounds.length === 0} style={{ width: '100%', minHeight: 54, border: 0, borderRadius: 12, padding: '14px 18px', background: COLORS.darkTeal, color: COLORS.cream, fontSize: 17, fontWeight: 700, cursor: rounds.length ? 'pointer' : 'not-allowed', opacity: rounds.length ? 1 : .65 }}>Export CSV</button>
          {!rounds.length && <p style={{ margin: '12px 0 0', lineHeight: 1.6 }}>Save a round to export its stats.</p>}
        </section>
        <section aria-labelledby="stats-backup-title" style={{ background: '#FFFFFF', border: `1px solid ${COLORS.mistyBlue}`, borderRadius: 16, padding: '24px 20px', color: COLORS.darkTeal }}>
          <h3 id="stats-backup-title" style={{ margin: '0 0 18px', fontSize: 22 }}>Backup & Restore</h3>
          <p style={{ margin: '0 0 20px', fontSize: 16, lineHeight: 1.7 }}>Export Backup saves your saved rounds and courses in a restorable JSON file. Import Backup restores that file and replaces saved rounds and courses on this device.</p>
          <p style={{ margin: '0 0 24px', fontSize: 16, lineHeight: 1.7 }}>Save a backup after each round or course change and before switching phones or clearing browser data. Keep your two most recent copies outside this browser, such as in Files or iCloud Drive.</p>
          <div style={{ display: 'grid', gap: 16 }}>
            <button onClick={handleExportBackup} disabled={!rounds.length && !courses.length} style={{ width: '100%', minHeight: 54, border: 0, borderRadius: 12, padding: '14px 18px', background: COLORS.darkTeal, color: COLORS.cream, fontSize: 17, fontWeight: 700, cursor: rounds.length || courses.length ? 'pointer' : 'not-allowed', opacity: rounds.length || courses.length ? 1 : .65 }}>Export Backup</button>
            <button onClick={() => backupFileInput.current?.click()} style={{ width: '100%', minHeight: 54, border: `2px solid ${COLORS.darkTeal}`, borderRadius: 12, padding: '14px 18px', background: '#FFFFFF', color: COLORS.darkTeal, fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>Import Backup</button>
            <input ref={backupFileInput} aria-label="Choose backup file" type="file" accept="application/json,.json" onChange={handleImportBackup} hidden />
          </div>
        </section>
      </div>

      {/* Round History - ONLY WHEN ROUNDS EXIST */}
      {rounds.length > 0 && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3
            style={{
              color: COLORS.darkTeal,
              fontWeight: 'bold',
              fontSize: '20px',
              marginTop: 0,
              marginBottom: '16px',
            }}
          >
            📅 Round History
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...rounds].reverse().map((round) => {
              const roundScore = round.holes.reduce((sum, h) => sum + h.total, 0);
              const roundPar = getRoundPar(round.holes);

              return (
                <button
                  key={round.id}
                  onClick={() => setSelectedRound(round)}
                  style={{
                    width: '100%',
                    backgroundColor: COLORS.cream,
                    border: `2px solid ${COLORS.mistyBlue}`,
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: COLORS.darkTeal,
                          fontSize: '18px',
                          fontWeight: 'bold',
                          marginBottom: '4px',
                        }}
                      >
                        {formatDateForDisplay(round.date)}
                      </div>
                      <div
                        style={{
                          color: COLORS.charcoal,
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        {round.courseName || 'Unnamed Course'} • {round.holes.length} holes
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '28px',
                          fontWeight: 'bold',
                          color: COLORS.darkTeal,
                        }}
                      >
                        {roundScore}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: COLORS.darkTeal,
                        }}
                      >
                        {formatScoreToPar(roundScore, roundPar)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
      
      {/* Round Detail Modal */}
      {selectedRound && (
        <RoundDetailModal
          round={selectedRound}
          isEditing={isEditingRound}
          editDate={editRoundDate}
          editCourse={editRoundCourse}
          editCourseRating={editCourseRating}
          editSlopeRating={editSlopeRating}
          setEditDate={setEditRoundDate}
          setEditCourse={setEditRoundCourse}
          setEditCourseRating={setEditCourseRating}
          setEditSlopeRating={setEditSlopeRating}
          onClose={() => {
              setSelectedRound(null);
              setIsEditingRound(false);
              setEditRoundDate('');
              setEditRoundCourse('');
              setEditCourseRating('');
              setEditSlopeRating('');
            }}
          onStartEdit={startEditingRound}
          onSaveEdit={saveRoundMetadata}
          onCancelEdit={() => {
              setIsEditingRound(false);
              setEditRoundDate('');
              setEditRoundCourse('');
              setEditCourseRating('');
              setEditSlopeRating('');
            }}
          onDelete={handleDeleteRound}
        />
      )}
      
      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          exportType={exportType}
          setExportType={setExportType}
          startDate={exportStartDate}
          endDate={exportEndDate}
          setStartDate={setExportStartDate}
          setEndDate={setExportEndDate}
          onClose={() => { setShowExportModal(false); setExportStartDate(''); setExportEndDate(''); }}
          onExport={handleExport}
        />
      )}
    </div>
  );
};

// Sub-components
const StatsCard = ({ title, stats, totalHoles }) => (
  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
    {stats.knownParCount < stats.holeCount && <p style={{ fontSize: 13, color: COLORS.darkTeal }}>Par-based averages use only holes with par entered. Missing comparisons are shown as —.</p>}
    <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '16px' }}>{title}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <StatItem
  label="Avg to Par / Hole"
  value={stats.avgToParPerHole == null ? '—' : stats.avgToParPerHole > 0 ? `+${stats.avgToParPerHole}` : stats.avgToParPerHole}
  variant="blush"
/>
      <StatItem label="3+ Putts" value={stats.threePuttPercentage == null ? '—' : `${stats.threePuttPercentage}%`} variant="misty" />
      {stats.par3GreenPct != null && <StatItem label="Par 3 Greens Hit" value={`${stats.par3GreenPct}%`} variant="blush" />}
      <StatItem label="Fairways Hit" value={stats.fairwayPct == null ? '—' : `${stats.fairwayPct}%`} variant="blush" />
      <StatItem label={totalHoles ? "Total Holes" : "Score to Par"} value={totalHoles || (stats.scoreToPar == null ? '—' : stats.scoreToPar > 0 ? `+${stats.scoreToPar}` : stats.scoreToPar)} variant="misty" />
    </div>
    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `2px solid ${COLORS.mistyBlue}33` }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '14px', color: COLORS.charcoal }}>
        <div><strong>Par 3:</strong> {stats.avgPar3}</div>
        <div><strong>Par 4:</strong> {stats.avgPar4}</div>
        <div><strong>Par 5:</strong> {stats.avgPar5}</div>
      </div>
    </div>
  </div>
);

const StatItem = ({ label, value, variant }) => (
  <div style={{ padding: '12px', backgroundColor: variant === 'blush' ? `${COLORS.blush}1A` : `${COLORS.mistyBlue}33`, borderRadius: '8px' }}>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.darkTeal }}>{value}</div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.charcoal }}>{label}</div>
  </div>
);

const RoundDetailModal = ({
  round,
  isEditing,
  editDate,
  editCourse,
  editCourseRating,
  editSlopeRating,
  setEditDate,
  setEditCourse,
  setEditCourseRating,
  setEditSlopeRating,
  onClose,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}) => {
  const totalScore = round.holes.reduce((sum, h) => sum + h.total, 0);
  const totalPar = getRoundPar(round.holes);
  const totalPutts = round.holes.some(h => Number.isFinite(h.putts)) ? round.holes.reduce((sum, h) => sum + (h.putts ?? 0), 0) : '—';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px', overflowY: 'auto' }} onClick={onClose}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 5,
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderBottom: `2px solid ${COLORS.mistyBlue}33`,
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}
>
          <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: COLORS.charcoal }}>✕</button>
          
          {!isEditing ? (
            <>
              <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{formatDateForDisplay(round.date)}</h3>
              <p style={{ color: COLORS.darkTeal, fontSize: '16px', margin: '0 0 16px 0' }}>{round.courseName || 'Unnamed Course'}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={onStartEdit} style={{ flex: 1, padding: '10px 16px', backgroundColor: `${COLORS.mistyBlue}66`,
                  color: COLORS.darkTeal, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>✏️ Edit Info</button>
                <button onClick={onDelete} style={{ flex: 1, padding: '10px 16px', backgroundColor: `${COLORS.blush}66`,
                  color: '#A9444A', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>🗑️ Delete Round</button>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px 0' }}>Edit Round Info</h3>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Date</label>
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '16px', border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '8px', fontFamily: 'inherit' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Course Name</label>
                <input type="text" value={editCourse} onChange={(e) => setEditCourse(e.target.value)} placeholder="Enter course name" style={{ width: '100%', padding: '10px', fontSize: '16px', border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '8px', fontFamily: 'inherit' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                Course Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editCourseRating}
                  onChange={(e) => setEditCourseRating(e.target.value)}
                  placeholder="e.g. 72.4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    border: `2px solid ${COLORS.mistyBlue}`,
                    borderRadius: '8px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                    Slope Rating
                  </label>
                  <input
                    type="number"
                    value={editSlopeRating}
                    onChange={(e) => setEditSlopeRating(e.target.value)}
                    placeholder="e.g. 128"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '16px',
                      border: `2px solid ${COLORS.mistyBlue}`,
                      borderRadius: '8px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={onCancelEdit} style={{ flex: 1, padding: '10px 16px', backgroundColor: COLORS.cream, color: COLORS.charcoal, border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button onClick={onSaveEdit} style={{ flex: 1, padding: '10px 16px', backgroundColor: COLORS.darkTeal, color: COLORS.cream, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>✓ Save Changes</button>
              </div>
            </>
          )}
        </div>
        
        <div style={{ padding: '24px' }}>
          {/* Summary */}
          <div style={{ backgroundColor: `${COLORS.blush}1A`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.darkTeal }}>{totalScore}</div>
                <div style={{ fontSize: '12px', color: COLORS.charcoal }}>Total Score</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.darkTeal }}>{formatScoreToPar(totalScore, totalPar)}</div>
                <div style={{ fontSize: '12px', color: COLORS.charcoal }}>To Par</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.darkTeal }}>{totalPutts}</div>
                <div style={{ fontSize: '12px', color: COLORS.charcoal }}>Total Putts</div>
              </div>
            </div>
          </div>
          
        {/* Round Reflection */}
          <div style={{ backgroundColor: `${COLORS.mistyBlue}1A`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: COLORS.darkTeal, fontSize: '16px', fontWeight: 'bold' }}>
              🌸 Round Reflection
            </h4>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: COLORS.charcoal, marginBottom: '4px' }}>
                Highlight
              </div>
              <div style={{ fontSize: '14px', color: COLORS.charcoal, lineHeight: 1.4, opacity: round.highlight ? 1 : 0.65 }}>
                {round.highlight || 'No highlight saved yet.'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: COLORS.charcoal, marginBottom: '4px' }}>
                Focus next round
              </div>
              <div style={{ fontSize: '14px', color: COLORS.charcoal, lineHeight: 1.4, opacity: round.focusNextRound ? 1 : 0.65 }}>
                {round.focusNextRound || 'No focus saved yet.'}
              </div>
            </div>
          </div>
 
          {/* Hole Breakdown */}
          <h4 style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Hole-by-Hole Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {round.holes.map(hole => (
              <div key={hole.hole} style={{ backgroundColor: COLORS.cream, borderRadius: '12px', padding: '16px', border: `2px solid ${COLORS.mistyBlue}33` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold' }}>Hole {hole.hole}</span>
                    <span style={{ color: COLORS.darkTeal, fontSize: '14px', marginLeft: '8px' }}>Par {hole.par ?? '—'} • {hole.yardage ?? '—'} yds</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.darkTeal }}>{hole.total}</div>
                    <div style={{ fontSize: '12px', color: COLORS.darkTeal }}>{formatScoreToPar(hole.total, hole.par)}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: COLORS.charcoal }}>
                  <div><strong>Tee result:</strong> {hole.drive === 'middle' ? '✨ Fairway' : hole.drive ? hole.drive.charAt(0).toUpperCase() + hole.drive.slice(1) : (hole.par === 3 && typeof hole.greenInRegulation === 'boolean' ? (hole.greenInRegulation ? 'Green' : 'Missed green') : typeof hole.fairwayHit === 'boolean' ? (hole.fairwayHit ? 'Fairway' : 'Missed fairway') : '—')}</div>
                  <div><strong>Putts:</strong> {hole.putts ?? '—'}</div>
                  <div><strong>Approaches:</strong> {hole.approaches ?? '—'}</div>
                  <div><strong>Chips:</strong> {hole.chips ?? '—'}</div>
                </div>
                {hole.notes && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '8px', fontStyle: 'italic', fontSize: '14px', color: COLORS.charcoal }}>"{hole.notes}"</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExportModal = ({ exportType, setExportType, startDate, endDate, setStartDate, setEndDate, onClose, onExport }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }} onClick={onClose}>
    <div className="csv-export-dialog" style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '500px', width: '100%', maxHeight: '90dvh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
      <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>📥 Export Data</h3>
      <p style={{ color: COLORS.charcoal, fontSize: '16px', marginBottom: '24px' }}>Export your round data to CSV. Leave dates empty to export all rounds.</p>
      <fieldset style={{ border: 0, padding: 0, margin: '0 0 24px', color: COLORS.darkTeal }}><legend style={{ fontWeight: 700, marginBottom: 14 }}>Choose your CSV</legend>
        <label style={{ display: 'block', marginBottom: 16 }}><input type="radio" name="csv-type" value="summary" checked={exportType === 'summary'} onChange={() => setExportType('summary')} /> Round Summary — one row per round</label>
        <label style={{ display: 'block' }}><input type="radio" name="csv-type" value="holes" checked={exportType === 'holes'} onChange={() => setExportType('holes')} /> Hole-by-Hole — one row per recorded hole</label>
      </fieldset>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px' }}>Start Date (optional)</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: '16px', border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '8px', fontFamily: 'inherit' }} />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px' }}>End Date (optional)</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: '16px', border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '8px', fontFamily: 'inherit' }} />
      </div>
      <div className="csv-export-actions" style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onClose} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 'bold', backgroundColor: COLORS.mistyBlue, color: COLORS.charcoal, border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
        <button onClick={onExport} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 'bold', backgroundColor: COLORS.darkTeal, color: COLORS.cream, border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Export CSV</button>
      </div>
    </div>
  </div>
);

export default StatsScreen;
