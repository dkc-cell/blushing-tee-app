import React, { useState } from 'react';
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
  
  const [highlight, setHighlight] = useState('');
  const [focusNextRound, setFocusNextRound] = useState('');
  
  const totalScore = currentRound.reduce((sum, hole) => sum + hole.total, 0);
  const totalPar = currentRound.reduce((sum, hole) => sum + hole.par, 0);
  const holesPlayed = currentRound.length;
  const scoreToPar = totalScore - totalPar;
  const fairwaysHit = currentRound.filter(h => h.fairwayHit && h.par > 3).length;
  const possibleFairways = currentRound.filter(h => h.par > 3).length;
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
    const hasReflection = highlight.trim() || focusNextRound.trim();

    // Save reflection if we have an id + at least one field filled out
    if (lastCompletedRoundId && onSaveReflection && hasReflection) {
      onSaveReflection(lastCompletedRoundId, {
        highlight: highlight.trim(),
        focusNextRound: focusNextRound.trim()
      });
    }

    if (typeof nextAction === 'function') nextAction();
  };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${COLORS.blush}33 0%, ${COLORS.cream} 50%, ${COLORS.mistyBlue}33 100%)`, padding: '32px 24px 80px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ color: COLORS.darkTeal, fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Round Complete!</h1>
        <p style={{ color: COLORS.mistyBlue, fontSize: '20px', margin: 0 }}>You played {holesPlayed} hole{holesPlayed > 1 ? 's' : ''} beautifully</p>
      </div>

      {/* Score Card */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '56px', fontWeight: 'bold', color: COLORS.blush, marginBottom: '8px' }}>{totalScore}</div>
          <div style={{ color: COLORS.darkTeal, fontSize: '20px' }}>
            {scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar === 0 ? 'Even' : scoreToPar}
            <span style={{ color: COLORS.mistyBlue, marginLeft: '8px' }}>(Par {totalPar})</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: `2px solid ${COLORS.mistyBlue}33` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.darkTeal, marginBottom: '4px' }}>
              {possibleFairways > 0 ? Math.round((fairwaysHit / possibleFairways) * 100) : 0}%
            </div>
            <div style={{ fontSize: '14px', color: COLORS.mistyBlue }}>Fairways Hit</div>
            <div style={{ fontSize: '12px', color: COLORS.darkTeal, marginTop: '4px' }}>{fairwaysHit}/{possibleFairways}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.darkTeal, marginBottom: '4px' }}>{threePuttPercentage}%</div>
            <div style={{ fontSize: '14px', color: COLORS.mistyBlue }}>3-Putt %</div>
            <div style={{ fontSize: '12px', color: COLORS.darkTeal, marginTop: '4px' }}>{threePuttCount} of {holesWithPutts.length} holes</div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div style={{ background: `linear-gradient(90deg, ${COLORS.blush}4D 0%, ${COLORS.mistyBlue}4D 100%)`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <p style={{ color: COLORS.darkTeal, fontSize: '20px', textAlign: 'center', fontStyle: 'italic', margin: 0 }}>
          "Every round is progress. Celebrate how far you've come! 🌸"
        </p>
      </div>
      {/* Round Reflection */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '8px' }}>
          🌸 Round Reflection
        </h3>
        <p style={{ color: COLORS.charcoal, fontSize: '16px', marginTop: 0, marginBottom: '16px' }}>
          Capture a win and one gentle focus for next round.
        </p>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>
            Highlight
          </label>
          <textarea
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            placeholder="Something that felt good today…"
            rows={2}
            maxLength={140}
            style={{ width: '100%', padding: '12px', fontSize: '16px', border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '12px', fontFamily: 'inherit', color: COLORS.charcoal, resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>
            Focus next round
          </label>
          <textarea
            value={focusNextRound}
            onChange={(e) => setFocusNextRound(e.target.value)}
            placeholder="One small thing to build on next time…"
            rows={2}
            maxLength={140}
            style={{ width: '100%', padding: '12px', fontSize: '16px', border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '12px', fontFamily: 'inherit', color: COLORS.charcoal, resize: 'vertical' }}
          />
        </div>
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
        <button
          onClick={() => handleFinish(onGoHome)}
          style={{ width: '100%', background: `linear-gradient(90deg, ${COLORS.blush} 0%, ${COLORS.blush}CC 100%)`, color: COLORS.charcoal, padding: '20px', borderRadius: '16px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          Back to Home
        </button>
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
