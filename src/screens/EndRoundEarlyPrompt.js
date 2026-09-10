import React from 'react';
import { COLORS } from '../constants';

export default function EndRoundEarlyPrompt({ currentHole, onFinishHole, onEndPreviousHole, onCancel }) {
  const previousHole = Math.max(1, currentHole - 1);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 20000, background: 'rgba(16,62,67,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 18px 50px rgba(0,0,0,0.22)' }}>
        <h3 style={{ margin: '0 0 8px', color: COLORS.darkTeal, fontSize: '22px' }}>Hole {currentHole} isn't finished</h3>
        <p style={{ margin: '0 0 20px', color: COLORS.charcoal, lineHeight: 1.5 }}>Would you like to finish recording Hole {currentHole} or end your round at Hole {previousHole}?</p>
        <button onClick={onFinishHole} style={{ width: '100%', padding: '13px 14px', borderRadius: '12px', border: 'none', background: COLORS.darkTeal, color: '#FFFFFF', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' }}>Finish Recording Hole {currentHole}</button>
        <button onClick={onEndPreviousHole} style={{ width: '100%', padding: '13px 14px', borderRadius: '12px', border: `2px solid ${COLORS.mistyBlue}`, background: '#FFFFFF', color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' }}>End Round at Hole {previousHole}</button>
        <button onClick={onCancel} style={{ width: '100%', padding: '10px', border: 'none', background: 'transparent', color: '#5f6f73', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
}
