import React, { useState } from 'react';
import { COLORS } from '../constants';
import { calcStats, formatDateForDisplay, formatScoreToPar, exportToCSV, downloadCSV } from '../utils';

const StatsScreen = ({ 
  rounds, 
  onBack,
  onUpdateRound,
  onDeleteRound 
}) => {
  const [selectedRound, setSelectedRound] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [isEditingRound, setIsEditingRound] = useState(false);
  const [editRoundDate, setEditRoundDate] = useState('');
  const [editRoundCourse, setEditRoundCourse] = useState('');

  const currentYear = new Date().getFullYear();
  const ytdRounds = rounds.filter(r => new Date(r.date).getFullYear() === currentYear);
  const allHoles = rounds.flatMap(r => r.holes);
  const ytdHoles = ytdRounds.flatMap(r => r.holes);
  
  const allTimeStats = calcStats(allHoles);
  const ytdStats = calcStats(ytdHoles);

  const handleExport = () => {
    const csvContent = exportToCSV(rounds, exportStartDate || null, exportEndDate || null);
    if (!csvContent) {
      alert('No rounds found in the selected date range.');
      return;
    }
    downloadCSV(csvContent, `blushing-tee-stats-${new Date().toISOString().slice(0, 10)}.csv`);
    setShowExportModal(false);
    setExportStartDate('');
    setExportEndDate('');
    alert('CSV file downloaded successfully!');
  };

  const startEditingRound = () => {
    setEditRoundDate(selectedRound.date);
    setEditRoundCourse(selectedRound.courseName || '');
    setIsEditingRound(true);
  };

  const saveRoundMetadata = () => {
    if (!editRoundCourse.trim()) {
      alert('Please enter a course name');
      return;
    }
    onUpdateRound(selectedRound.id, {
      date: editRoundDate,
      courseName: editRoundCourse.trim()
    });
    setSelectedRound({ ...selectedRound, date: editRoundDate, courseName: editRoundCourse.trim() });
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
      <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: COLORS.darkTeal, fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px' }}>← Back</button>
        <h2 style={{ color: COLORS.darkTeal, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Your Stats</h2>
        <p style={{ color: COLORS.charcoal, fontSize: '18px', margin: '4px 0 0 0' }}>Track your progress over time</p>
      </div>
      
      <div style={{ padding: '0 24px' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.blush}33 0%, #FFFFFF 100%)`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.darkTeal }}>{rounds.length}</div>
            <div style={{ color: COLORS.charcoal, fontSize: '16px', fontWeight: '600' }}>Total Rounds</div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.mistyBlue}33 0%, #FFFFFF 100%)`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.darkTeal }}>{ytdRounds.length}</div>
            <div style={{ color: COLORS.charcoal, fontSize: '16px', fontWeight: '600' }}>Rounds in {currentYear}</div>
          </div>
        </div>
        
        {rounds.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏌️‍♀️</div>
            <p style={{ color: COLORS.charcoal }}>No rounds logged yet. Start your first round to see your stats!</p>
          </div>
        ) : (
          <>
            {/* YTD Stats */}
            {ytdStats && <StatsCard title={`📊 ${currentYear} Year-to-Date`} stats={ytdStats} />}
            
            {/* All-Time Stats */}
            {allTimeStats && <StatsCard title="🌟 All-Time Statistics" stats={allTimeStats} totalHoles={allHoles.length} />}
            
            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              style={{ width: '100%', backgroundColor: COLORS.darkTeal, color: COLORS.cream, padding: '16px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '24px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
            >
              📥 Export Data to CSV
            </button>
            
            {/* Round History */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '16px' }}>📅 Round History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...rounds].reverse().map((round) => {
                  const roundScore = round.holes.reduce((sum, h) => sum + h.total, 0);
                  const roundPar = round.holes.reduce((sum, h) => sum + h.par, 0);
                  
                  return (
                    <button
                      key={round.id}
                      onClick={() => setSelectedRound(round)}
                      style={{ width: '100%', backgroundColor: COLORS.cream, border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '12px', padding: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {formatDateForDisplay(round.date)}
                          </div>
                          <div style={{ color: COLORS.charcoal, fontSize: '16px', fontWeight: '600' }}>
                            {round.courseName || 'Unnamed Course'} • {round.holes.length} holes
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.blush }}>{roundScore}</div>
                          <div style={{ fontSize: '14px', color: COLORS.mistyBlue }}>{formatScoreToPar(roundScore, roundPar)}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Round Detail Modal */}
      {selectedRound && (
        <RoundDetailModal
          round={selectedRound}
          isEditing={isEditingRound}
          editDate={editRoundDate}
          editCourse={editRoundCourse}
          setEditDate={setEditRoundDate}
          setEditCourse={setEditRoundCourse}
          onClose={() => { setSelectedRound(null); setIsEditingRound(false); }}
          onStartEdit={startEditingRound}
          onSaveEdit={saveRoundMetadata}
          onCancelEdit={() => setIsEditingRound(false)}
          onDelete={handleDeleteRound}
        />
      )}
      
      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
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
    <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '16px' }}>{title}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <StatItem label="Avg Score/Hole" value={stats.avgScore} variant="blush" />
      <StatItem label="Avg Putts/Hole" value={stats.avgPutts} variant="misty" />
      <StatItem label="Fairways Hit" value={`${stats.fairwayPct}%`} variant="blush" />
      <StatItem label={totalHoles ? "Total Holes" : "Score to Par"} value={totalHoles || (stats.scoreToPar > 0 ? `+${stats.scoreToPar}` : stats.scoreToPar)} variant="misty" />
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

const RoundDetailModal = ({ round, isEditing, editDate, editCourse, setEditDate, setEditCourse, onClose, onStartEdit, onSaveEdit, onCancelEdit, onDelete }) => {
  const totalScore = round.holes.reduce((sum, h) => sum + h.total, 0);
  const totalPar = round.holes.reduce((sum, h) => sum + h.par, 0);
  const totalPutts = round.holes.reduce((sum, h) => sum + h.putts, 0);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px', overflowY: 'auto' }} onClick={onClose}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF', padding: '24px', borderBottom: `2px solid ${COLORS.mistyBlue}33`, borderRadius: '24px 24px 0 0' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: COLORS.charcoal }}>✕</button>
          
          {!isEditing ? (
            <>
              <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{formatDateForDisplay(round.date)}</h3>
              <p style={{ color: COLORS.mistyBlue, fontSize: '16px', margin: '0 0 16px 0' }}>{round.courseName || 'Unnamed Course'}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={onStartEdit} style={{ flex: 1, padding: '10px 16px', backgroundColor: COLORS.mistyBlue, color: COLORS.charcoal, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>✏️ Edit Info</button>
                <button onClick={onDelete} style={{ flex: 1, padding: '10px 16px', backgroundColor: '#FF6B6B', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>🗑️ Delete Round</button>
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
          
          {/* Hole Breakdown */}
          <h4 style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Hole-by-Hole Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {round.holes.map(hole => (
              <div key={hole.hole} style={{ backgroundColor: COLORS.cream, borderRadius: '12px', padding: '16px', border: `2px solid ${COLORS.mistyBlue}33` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold' }}>Hole {hole.hole}</span>
                    <span style={{ color: COLORS.mistyBlue, fontSize: '14px', marginLeft: '8px' }}>Par {hole.par} • {hole.yardage} yds</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.blush }}>{hole.total}</div>
                    <div style={{ fontSize: '12px', color: COLORS.mistyBlue }}>{formatScoreToPar(hole.total, hole.par)}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: COLORS.charcoal }}>
                  <div><strong>Drive:</strong> {hole.drive === 'middle' ? '✨ Fairway' : hole.drive.charAt(0).toUpperCase() + hole.drive.slice(1)}</div>
                  <div><strong>Putts:</strong> {hole.putts}</div>
                  <div><strong>Approaches:</strong> {hole.approaches}</div>
                  <div><strong>Chips:</strong> {hole.chips}</div>
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

const ExportModal = ({ startDate, endDate, setStartDate, setEndDate, onClose, onExport }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }} onClick={onClose}>
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '500px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
      <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>📥 Export Data</h3>
      <p style={{ color: COLORS.charcoal, fontSize: '16px', marginBottom: '24px' }}>Export your round data to CSV. Leave dates empty to export all rounds.</p>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px' }}>Start Date (optional)</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: '16px', border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '8px', fontFamily: 'inherit' }} />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px' }}>End Date (optional)</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: '16px', border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '8px', fontFamily: 'inherit' }} />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onClose} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 'bold', backgroundColor: COLORS.mistyBlue, color: COLORS.charcoal, border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
        <button onClick={onExport} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 'bold', backgroundColor: COLORS.darkTeal, color: COLORS.cream, border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Export CSV</button>
      </div>
    </div>
  </div>
);

export default StatsScreen;
