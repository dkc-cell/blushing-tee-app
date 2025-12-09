import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { COLORS } from '../constants';
import { NumberPad } from '../components';

const CreateCourseScreen = ({
  initialCourse = null,
  onSave,
  onBack
}) => {
  const isEditing = initialCourse !== null;
  
  const [courseName, setCourseName] = useState(initialCourse?.name || '');
  const [pars, setPars] = useState(initialCourse?.pars || {});
  const [yardages, setYardages] = useState(initialCourse?.yardages || {});
  const [showYardageModalForHole, setShowYardageModalForHole] = useState(null);
  const [tempYardage, setTempYardage] = useState('');

  // Calculate yardage totals
  const front9Yardage = [1,2,3,4,5,6,7,8,9].reduce((sum, hole) => sum + (yardages[hole] || 0), 0);
  const back9Yardage = [10,11,12,13,14,15,16,17,18].reduce((sum, hole) => sum + (yardages[hole] || 0), 0);
  const totalYardage = front9Yardage + back9Yardage;

  const handleSave = () => {
    if (!courseName.trim()) {
      alert('Please enter a course name before saving');
      return;
    }
    onSave({
      id: initialCourse?.id,
      name: courseName.trim(),
      pars,
      yardages
    });
  };

  const renderHoleRow = (hole) => {
    const currentPar = pars[hole] || null;
    const currentYardage = yardages[hole] || null;
    
    return (
      <div 
        key={hole}
        style={{ 
          display: 'grid',
          gridTemplateColumns: '60px 1fr 1fr',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '12px',
          padding: '12px',
          backgroundColor: COLORS.cream,
          borderRadius: '12px'
        }}
      >
        <div style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          #{hole}
        </div>
        
        {/* Par Selection */}
        <div>
          <div style={{ fontSize: '12px', color: COLORS.mistyBlue, marginBottom: '4px', fontWeight: '600' }}>Par</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[3, 4, 5].map(par => (
              <button
                key={par}
                onClick={() => setPars({...pars, [hole]: par})}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: currentPar === par ? COLORS.blush : '#FFFFFF',
                  color: COLORS.charcoal,
                  border: `2px solid ${currentPar === par ? COLORS.blush : COLORS.mistyBlue}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {par}
              </button>
            ))}
          </div>
        </div>
        
        {/* Yardage */}
        <div>
          <div style={{ fontSize: '12px', color: COLORS.mistyBlue, marginBottom: '4px', fontWeight: '600' }}>Yardage</div>
          <button
            onClick={() => {
              setShowYardageModalForHole(hole);
              setTempYardage(currentYardage ? currentYardage.toString() : '');
            }}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: `2px solid ${COLORS.mistyBlue}`,
              borderRadius: '8px',
              backgroundColor: currentYardage ? '#FFFFFF' : COLORS.cream,
              color: COLORS.charcoal,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            {currentYardage ? `${currentYardage} yds` : 'Set yds'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: COLORS.darkTeal, fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}
        >
          ← Back
        </button>
        
        <h2 style={{ color: COLORS.darkTeal, fontSize: '28px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
          {isEditing ? 'Edit Course' : 'Create New Course'}
        </h2>
        
        <div style={{ marginBottom: '0' }}>
          <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
            Course Name
          </label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g., Pine Valley Golf Club"
            maxLength={50}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: `3px solid ${COLORS.mistyBlue}`,
              borderRadius: '12px',
              fontFamily: 'inherit',
              color: COLORS.charcoal
            }}
          />
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Tip */}
        <div style={{ background: `linear-gradient(90deg, ${COLORS.blush}33 0%, ${COLORS.mistyBlue}33 100%)`, padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
          <p style={{ color: COLORS.darkTeal, fontSize: '16px', textAlign: 'center', fontWeight: '500', margin: 0 }}>
            Set the par and yardage for each hole below 💚
          </p>
        </div>

        {/* Front 9 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>
            Front 9
          </h3>
          {[1,2,3,4,5,6,7,8,9].map(renderHoleRow)}
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: `${COLORS.mistyBlue}33`, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: COLORS.darkTeal, fontSize: '16px', fontWeight: 'bold' }}>Front 9 Total:</span>
            <span style={{ color: COLORS.blush, fontSize: '20px', fontWeight: 'bold' }}>{front9Yardage} yds</span>
          </div>
        </div>

        {/* Back 9 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>
            Back 9
          </h3>
          {[10,11,12,13,14,15,16,17,18].map(renderHoleRow)}
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: `${COLORS.mistyBlue}33`, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: COLORS.darkTeal, fontSize: '16px', fontWeight: 'bold' }}>Back 9 Total:</span>
            <span style={{ color: COLORS.blush, fontSize: '20px', fontWeight: 'bold' }}>{back9Yardage} yds</span>
          </div>
        </div>

        {/* Total Yardage */}
        <div style={{ backgroundColor: COLORS.darkTeal, borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: COLORS.cream, fontSize: '20px', fontWeight: 'bold' }}>Total Course Yardage:</span>
            <span style={{ color: COLORS.blush, fontSize: '28px', fontWeight: 'bold' }}>{totalYardage} yds</span>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!courseName.trim()}
          style={{
            width: '100%',
            backgroundColor: courseName.trim() ? COLORS.blush : '#E0E0E0',
            color: COLORS.charcoal,
            padding: '20px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: courseName.trim() ? 'pointer' : 'not-allowed',
            opacity: courseName.trim() ? 1 : 0.7,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <CheckCircle2 style={{ width: '24px', height: '24px' }} />
          {isEditing ? 'Update Course' : 'Save Course'}
        </button>
      </div>

      {/* Yardage Modal */}
      {showYardageModalForHole !== null && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}
          onClick={() => { setShowYardageModalForHole(null); setTempYardage(''); }}
        >
          <div 
            style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '400px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '24px 24px 0 24px' }}>
              <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px', textAlign: 'center' }}>
                Yardage for Hole {showYardageModalForHole}
              </h3>
            </div>
            <NumberPad
              value={tempYardage}
              onNumberClick={(num) => {
                if (tempYardage.length < 3) {
                  setTempYardage(tempYardage + num);
                }
              }}
              onBackspace={() => setTempYardage(tempYardage.slice(0, -1))}
              onClear={() => setTempYardage('')}
              onDone={() => {
                const yards = parseInt(tempYardage);
                if (yards >= 50 && yards <= 700) {
                  setYardages({...yardages, [showYardageModalForHole]: yards});
                  setShowYardageModalForHole(null);
                  setTempYardage('');
                } else {
                  alert('Please enter a yardage between 50 and 700');
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourseScreen;
