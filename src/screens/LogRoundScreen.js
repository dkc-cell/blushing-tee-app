import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { COLORS, ENCOURAGING_QUOTES } from '../constants';
import { NumberPad, QuickCounter } from '../components';
import confetti from 'canvas-confetti';

// Celebration images (you said you’ll add these to /assets/images)
import birdieImg from '../assets/images/birdie.png';
import eagleImg from '../assets/images/eagle.png';
import hioImg from '../assets/images/hio.png';

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
  const [showDriveWarning, setShowDriveWarning] = useState(false);
  const [celebrationKind, setCelebrationKind] = useState(null); // 'birdie' | 'eagle' | 'hio' | null
  const driveSectionRef = useRef(null);
    // Auto-hide celebration overlay after 4 seconds
  useEffect(() => {
    if (!celebrationKind) return;
    const t = setTimeout(() => setCelebrationKind(null), 4000);
    return () => clearTimeout(t);
  }, [celebrationKind]);
  // Fire confetti burst when celebration starts
useEffect(() => {
  if (!celebrationKind) return;

  const config =
    celebrationKind === 'hio'
      ? { particleCount: 260, spread: 120, startVelocity: 62, scalar: 1.2 }
      : celebrationKind === 'eagle'
      ? { particleCount: 200, spread: 105, startVelocity: 58, scalar: 1.1 }
      : { particleCount: 170, spread: 95, startVelocity: 55, scalar: 1.05 };

  // First burst
  confetti({
    particleCount: config.particleCount,
    spread: config.spread,
    startVelocity: config.startVelocity,
    gravity: 0.85,
    scalar: config.scalar,
    ticks: 150,
    origin: { x: 0.5, y: 0.38 },
    colors: ['#F4A8B9', '#ACC8C8', '#103E43', '#FFF7F0'],
    zIndex: 10050
  });

  // Second burst (adds punch)
  const t2 = setTimeout(() => {
    confetti({
      particleCount: Math.round(config.particleCount * 0.65),
      spread: config.spread + 10,
      startVelocity: Math.max(40, config.startVelocity - 12),
      gravity: 0.95,
      scalar: Math.max(0.95, config.scalar - 0.1),
      ticks: 130,
      origin: { x: 0.5, y: 0.38 },
      colors: ['#F4A8B9', '#ACC8C8', '#103E43', '#FFF7F0'],
      zIndex: 10050
    });
  }, 180);

  return () => clearTimeout(t2);
}, [celebrationKind]);

    const handleDriveSelect = (value) => {
    setDrive(value);
    setShowDriveWarning(false);
  };
  const [approaches, setApproaches] = useState(0);
  const [chips, setChips] = useState(0);
  const [putts, setPutts] = useState(0);
  const [penalties, setPenalties] = useState({ water: false, lost: false, ob: false });
  const [holeNotes, setHoleNotes] = useState('');
    // Penalty tip modal state (triggered when a penalty is toggled ON)
  const [showPenaltyTip, setShowPenaltyTip] = useState(false);
  const [penaltyTipType, setPenaltyTipType] = useState(null);

  // “Silence tips” controls
  const [suppressTipsThisRound, setSuppressTipsThisRound] = useState(false);
  const [suppressTipsForever, setSuppressTipsForever] = useState(
    localStorage.getItem('bb_suppressPenaltyTips') === 'true'
  );

  const maybeShowPenaltyTip = (type) => {
    if (suppressTipsThisRound || suppressTipsForever) return;
    setPenaltyTipType(type);
    setShowPenaltyTip(true);
  };

  const handleSuppressThisRound = () => {
    setSuppressTipsThisRound(true);
    setShowPenaltyTip(false);
  };

  const handleSuppressForever = () => {
    localStorage.setItem('bb_suppressPenaltyTips', 'true');
    setSuppressTipsForever(true);
    setShowPenaltyTip(false);
  };
  const [editingHole, setEditingHole] = useState(false);
  
  // Modal state
  const [showParModal, setShowParModal] = useState(false);
  const [showYardageModal, setShowYardageModal] = useState(false);
  const [tempYardage, setTempYardage] = useState('');

    // Celebration overlay (Birdie / Eagle / HIO)
  const CELEBRATION_MS = 4000;
  
  const randomQuote = ENCOURAGING_QUOTES[currentHole % ENCOURAGING_QUOTES.length];
  const isHoleRecorded = recordedHoles.has(currentHole);
  const recordedData = currentRound.find(h => h.hole === currentHole);

  const getCurrentPar = () => customPars[currentHole] || null;
  const getCurrentYardage = () => customYardages[currentHole] || null;
  const needsHoleSetup = () => getCurrentPar() === null || getCurrentYardage() === null;

  const totalShots = (drive ? 1 : 0) + approaches + chips + putts;
  const totalScore = totalShots; // penalties are reminders only

  const resetInputs = () => {
    setDrive('');
    setApproaches(0);
    setChips(0);
    setPutts(0);
    setPenalties({ water: false, lost: false, ob: false });
    setHoleNotes('');
  };

  const completeHole = () => {
  const par = getCurrentPar();
  const isPar3 = par === 3;

   // Require a selection before recording hole
  // Par 4/5 = Drive, Par 3 = Green (same control)
  if (!drive) {
    setShowDriveWarning(true);

    // Smooth scroll so the user sees the message immediately
    setTimeout(() => {
      driveSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

    return;
  }

  const newHoleData = {
    hole: currentHole,
    par,
    yardage: getCurrentYardage(),
    drive,
    approaches,
    chips,
    putts,
    penalties,
    total: totalScore,
    notes: holeNotes,

    // Par 4/5: "middle" = fairway
    fairwayHit: !isPar3 && drive === 'middle',

    // Par 3: "middle" = green in regulation (simple GIR flag for now)
    greenInRegulation: isPar3 && drive === 'middle'
  };

    onRecordHole(newHoleData);
     // Celebration should be based on strokes (not penalties)
  const CELEBRATION_MS = 4000; // you can move this to top-level later
  const strokes = totalShots;

  let kind = null;
  if (strokes === 1) kind = 'hio';
  else if (par != null && strokes === par - 2) kind = 'eagle';
  else if (par != null && strokes === par - 1) kind = 'birdie';

  if (kind) {
    setCelebrationKind(kind);
  }

    setEditingHole(false);
    resetInputs();
    
       const advanceDelay = kind ? CELEBRATION_MS : 800;

    setTimeout(() => {
     if (kind) confetti.reset(); // stops any lingering particles before next hole

      if (currentHole < 18) {
        setCurrentHole(currentHole + 1);
      } else {
        onCompleteRound(newHoleData);
      }
    }, advanceDelay);
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
                <span style={{ color: COLORS.darkTeal, fontSize: '32px', fontWeight: 'bold' }}>{totalScore}</span>
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
       <div ref={driveSectionRef}>
          <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
            {getCurrentPar() === 3 ? 'Green (select one)' : 'Drive (select one)'}
          </label>

         {showDriveWarning && (
           <div
             style={{
              backgroundColor: `${COLORS.blush}33`,
              border: `2px solid ${COLORS.blush}`,
              color: COLORS.darkTeal,
              padding: '12px 14px',
              borderRadius: '12px',
              marginBottom: '12px',
              fontSize: '16px',
              fontWeight: '600'
           }}
        >
         {getCurrentPar() === 3
          ? 'Please select your green (Left / Green / Right) before continuing.'
         : 'Please select your drive (Left / Fairway / Right) before continuing.'}
  </div>
)}

          <DriveSelector drive={drive} setDrive={handleDriveSelect} isPar3={getCurrentPar() === 3} />
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
               {/* Penalty reminder (checklist) */}
        <div style={{ marginTop: 0 }}>
          <label style={{ color: COLORS.charcoal, fontSize: '20px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            Penalty reminder (optional)
          </label>

          <div style={{ color: COLORS.charcoal, opacity: 0.75, fontSize: '14px', marginBottom: '14px', lineHeight: 1.35 }}>
            Doesn’t change your score. Record the extra shot using <strong>Approach Shots</strong>.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: COLORS.charcoal }}>💧 Water</div>
              <ToggleSwitch
                checked={penalties.water}
                ariaLabel="Water penalty reminder"
                onChange={(next) => {
                  setPenalties((p) => ({ ...p, water: next }));
                  if (next) maybeShowPenaltyTip('water');
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: COLORS.charcoal }}>🔍 Lost Ball</div>
              <ToggleSwitch
                checked={penalties.lost}
                ariaLabel="Lost ball reminder"
                onChange={(next) => {
                  setPenalties((p) => ({ ...p, lost: next }));
                  if (next) maybeShowPenaltyTip('lost');
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: COLORS.charcoal }}>⚠️ Out of Bounds</div>
              <ToggleSwitch
                checked={penalties.ob}
                ariaLabel="Out of bounds reminder"
                onChange={(next) => {
                  setPenalties((p) => ({ ...p, ob: next }));
                  if (next) maybeShowPenaltyTip('ob');
                }}
              />
            </div>
          </div>
        </div>
   
        {/* Hole Summary */}
        {totalShots > 0 && !isHoleRecorded && (
          <HoleSummary 
           par={getCurrentPar()} 
           totalScore={totalScore} 
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
       {/* Penalty Tip Modal */}
      {showPenaltyTip && (
        <PenaltyTipModal
          type={penaltyTipType}
          onClose={() => setShowPenaltyTip(false)}
          onSuppressThisRound={handleSuppressThisRound}
          onSuppressForever={handleSuppressForever}
        />
      )}

      {/* Birdie celebration overlay */}
      <style>{`
    .birdie-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 245, 248, 0.88); /* soft blush */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  pointer-events: none;
}
 .celebration-image {
  position: relative;
  z-index: 2;                 /* above confetti */
  width: min(340px, 85vw);    /* phone-friendly */
  height: auto;
  opacity: 0.95;
  animation: birdiePop 4s ease-in-out forwards;
}
 /* Slightly bigger for Eagle */
.celebration-image.eagle {
  width: min(360px, 88vw);
}

/* Biggest moment for Hole-in-One */
.celebration-image.hio {
  width: min(400px, 92vw);
}
 @keyframes birdiePop {
  0%   { opacity: 0; transform: scale(0.9); }
  15%  { opacity: 1; transform: scale(1); }
  85%  { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.02); }
}
 `}</style>

{celebrationKind && (
  <div
  className="birdie-overlay"
  aria-label={
    celebrationKind === 'hio'
      ? 'Hole in One celebration'
      : celebrationKind === 'eagle'
      ? 'Eagle celebration'
      : 'Birdie celebration'
  }
>
  <img
    className={`celebration-image ${celebrationKind}`}
  src={
    celebrationKind === 'hio'
      ? hioImg
      : celebrationKind === 'eagle'
      ? eagleImg
      : birdieImg
  }
  alt={
    celebrationKind === 'hio'
      ? 'Hole in One'
      : celebrationKind === 'eagle'
      ? 'Eagle'
      : 'Birdie'
  }
/>
 
    </div>
)}

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

const ToggleSwitch = ({ checked, onChange, ariaLabel }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    aria-label={ariaLabel}
    style={{
      width: 56,
      height: 32,
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      backgroundColor: checked ? COLORS.darkTeal : `${COLORS.mistyBlue}AA`,
      boxShadow: '0 4px 10px rgba(0,0,0,0.10)',
      position: 'relative',
      transition: 'background-color 160ms ease',
    }}
  >
    <span
      style={{
        width: 26,
        height: 26,
        borderRadius: '50%',
        backgroundColor: '#fff',
        position: 'absolute',
        top: 3,
        left: checked ? 27 : 3,
        transition: 'left 160ms ease',
        boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
      }}
    />
  </button>
);

const PenaltyTipModal = ({ type, onClose, onSuppressThisRound, onSuppressForever }) => {
  const titleMap = {
    water: 'Water ball 💦',
    lost: 'Lost ball 🔍',
    ob: 'Out of bounds ⚠️',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: 22,
          padding: 22,
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.darkTeal, marginBottom: 10 }}>
          {titleMap[type] || 'Penalty reminder'}
        </div>

       <div style={{ fontSize: 16, color: COLORS.charcoal, lineHeight: 1.45 }}>
        When a shot goes in the water, is lost, or goes out of bounds, you’ll need an <strong><em>extra shot</em></strong> to get back in play.
       <br /><br />
        Record that <strong><em>extra shot</em></strong> using <strong>Approach Shots</strong>.
      </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: COLORS.blush,
              fontWeight: 'bold',
              cursor: 'pointer',
              color: COLORS.charcoal,
            }}
          >
            Got it
          </button>

          <button
            onClick={onSuppressThisRound}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: `${COLORS.mistyBlue}66`,
              fontWeight: 'bold',
              cursor: 'pointer',
              color: COLORS.darkTeal,
            }}
          >
            Hide tips for this round
          </button>

          <button
            onClick={onSuppressForever}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: '#F2F2F2',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: COLORS.charcoal,
            }}
          >
            Don’t show again
          </button>
        </div>
      </div>
    </div>
  );
};

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

const DriveSelector = ({ drive, setDrive, isPar3 }) => {
  const options = [
  { key: 'left', label: 'Left', color: '#C4DEDE', textColor: COLORS.charcoal },
  { key: 'middle', label: isPar3 ? 'Green' : 'Fairway', color: '#F9C8D4', textColor: COLORS.charcoal },
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
              {` ${pos.label} `}
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
        <div>
  <strong>Drive:</strong>{' '}
  {recordedData.drive === 'middle'
    ? (recordedData.par === 3 ? '✨ Green' : '✨ Fairway')
    : recordedData.drive.charAt(0).toUpperCase() + recordedData.drive.slice(1)}
</div>

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

const HoleSummary = ({ par, totalScore, penalties }) => (
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
        <span style={{ color: COLORS.blush, fontSize: '24px', fontWeight: 'bold' }}>{totalScore}</span>
      </div>
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
