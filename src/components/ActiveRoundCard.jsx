import React, { useState } from 'react';
import { COLORS } from '../constants';
import { isHoleDraftMeaningful, loadActiveRound } from '../utils/activeRoundStorage';

const ActiveRoundCard = ({ activeRound, onResume, onEndRoundEarly }) => {
  const [showEndModal, setShowEndModal] = useState(false);

  if (!activeRound) return null;

  const currentHole = Number(activeRound.currentHole) || 1;
  const holesRecorded = Array.isArray(activeRound.currentRound)
    ? activeRound.currentRound.length
    : 0;
  const latestSavedRound = loadActiveRound();
  const latestDraft = latestSavedRound?.currentHole === currentHole
    ? latestSavedRound.holeDraft
    : activeRound.holeDraft;
  const hasDraft = isHoleDraftMeaningful(latestDraft);
  const lastRecordedHole = Math.max(0, currentHole - 1);

  const finishLabel = `Finish Recording Hole ${currentHole}`;
  const endLabel = `End Round at Hole ${lastRecordedHole}`;

  const handleEndClick = () => {
    if (holesRecorded === 0) {
      alert('Please log at least one hole before ending the round.');
      return;
    }

    if (hasDraft) {
      setShowEndModal(true);
      return;
    }

    const confirmed = window.confirm(
      `End this round now? You have logged ${holesRecorded} hole${holesRecorded === 1 ? '' : 's'}. Unplayed holes will not be included in your stats.`
    );

    if (confirmed) onEndRoundEarly();
  };

  return (
    <>
      <div
        style={{
          background: '#FFFFFF',
          border: `2px solid ${COLORS.mistyBlue}`,
          borderRadius: '18px',
          padding: '18px',
          marginBottom: '18px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>
          Round in Progress
        </div>
        <div style={{ color: COLORS.charcoal, fontSize: '15px', marginBottom: '3px' }}>
          {(activeRound.courseName || 'Current round')} · Hole {currentHole}
        </div>
        <div style={{ color: COLORS.darkTeal, opacity: 0.78, fontSize: '14px', marginBottom: '14px' }}>
          {holesRecorded} hole{holesRecorded === 1 ? '' : 's'} recorded
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={onResume}
            style={{
              flex: '1 1 150px',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 14px',
              backgroundColor: COLORS.blush,
              color: COLORS.charcoal,
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Resume Round
          </button>
          <button
            onClick={handleEndClick}
            style={{
              flex: '1 1 150px',
              border: `2px solid ${COLORS.mistyBlue}`,
              borderRadius: '12px',
              padding: '10px 14px',
              backgroundColor: '#FFFFFF',
              color: COLORS.darkTeal,
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            End Round Early
          </button>
        </div>
      </div>

      {showEndModal && (
        <div
          onClick={() => setShowEndModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 5000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '22px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
            }}
          >
            <div style={{ color: COLORS.darkTeal, fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>
              Hole {currentHole} isn't finished
            </div>
            <div style={{ color: COLORS.charcoal, fontSize: '16px', lineHeight: 1.45, marginBottom: '18px' }}>
              You have information entered for Hole {currentHole}. Would you like to finish recording it or end your round after Hole {lastRecordedHole}?
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowEndModal(false);
                  onResume();
                }}
                style={{
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px 14px',
                  backgroundColor: COLORS.blush,
                  color: COLORS.charcoal,
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                {finishLabel}
              </button>
              <button
                onClick={() => {
                  setShowEndModal(false);
                  onEndRoundEarly();
                }}
                style={{
                  border: `2px solid ${COLORS.mistyBlue}`,
                  borderRadius: '12px',
                  padding: '11px 14px',
                  backgroundColor: '#FFFFFF',
                  color: COLORS.darkTeal,
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                {endLabel}
              </button>
              <button
                onClick={() => setShowEndModal(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: COLORS.darkTeal,
                  padding: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActiveRoundCard;
