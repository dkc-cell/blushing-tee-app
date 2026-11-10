import BackButton from '../components/BackButton';
import './ScreenSpacing.css';
import React, { useState } from 'react';
import { getRoundPar } from '../utils';
import { COLORS } from '../constants';

const RoundCompleteScreen = ({
  currentRound,
  customPars,
  customYardages,
  onSaveCourse,
  lastCompletedRoundId,
  onSaveReflection,
  onGoHome,
  onNewRound
}) => {

  const [showSaveCourseModal, setShowSaveCourseModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  
  const [roundNotes, setRoundNotes] = useState('');
  
  const totalScore = currentRound.reduce((sum, hole) => sum + hole.total, 0);
  const totalPar = getRoundPar(currentRound);
  const holesPlayed = currentRound.length;
  const isFullRound = holesPlayed === 18;
  const scoreToPar = totalPar == null ? null : totalScore - totalPar;
  const fairwaysHit = currentRound.filter(h => h.fairwayHit && h.par > 3).length;
  const possibleFairways = currentRound.filter(h => h.par > 3 && typeof h.fairwayHit === 'boolean').length;
  const holesWithPutts = currentRound.filter(h => Number.isFinite(h?.putts));
  const threePuttCount = holesWithPutts.filter(h => h.putts >= 3).length;
  const threePuttPercentage = holesWithPutts.length > 0 ? Math.round((threePuttCount / holesWithPutts.length) * 100) : 0;
  
  const hasCustomCourseData = Object.keys(customPars).length > 0 || Object.keys(customYardages).length > 0;

  const handleSaveCourse = () => {
    if (!courseName.trim()) {
      alert('Please enter a course name');
      return;
    }
    onSaveCourse(courseName.trim(), customPars, customYardages);
    setShowSaveCourseModal(false);
    setCourseName('');
  };
  
  const handleFinish = (nextAction) => {
    if (lastCompletedRoundId && onSaveReflection && roundNotes.trim()) {
      onSaveReflection(lastCompletedRoundId, { roundNotes: roundNotes.trim() });
    }

    if (typeof nextAction === 'function') nextAction();
  };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${COLORS.blush}33 0%, ${COLORS.cream} 50%, ${COLORS.mistyBlue}33 100%)`, padding: '32px 24px 80px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>
          {isFullRound ? '🎉' : '⛳'}
        </div>
        <h1 style={{ color: COLORS.darkTeal, fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          {isFullRound ? 'Round Complete!' : 'Round Saved'}
        </h1>
        <p style={{ color: COLORS.darkTeal, fontSize: '20px', margin: 0 }}>
          {isFullRound
            ? 'You completed all 18 holes.'
            : `You saved a ${holesPlayed}-hole round.`}
        </p>
      </div>

      {/* Score Card */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '56px', fontWeight: 'bold', color: COLORS.darkTeal, marginBottom: '8px' }}>{totalScore}</div>
          <div style={{ color: COLORS.darkTeal, fontSize: '20px' }}>
            {scoreToPar == null ? '—' : scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar === 0 ? 'Even' : scoreToPar}
            {totalPar != null && <span style={{ color: COLORS.darkTeal, marginLeft: '8px' }}>(Par {totalPar})</span>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: `2px solid ${COLORS.mistyBlue}33` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.darkTeal, marginBottom: '4px' }}>
              {possibleFairways > 0 ? `${Math.round((fairwaysHit / possibleFairways) * 100)}%` : '—'}
            </div>
            <div style={{ fontSize: '14px', color: COLORS.darkTeal }}>Fairways Hit</div>
            <div style={{ fontSize: '12px', color: COLORS.darkTeal, marginTop: '4px' }}>{fairwaysHit}/{possibleFairways}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.darkTeal, marginBottom: '4px' }}>{holesWithPutts.length ? `${threePuttPercentage}%` : '—'}</div>
            <div style={{ fontSize: '14px', color: COLORS.darkTeal }}>3-Putt %</div>
            <div style={{ fontSize: '12px', color: COLORS.darkTeal, marginTop: '4px' }}>{threePuttCount} of {holesWithPutts.length} holes</div>
          </div>
        </div>
      </div>

      {/* Optional round notes */}
      <div className="round-notes" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <label htmlFor="round-notes" style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginBottom: '12px' }}>Round Notes</label>
        <textarea
          id="round-notes"
          value={roundNotes}
          onChange={(e) => setRoundNotes(e.target.value)}
          placeholder="Add notes, a highlight, or something you’d like to work on next round."
          rows={4}
          maxLength={2000}
          style={{ boxSizing: 'border-box', width: '100%', padding: '12px', fontSize: '16px', border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '12px', fontFamily: 'inherit', color: COLORS.charcoal, resize: 'vertical' }}
        />
      </div>

      {/* Save Course Option */}
      {hasCustomCourseData && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '12px' }}>
            💾 Save This Course
          </h3>
          <p style={{ color: COLORS.charcoal, fontSize: '16px', marginBottom: '16px' }}>
            You customized par and yardage for this round. Would you like to save this course for future rounds?
          </p>
          <button
            onClick={() => setShowSaveCourseModal(true)}
            style={{ width: '100%', padding: '16px', backgroundColor: COLORS.darkTeal, color: COLORS.cream, border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            Save Course to Favorites
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <BackButton onClick={() => handleFinish(onGoHome)} fullWidth>Back to Home</BackButton>
        <button
          onClick={() => handleFinish(onNewRound)}
          style={{ width: '100%', backgroundColor: `${COLORS.mistyBlue}4D`, color: COLORS.darkTeal, padding: '16px', borderRadius: '16px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Start New Round
        </button>
      </div>

      {/* Save Course Modal */}
      {showSaveCourseModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }} onClick={() => setShowSaveCourseModal(false)}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '500px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px', textAlign: 'center' }}>💾 Save Course</h3>
            <p style={{ color: COLORS.charcoal, fontSize: '16px', marginBottom: '24px', textAlign: 'center' }}>Give this course a name to save it for future rounds</p>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g., Pine Valley Golf Club"
              maxLength={50}
              style={{ width: '100%', padding: '16px', fontSize: '18px', border: `3px solid ${COLORS.mistyBlue}`, borderRadius: '12px', marginBottom: '24px', fontFamily: 'inherit', color: COLORS.charcoal }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowSaveCourseModal(false)} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 'bold', backgroundColor: COLORS.mistyBlue, color: COLORS.charcoal, border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveCourse} disabled={!courseName.trim()} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 'bold', backgroundColor: courseName.trim() ? COLORS.blush : '#E0E0E0', color: COLORS.charcoal, border: 'none', borderRadius: '12px', cursor: courseName.trim() ? 'pointer' : 'not-allowed', opacity: courseName.trim() ? 1 : 0.5 }}>Save Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundCompleteScreen;
