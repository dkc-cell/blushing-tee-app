import React, { useState } from 'react';
import { COLORS } from '../constants';
import HomeScreen from './HomeScreen';

export default function HomeScreenResume({ activeRound, onResumeRound, onEndRoundEarly, ...props }) {
  const [showEndPrompt, setShowEndPrompt] = useState(false);

  if (!activeRound) return <HomeScreen {...props} />;

  const previousHole = Math.max(1, activeRound.currentHole - 1);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: COLORS.cream }}>
      <div style={{
        background: '#FFFFFF',
        borderBottom: `1px solid ${COLORS.mistyBlue}66`,
        padding: '14px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ color: COLORS.darkTeal, fontWeight: 800, fontSize: '18px', marginBottom: '3px' }}>
            Round in Progress
          </div>
          <div style={{ color: COLORS.charcoal, fontSize: '15px', marginBottom: '2px' }}>
            {activeRound.courseName} · Hole {activeRound.currentHole}
          </div>
          <div style={{ color: '#5f6f73', fontSize: '14px', marginBottom: '12px' }}>
            {activeRound.holesRecorded} hole{activeRound.holesRecorded === 1 ? '' : 's'} recorded
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={onResumeRound} style={{
              padding: '12px 10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: COLORS.darkTeal, color: COLORS.cream, fontWeight: 800, fontSize: '15px'
            }}>Resume Round</button>
            <button onClick={() => setShowEndPrompt(true)} style={{
              padding: '12px 10px', borderRadius: '12px', cursor: 'pointer',
              background: '#FFFFFF', color: COLORS.darkTeal, fontWeight: 800, fontSize: '15px',
              border: `2px solid ${COLORS.mistyBlue}`
            }}>End Round Early</button>
          </div>
        </div>
      </div>

      <HomeScreen {...props} />

      {showEndPrompt && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 20000, background: 'rgba(16,62,67,0.38)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }}>
          <div style={{
            width: '100%', maxWidth: '420px', background: '#FFFFFF', borderRadius: '20px',
            padding: '24px', boxShadow: '0 18px 50px rgba(0,0,0,0.22)'
          }}>
            <h3 style={{ margin: '0 0 8px', color: COLORS.darkTeal, fontSize: '22px' }}>
              Hole {activeRound.currentHole} isn't finished
            </h3>
            <p style={{ margin: '0 0 20px', color: COLORS.charcoal, lineHeight: 1.5 }}>
              Would you like to finish recording Hole {activeRound.currentHole} or end your round at Hole {previousHole}?
            </p>
            <button onClick={() => { setShowEndPrompt(false); onResumeRound(); }} style={{
              width: '100%', padding: '13px 14px', borderRadius: '12px', border: 'none',
              background: COLORS.darkTeal, color: COLORS.cream, fontWeight: 800, fontSize: '16px', cursor: 'pointer', marginBottom: '10px'
            }}>
              Finish Recording Hole {activeRound.currentHole}
            </button>
            <button onClick={() => { setShowEndPrompt(false); onEndRoundEarly(); }} style={{
              width: '100%', padding: '13px 14px', borderRadius: '12px',
              border: `2px solid ${COLORS.mistyBlue}`, background: '#FFFFFF', color: COLORS.darkTeal,
              fontWeight: 800, fontSize: '16px', cursor: 'pointer', marginBottom: '10px'
            }}>
              End Round at Hole {previousHole}
            </button>
            <button onClick={() => setShowEndPrompt(false)} style={{
              width: '100%', padding: '10px', border: 'none', background: 'transparent',
              color: '#5f6f73', fontWeight: 600, cursor: 'pointer'
            }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
