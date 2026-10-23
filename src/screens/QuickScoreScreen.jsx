import React, { useEffect, useRef, useState } from 'react';
import { COLORS } from '../constants';
import { NumberPad } from '../components';
import { loadActiveRound, saveHoleDraft, isHoleDraftMeaningful } from '../utils/activeRoundStorage';
import RoundCelebration from '../components/RoundCelebration';
import './QuickScoreScreen.css';

const readInputs = (hole, round) => {
  const active = loadActiveRound();
  const saved = active?.holeDrafts?.[hole] || active?.holeDraft;
  const data = saved?.hole === hole ? saved : round.find(h => h.hole === hole);
  return { score: data?.score ?? data?.total ?? null, fairwayHit: typeof data?.fairwayHit === 'boolean' ? data.fairwayHit : null, putts: Number.isFinite(data?.putts) ? data.putts : null, greenInRegulation: typeof data?.greenInRegulation === 'boolean' ? data.greenInRegulation : null };
};

export default function QuickScoreScreen({ currentHole, setCurrentHole, currentRound, customPars, setCustomPars, customYardages, courseName, setCourseName, onRecordHole, onCompleteRound, onBack, onCancelRound }) {
  const [inputs, setInputs] = useState(() => readInputs(currentHole, currentRound));
  const [statsOpen, setStatsOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [digits, setDigits] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [error, setError] = useState('');
  const [celebration, setCelebration] = useState('');
  const hydrated = useRef(currentHole);
  const par = customPars[currentHole] || null;
  const draft = { hole: currentHole, scoringMode: 'quick', ...inputs };

  useEffect(() => {
    if (hydrated.current === currentHole) return;
    setInputs(readInputs(currentHole, currentRound));
    setError('');
  }, [currentHole, currentRound]);
  useEffect(() => {
    if (hydrated.current !== currentHole) { hydrated.current = currentHole; return; }
    saveHoleDraft(currentHole, { hole: currentHole, scoringMode: 'quick', ...inputs });
  }, [currentHole, inputs]);
  const pendingFinish = useRef(null);
  useEffect(() => () => { pendingFinish.current = null; }, []);
  const finishCelebration = () => {
    const finish = pendingFinish.current;
    pendingFinish.current = null;
    setCelebration(null);
    finish?.();
  };

  const change = (key, value) => { setInputs(i => ({ ...i, [key]: value })); setError(''); };
  const openPad = (kind, value) => { setDigits(value == null ? '' : String(value)); setModal(kind); };
  const valid = () => {
    if (![3, 4, 5].includes(par)) { setError('Select par 3, 4, or 5 before saving this hole.'); setModal('par'); return false; }
    if (!Number.isInteger(inputs.score) || inputs.score < 1 || inputs.score > 99) { setError('Enter a score from 1 to 99 before saving this hole.'); return false; }
    if (inputs.putts != null && inputs.putts > inputs.score) { setError('Putts cannot be greater than your total score.'); return false; }
    return true;
  };
  const save = (advance) => {
    if (!valid()) return;
    const hole = { hole: currentHole, par, yardage: customYardages[currentHole] || null, total: inputs.score, scoringMode: 'quick', drive: '', approaches: null, chips: null, putts: inputs.putts, fairwayHit: par > 3 ? inputs.fairwayHit : null, greenInRegulation: par === 3 ? inputs.greenInRegulation : null, penalties: { water: false, lost: false, ob: false }, notes: '' };
    saveHoleDraft(currentHole, null);
    onRecordHole(hole);
    const kind = inputs.score === 1 ? 'hio' : par && inputs.score === par - 2 ? 'eagle' : par && inputs.score === par - 1 ? 'birdie' : null;
    const finish = () => {
      if (advance && currentHole === 18) onCompleteRound(hole);
      else if (advance) setCurrentHole(currentHole + 1);
      else onBack();
    };
    if (kind) { pendingFinish.current = finish; setCelebration(kind); }
    else finish();
  };
  const endEarly = () => {
    if (!currentRound.length) { onCancelRound?.(); return; }
    if (isHoleDraftMeaningful(draft)) setModal('end');
    else if (window.confirm('End this round and save only recorded holes?')) onCompleteRound(null);
  };
  const applyDigits = () => {
    const number = Number(digits);
    if (modal === 'score' && Number.isInteger(number) && number >= 1 && number <= 99) change('score', number);
    else { setError('Enter a score from 1 to 99.'); return; }
    setError(''); setModal(null);
  };

  return <main className="quick-score" style={{ '--teal': COLORS.darkTeal, '--blush': COLORS.blush, '--mist': COLORS.mistyBlue }}>
    <button className="qs-back" onClick={onBack}>← Back to Home</button>
    <section className="qs-course"><button className="qs-course-name" aria-label="Edit course name" onClick={() => { setNameDraft(courseName || ''); setModal('course'); }}>{courseName || 'Add course name'} <span aria-hidden="true">✎</span></button><div className="qs-course-grid"><div>Hole <strong>{currentHole}</strong></div><button aria-label="Edit par" onClick={() => setModal('par')}>Par <strong>{par || '--'}</strong><span className="qs-par-edit"> · Edit</span></button></div></section>
    <div className="qs-title"><h2>Score</h2><button aria-label="Score help" onClick={() => setModal('help')}>ⓘ</button></div>
    <div className="qs-counter"><button aria-label="Decrease score" disabled={inputs.score == null || inputs.score <= 1} onClick={() => change('score', inputs.score - 1)}>−</button><button className="qs-total" aria-label="Enter score manually" onClick={() => openPad('score', inputs.score)}>{inputs.score ?? '--'}</button><button aria-label="Increase score" onClick={() => change('score', Math.min(99, (inputs.score || 0) + 1))}>+</button></div>
    <p className="qs-hint">Tap + to count, or tap the score to enter</p>
    {error && <p role="alert" className="qs-error">{error}</p>}
    <details open={statsOpen} onToggle={e => setStatsOpen(e.currentTarget.open)} className="qs-stats"><summary>Quick Stats · Optional</summary>
      <p className="qs-stats-note">These details are for your stats only. They don’t change your score.</p>
      {par == null && <button className="qs-link" onClick={() => setModal('par')}>Select par (required)</button>}
      {par != null && <div className="qs-stat qs-tee"><h3>{par === 3 ? 'Green hit?' : 'Fairway hit?'}</h3><div className="qs-choices">{[true, false].map(v => <button key={String(v)} aria-pressed={(par === 3 ? inputs.greenInRegulation : inputs.fairwayHit) === v} onClick={() => { const key = par === 3 ? 'greenInRegulation' : 'fairwayHit'; change(key, inputs[key] === v ? null : v); }}>{v ? '✓ Yes' : '× No'}</button>)}</div></div>}
      <div className="qs-stat"><h3>Putts</h3><div className="qs-putts"><button aria-label="Decrease putts" disabled={inputs.putts == null || inputs.putts === 0} onClick={() => change('putts', inputs.putts - 1)}>−</button><strong>{inputs.putts ?? '--'}</strong><button aria-label="Increase putts" onClick={() => change('putts', inputs.putts == null ? 1 : Math.min(99, inputs.putts + 1))}>+</button></div><button className="qs-link" aria-label="Clear putts" onClick={() => change('putts', null)}>Clear</button></div>
    </details>
    <footer className="qs-footer"><nav className="qs-nav" aria-label="Hole navigation"><button disabled={currentHole === 1 || Boolean(celebration)} onClick={() => setCurrentHole(currentHole - 1)}>← Previous</button><span>{currentHole} / 18</span><button disabled={Boolean(celebration)} onClick={() => save(true)}>{currentHole === 18 ? 'Save & Finish' : 'Save & Next →'}</button></nav>
    <button className="qs-link qs-end" onClick={endEarly}>{currentRound.length ? 'End Round Early' : 'Cancel Round'}</button></footer>
    <RoundCelebration kind={celebration} onDismiss={finishCelebration} />
    {modal && <div className="qs-overlay"><section role="dialog" aria-modal="true" aria-label={modal === 'par' ? 'Select par' : modal === 'end' ? 'Unfinished hole' : modal === 'help' ? 'Scoring help' : `Enter ${modal}`} className="qs-modal"><button className="qs-link" onClick={() => { setModal(null); setError(''); }}>Close</button>
      {modal === 'course' ? <><h2>Course name</h2><label htmlFor="qs-course-input">Where are you playing?</label><input id="qs-course-input" autoFocus maxLength={100} value={nameDraft} onChange={e => setNameDraft(e.target.value)} placeholder="e.g. Olympic Hills" /><button onClick={() => { setCourseName(nameDraft.trim()); setModal(null); }}>Save Name</button></> : modal === 'par' ? <><h2>Select par for Hole {currentHole}</h2><div className="qs-choices">{[3, 4, 5].map(p => <button key={p} onClick={() => { setCustomPars({ ...customPars, [currentHole]: p }); setModal(null); }}>{p}</button>)}</div></> : modal === 'help' ? <><h2>Your hole score</h2><p>Enter all strokes for this hole, including any penalty strokes. Use + as you play, or tap the score to enter the total.</p><p>Optional putts and tee-result details do not add strokes to your total. On par 3s, “Green hit?” means your tee shot finished on the putting green.</p></> : modal === 'end' ? <><h2>Hole {currentHole} isn’t finished</h2><p>Finish saving this hole, or end your round with only the {currentRound.length} recorded hole{currentRound.length === 1 ? '' : 's'}.</p><button onClick={() => setModal(null)}>Finish Recording Hole {currentHole}</button><button onClick={() => { saveHoleDraft(currentHole, null); onCompleteRound(null); }}>End with Recorded Holes</button></> : <><h2>Enter {modal}</h2><NumberPad value={digits} maxLength={2} onNumberClick={n => setDigits(digits + n)} onBackspace={() => setDigits(digits.slice(0, -1))} onClear={() => setDigits('')} onDone={applyDigits} />{error && <p role="alert">{error}</p>}</>}
    </section></div>}
  </main>;
}
