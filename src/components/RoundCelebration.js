import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import birdie from '../assets/images/birdie.png';
import eagle from '../assets/images/eagle.png';
import hio from '../assets/images/hio.png';
import './RoundCelebration.css';
export const CELEBRATION_MS = 4000;
export default function RoundCelebration({ kind, onDismiss }) {
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  useEffect(() => {
    if (!kind) return;
    const config = kind === 'hio' ? { particleCount: 260, spread: 120, startVelocity: 62, scalar: 1.2 } : kind === 'eagle' ? { particleCount: 200, spread: 105, startVelocity: 58, scalar: 1.1 } : { particleCount: 170, spread: 95, startVelocity: 55, scalar: 1.05 };
    const burst = (second = false) => confetti({ particleCount: second ? Math.round(config.particleCount * .65) : config.particleCount, spread: config.spread + (second ? 10 : 0), startVelocity: second ? Math.max(40, config.startVelocity - 12) : config.startVelocity, gravity: second ? .95 : .85, scalar: second ? Math.max(.95, config.scalar - .1) : config.scalar, ticks: second ? 130 : 150, origin: { x: .5, y: .38 }, colors: ['#F4A8B9', '#ACC8C8', '#103E43', '#FFF7F0'], zIndex: 10050 });
    burst();
    const second = setTimeout(() => burst(true), 180);
    const done = setTimeout(() => dismiss.current(), CELEBRATION_MS);
    return () => { clearTimeout(second); clearTimeout(done); confetti.reset(); };
  }, [kind]);
  if (!kind) return null;
  const label = kind === 'hio' ? 'Hole in One' : kind === 'eagle' ? 'Eagle' : 'Birdie';
  return <div className="birdie-overlay" role="status" aria-label={`${label} celebration`}><img className={`celebration-image ${kind}`} src={kind === 'hio' ? hio : kind === 'eagle' ? eagle : birdie} alt={label} /></div>;
}
