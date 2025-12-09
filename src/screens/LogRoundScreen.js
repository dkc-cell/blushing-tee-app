import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { COLORS, ENCOURAGING_QUOTES } from '../constants';
import { NumberPad, QuickCounter } from '../components';

const LogRoundScreen = ({
  currentHole,
  setCurrentHole,
  customPars,
  setCustomPars,
  customYardages,
  setCustomYardages,
  currentRound,
  recordedHoles,
  onRecordHole,
  onUnrecordHole,
  onCompleteRound,
  onBack
}) => {
  // Local state for current hole input
  const [drive, setDrive] = useState('');
  const [approaches, setApproaches] = useState(0);
  const [chips, setChips] = useState(0);
  const [putts, setPutts] = useState(0);
  const [penalties, setPenalties] = useState({ water: 0, lost: 0, ob: 0 });
  const [holeNotes, setHoleNotes] = useState('');
  const [editingHole, setEditingHole] = useState(false);
  
  // Modal state
  const [showParModal, setShowParModal] = useState(false);
  const [showYardageModal, setShowYardageModal] = useState(false);
  const [tempYardage, setTempYardage] = useState('');

  const randomQuote = ENCOURAGING_QUOTES[currentHole % ENCOURAGING_QUOTES.length];
  const isHoleRecorded = recordedHoles.has(currentHole);
  const recordedData = currentRound.find(h => h.hole === currentHole);

  const getCurrentPar = () => customPars[currentHole] || null;
  const getCurrentYardage = () => customYardages[currentHole] || null;
  const needsHoleSetup = () => getCurrentPar() === null || getCurrentYardage() === null;

  const totalShots = (drive ? 1 : 0) + approaches + chips + putts;
  const totalWithPenalties = totalShots + penalties.water + penalties.lost + penalties.ob;

  const resetInputs = () => {
    setDrive('');
    setApproaches(0);
    setChips(0);
    setPutts(0);
    setPenalties({ water: 0, lost: 0, ob: 0 });
    setHoleNotes('');
  };

  const completeHole = () => {
    const newHoleData = {
      hole: currentHole,
      par: getCurrentPar(),
      yardage: getCurrentYardage(),
      drive,
      approaches,
      chips,
      putts,
      penalties,
      total: totalWithPenalties,
      notes: holeNotes,
      fairwayHit: drive === 'middle'
    };
    
    onRecordHole(newHoleData);
    setEditingHole(false);
    resetInputs();
    
    setTimeout(() => {
      if (currentHole < 18) {
        setCurrentHole(currentHole + 1);
      } else {
        onCompleteRound(newHoleData);
      }
    }, 800);
  };

  const enableEditHole = () => {
    if (recordedData) {
      setDrive(recordedData.drive);
      setApproaches(recordedData.approaches);
      setChips(recordedData.chips);
      setPutts(recordedData.putts);
      setPenalties(recordedData.penalties);
      setHoleNotes(recordedData.notes || '');
      setEditingHole(true);
      onUnrecordHole(currentHole);
    }
  };

  // SETUP MODE - Show when par/yardage not set
  if (needsHoleSetup() && !isHoleRecorded) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '160px' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <button 
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: COLORS.darkTeal, fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}
          >
            ← Back to Home
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{ color: COLORS.darkTeal, fontSize: '32px', fontWeight: 'bold', margin: 0 }}>Hole {currentHole}</h2>
              <p style={{ color: COLORS.mistyBlue, fontSize: '16px', margin: '4px 0 0 0' }}>Set up this hole</p>
            </div>
            <button
              onClick={() => onCompleteRound(null)}
              style={{
                backgroundColor: `${COLORS.mistyBlue}4D`,
                color: COLORS.darkTeal,
                padding: '8px 16px',
                borderRadius: '999px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              End Round Early
            </button>
          </div>
        </div>

        {/* Quote */}
        <div style={{ background: `linear-gradient(90deg, ${COLORS.blush}33 0%, ${COLORS.mistyBlue}33 100%)`, margin: '24px', padding: '20px', borderRadius: '16px' }}>
          <p style={{ color: COLORS.darkTeal, fontSize: '20px', textAlign: 'center', fontStyle: 'italic', fontWeight: '500', margin: 0 }}>
            {randomQuote}
          </p>
        </div>

        {/* Setup Form */}
        <div style={{ padding: '0 24px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', marginBottom: '24px' }}>
            <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '24px', textAlign: 'center' }}>
              ⛳ Set Up Hole {currentHole}
            </h3>
            
            {/* Par Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ color: COLORS.charcoal, fontSize: '20px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
                What's the par for this hole?
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                {[3, 4, 5].map(par => (
                  <button
                    key={par}
                    onClick={() => setCustomPars({...customPars, [currentHole]: par})}
                    style={{
                      flex: 1,
                      padding: '24px 20px',
                      fontSize: '36px',
                      fontWeight: 'bold',
                      backgroundColor: getCurrentPar() === par ? COLORS.blush : COLORS.cream,
                      color: COLORS.charcoal,
                      border: `4px solid ${getCurrentPar() === par ? COLORS.blush : COLORS.mistyBlue}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {par}
                  </button>
                ))}
              </div>
              {getCurrentPar() && (
                <p style={{ color: COLORS.mistyBlue, fontSize: '14px', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
                  Par {getCurrentPar()} selected ✓
                </p>
              )}
            </div>
            
            {/* Yardage Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: COLORS.charcoal, fontSize: '20px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
                What's the yardage?
              </label>
              <button
                onClick={() => {
                  setTempYardage(getCurrentYardage() ? getCurrentYardage().toString() : '');
                  setShowYardageModal(true);
                }}
                style={{
                  width: '100%',
                  padding: '20px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  backgroundColor: getCurrentYardage() ? COLORS.mistyBlue : COLORS.cream,
                  color: COLORS.charcoal,
                  border: `4px solid ${COLORS.mistyBlue}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
              >
                {getCurrentYardage() ? `${getCurrentYardage()} yards` : 'Tap to enter yardage'}
              </button>
            </div>
            
            {/* Ready message */}
            {getCurrentPar() && getCurrentYardage() && (
              <div style={{ 
                backgroundColor: `${COLORS.blush}33`, 
                padding: '16px', 
                borderRadius: '12px', 
                textAlign: 'center',
                marginTop: '16px'
              }}>
                <p style={{ color: COLORS.darkTeal, fontSize: '16px', fontWeight: '600', margin: 0 }}>
                  ✨ All set! You can now score this hole.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <HoleNavigation 
          currentHole={currentHole} 
          setCurrentHole={setCurrentHole} 
        />

        {/* Yardage Modal */}
        {showYardageModal && (
          <YardageModal
            currentHole={currentHole}
            tempYardage={tempYardage}
            setTempYardage={setTempYardage}
            onClose={() => {
              setShowYardageModal(false);
              setTempYardage('');
            }}
            onSave={(yards) => {
              setCustomYardages({...customYardages, [currentHole]: yards});
              setShowYardageModal(false);
              setTempYardage('');
            }}
          />
        )}
      </div>
    );
  }

  // SCORING MODE - Normal scoring UI
  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '160px' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: COLORS.darkTeal, fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}
        >
          ← Back to Home
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
          <div>
            <h2 style={{ color: COLORS.darkTeal, fontSize: '32px', fontWeight: 'bold', margin: 0 }}>Hole {currentHole}</h2>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <button
                onClick={() => setShowParModal(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: COLORS.blush,
                  color: COLORS.charcoal,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                Par {getCurrentPar()}
              </button>
              <button
                onClick={() => {
                  setTempYardage(getCurrentYardage() ? getCurrentYardage().toString() : '');
                  setShowYardageModal(true);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: COLORS.mistyBlue,
                  color: COLORS.charcoal,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                {getCurrentYardage()} yds
              </button>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {totalShots > 0 && (
              <div style={{ backgroundColor: `${COLORS.blush}33`, padding: '12px 20px', borderRadius: '999px', marginBottom: '8px' }}>
                <span style={{ color: COLORS.darkTeal, fontSize: '32px', fontWeight: 'bold' }}>{totalWithPenalties}</span>
              </div>
            )}
            <button
              onClick={() => onCompleteRound(null)}
              style={{
                backgroundColor: `${COLORS.mistyBlue}4D`,
                color: COLORS.darkTeal,
                padding: '8px 16px',
                borderRadius: '999px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              End Round Early
            </button>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div style={{ background: `linear-gradient(90deg, ${COLORS.blush}33 0%, ${COLORS.mistyBlue}33 100%)`, margin: '24px', padding: '20px', borderRadius: '16px' }}>
        <p style={{ color: COLORS.darkTeal, fontSize: '20px', textAlign: 'center', fontStyle: 'italic', fontWeight: '500', margin: 0 }}>
          {randomQuote}
        </p>
      </div>

      {/* Hole Recap (if recorded) */}
      {isHoleRecorded && recordedData && !editingHole && (
        <HoleRecap 
          recordedData={recordedData} 
          onEdit={enableEditHole} 
        />
      )}

      {/* Scoring Inputs */}
      <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Drive */}
        <div>
          <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
            Drive
          </label>
          <DriveSelector drive={drive} setDrive={setDrive} />
        </div>

        {/* Approach Shots */}
        <div>
          <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
            Approach Shots
          </label>
          <QuickCounter value={approaches} onChange={setApproaches} max={5} type="approach" />
        </div>

        {/* Chip/Pitch Shots */}
        <div>
          <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
            Chip/Pitch Shots
          </label>
          <QuickCounter value={chips} onChange={setChips} max={5} type="chip" />
        </div>

        {/* Putts */}
        <div>
          <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
            Putts
          </label>
          <QuickCounter value={putts} onChange={setPutts} max={5} type="putt" />
        </div>

        {/* Penalties */}
        <div>
          <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
            Penalties (optional)
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ color: COLORS.charcoal, fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>💧 Water</div>
              <QuickCounter value={penalties.water} onChange={(v) => setPenalties({...penalties, water: v})} max={3} type="approach" />
            </div>
            <div>
              <div style={{ color: COLORS.charcoal, fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>🔍 Lost Ball</div>
              <QuickCounter value={penalties.lost} onChange={(v) => setPenalties({...penalties, lost: v})} max={3} type="chip" />
            </div>
            <div>
              <div style={{ color: COLORS.charcoal, fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>⚠️ Out of Bounds</div>
              <QuickCounter value={penalties.ob} onChange={(v) => setPenalties({...penalties, ob: v})} max={3} type="putt" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
            Notes (optional)
          </label>
          <textarea
            value={holeNotes}
            onChange={(e) => setHoleNotes(e.target.value)}
            placeholder="Beautiful weather today! 🌸"
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              border: `3px solid ${COLORS.mistyBlue}`,
              color: COLORS.charcoal,
              fontSize: '16px',
              padding: '16px',
              borderRadius: '12px',
              minHeight: '100px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Hole Summary */}
        {totalShots > 0 && !isHoleRecorded && (
          <HoleSummary 
            par={getCurrentPar()} 
            totalWithPenalties={totalWithPenalties} 
            penalties={penalties} 
          />
        )}

        {/* Record Button */}
        <button
          onClick={completeHole}
          disabled={(totalShots === 0 && !editingHole) || (isHoleRecorded && !editingHole)}
          style={{
            width: '100%',
            backgroundColor: (isHoleRecorded && !editingHole) ? '#999999' : (totalShots > 0 || editingHole ? COLORS.blush : '#E0E0E0'),
            color: COLORS.charcoal,
            padding: '24px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '22px',
            fontWeight: 'bold',
            cursor: ((totalShots > 0 || editingHole) && (!isHoleRecorded || editingHole)) ? 'pointer' : 'not-allowed',
            opacity: ((totalShots === 0 && !editingHole) || (isHoleRecorded && !editingHole)) ? 0.7 : 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.3s'
          }}
        >
          <CheckCircle2 style={{ width: '28px', height: '28px' }} />
          {(isHoleRecorded && !editingHole) ? 'Hole Recorded' : editingHole ? 'Update Hole' : 'Record Hole & Continue'}
        </button>
      </div>

      {/* Navigation buttons */}
      <HoleNavigation 
        currentHole={currentHole} 
        setCurrentHole={setCurrentHole} 
      />

      {/* Par Modal */}
      {showParModal && (
        <ParModal
          currentHole={currentHole}
          currentPar={getCurrentPar()}
          onClose={() => setShowParModal(false)}
          onSelect={(par) => {
            setCustomPars({...customPars, [currentHole]: par});
            setShowParModal(false);
          }}
        />
      )}

      {/* Yardage Modal */}
      {showYardageModal && (
        <YardageModal
          currentHole={currentHole}
          tempYardage={tempYardage}
          setTempYardage={setTempYardage}
          onClose={() => {
            setShowYardageModal(false);
            setTempYardage('');
          }}
          onSave={(yards) => {
            setCustomYardages({...customYardages, [currentHole]: yards});
            setShowYardageModal(false);
            setTempYardage('');
          }}
        />
      )}
    </div>
  );
};

// Sub-components

const HoleNavigation = ({ currentHole, setCurrentHole }) => (
  <div style={{ 
    position: 'fixed', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#FFFFFF', 
    padding: '16px 24px',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <button
      onClick={() => { if (currentHole > 1) setCurrentHole(currentHole - 1); }}
      disabled={currentHole === 1}
      style={{
        flex: 1,
        maxWidth: '200px',
        backgroundColor: currentHole === 1 ? '#E0E0E0' : COLORS.mistyBlue,
        color: COLORS.charcoal,
        padding: '16px 24px',
        borderRadius: '12px',
        border: 'none',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: currentHole === 1 ? 'not-allowed' : 'pointer',
        opacity: currentHole === 1 ? 0.5 : 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      ← Previous
    </button>
    <button
      onClick={() => { if (currentHole < 18) setCurrentHole(currentHole + 1); }}
      disabled={currentHole === 18}
      style={{
        flex: 1,
        maxWidth: '200px',
        backgroundColor: currentHole === 18 ? '#E0E0E0' : COLORS.blush,
        color: COLORS.charcoal,
        padding: '16px 24px',
        borderRadius: '12px',
        border: 'none',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: currentHole === 18 ? 'not-allowed' : 'pointer',
        opacity: currentHole === 18 ? 0.5 : 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      Next →
    </button>
  </div>
);

const DriveSelector = ({ drive, setDrive }) => {
  const options = [
    { key: 'left', label: 'Left', color: '#C4DEDE', textColor: COLORS.charcoal },
    { key: 'middle', label: 'Fairway', color: '#F9C8D4', textColor: COLORS.charcoal },
    { key: 'right', label: 'Right', color: '#2A6B72', textColor: COLORS.cream }
  ];

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {options.map(pos => (
        <button
          key={pos.key}
          onClick={() => setDrive(pos.key)}
          style={{
            flex: 1,
            padding: '20px',
            borderRadius: '12px',
            border: pos.key === 'middle' ? '3px solid #F9C8D4' : `3px solid ${pos.key === 'left' ? '#C4DEDE' : '#2A6B72'}`,
            background: drive === pos.key ? COLORS.cream : pos.color,
            color: drive === pos.key ? COLORS.charcoal : pos.textColor,
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s'
          }}
        >
          {pos.key === 'middle' ? (
            <>
              <span style={{ color: drive === 'middle' ? COLORS.blush : COLORS.darkTeal }}>♥</span>
              {' Fairway '}
              <span style={{ color: drive === 'middle' ? COLORS.blush : COLORS.darkTeal }}>♥</span>
            </>
          ) : pos.label}
        </button>
      ))}
    </div>
  );
};

const HoleRecap = ({ recordedData, onEdit }) => (
  <div style={{ margin: '0 24px 24px 24px', backgroundColor: COLORS.mistyBlue, padding: '20px', borderRadius: '16px', border: `3px solid ${COLORS.darkTeal}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
      <h3 style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Hole Recap</h3>
      <button
        onClick={onEdit}
        style={{
          backgroundColor: COLORS.blush,
          color: COLORS.charcoal,
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        Edit Hole
      </button>
    </div>
    <div style={{ color: COLORS.charcoal, fontSize: '16px', lineHeight: '1.6' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div><strong>Par:</strong> {recordedData.par}</div>
        <div><strong>Score:</strong> <span style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: 'bold' }}>{recordedData.total}</span></div>
        <div><strong>Drive:</strong> {recordedData.drive === 'middle' ? '✨ Fairway' : recordedData.drive.charAt(0).toUpperCase() + recordedData.drive.slice(1)}</div>
        <div><strong>Putts:</strong> {recordedData.putts}</div>
      </div>
      {recordedData.notes && (
        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: COLORS.cream, borderRadius: '8px', fontStyle: 'italic' }}>
          "{recordedData.notes}"
        </div>
      )}
    </div>
  </div>
);

const HoleSummary = ({ par, totalWithPenalties, penalties }) => (
  <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: `3px solid ${COLORS.mistyBlue}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
    <h3 style={{ color: COLORS.charcoal, fontSize: '20px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>
      Hole Summary
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: COLORS.charcoal, fontSize: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Par</span>
        <span style={{ fontWeight: 'bold' }}>{par}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Your Score</span>
        <span style={{ color: COLORS.blush, fontSize: '24px', fontWeight: 'bold' }}>{totalWithPenalties}</span>
      </div>
      {(penalties.water + penalties.lost + penalties.ob > 0) && (
        <div style={{ color: COLORS.mistyBlue, fontSize: '16px', paddingTop: '12px', borderTop: `2px solid ${COLORS.mistyBlue}` }}>
          Includes {penalties.water + penalties.lost + penalties.ob} penalty stroke(s)
        </div>
      )}
    </div>
  </div>
);

const ParModal = ({ currentHole, currentPar, onClose, onSelect }) => (
  <div 
    style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}
    onClick={onClose}
  >
    <div 
      style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: '24px', 
        padding: '32px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '24px', textAlign: 'center' }}>
        Select Par for Hole {currentHole}
      </h3>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {[3, 4, 5].map(par => (
          <button
            key={par}
            onClick={() => onSelect(par)}
            style={{
              flex: 1,
              padding: '32px 20px',
              fontSize: '48px',
              fontWeight: 'bold',
              backgroundColor: currentPar === par ? COLORS.blush : COLORS.cream,
              color: COLORS.charcoal,
              border: `4px solid ${currentPar === par ? COLORS.blush : COLORS.mistyBlue}`,
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
          >
            {par}
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: COLORS.mistyBlue,
          color: COLORS.charcoal,
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer'
        }}
      >
        Cancel
      </button>
    </div>
  </div>
);

const YardageModal = ({ currentHole, tempYardage, setTempYardage, onClose, onSave }) => (
  <div 
    style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}
    onClick={onClose}
  >
    <div 
      style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: '24px', 
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ padding: '24px 24px 0 24px' }}>
        <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px', textAlign: 'center' }}>
          Yardage for Hole {currentHole}
        </h3>
      </div>
      <NumberPad
        value={tempYardage}
        onNumberClick={(num) => {
          if (tempYardage.length < 3) {
            setTempYardage(tempYardage + num);
          }
        }}
        onBackspace={() => {
          setTempYardage(tempYardage.slice(0, -1));
        }}
        onClear={() => {
          setTempYardage('');
        }}
        onDone={() => {
          const yards = parseInt(tempYardage);
          if (yards >= 50 && yards <= 700) {
            onSave(yards);
          } else {
            alert('Please enter a yardage between 50 and 700');
          }
        }}
      />
    </div>
  </div>
);

export default LogRoundScreen;
