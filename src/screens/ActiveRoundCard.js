import React from 'react';
import { COLORS } from '../constants';

export default function ActiveRoundCard({ courseName, currentHole, holesRecorded, onResume, onEndEarly }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '18px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${COLORS.mistyBlue}66` }}>
      <div style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>Round in Progress</div>
      <div style={{ color: COLORS.charcoal, fontSize: '15px' }}>{courseName} · Hole {currentHole}</div>
      <div style={{ color: COLORS.darkTeal, opacity: 0.75, fontSize: '13px', marginTop: '3px', marginBottom: '14px' }}>{holesRecorded} hole{holesRecorded === 1 ? '' : 's'} recorded</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={onResume} style={{ border: 'none', borderRadius: '12px', padding: '12px 8px', background: COLORS.darkTeal, color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer' }}>Resume Round</button>
        <button onClick={onEndEarly} style={{ border: `2px solid ${COLORS.mistyBlue}`, borderRadius: '12px', padding: '10px 8px', background: '#FFFFFF', color: COLORS.darkTeal, fontWeight: 'bold', cursor: 'pointer' }}>End Round Early</button>
      </div>
    </div>
  );
}
