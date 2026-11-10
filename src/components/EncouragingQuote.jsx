import React, { useLayoutEffect, useRef, useState } from 'react';
import { COLORS, ENCOURAGING_QUOTES } from '../constants';

export default function EncouragingQuote({ hole, style }) {
  const text = ENCOURAGING_QUOTES[(hole - 1) % ENCOURAGING_QUOTES.length];
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(20);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const fit = () => {
      const label = textRef.current;
      label.style.fontSize = '20px';
      label.style.whiteSpace = 'nowrap';
      const available = container.clientWidth - 24;
      const fitted = Math.max(16, Math.min(20, 20 * available / label.scrollWidth));
      label.style.fontSize = `${fitted}px`;
      label.style.whiteSpace = 'normal';
      setFontSize(fitted);
    };
    fit();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    observer?.observe(container);
    window.addEventListener('resize', fit);
    document.fonts?.ready.then(fit);
    return () => { observer?.disconnect(); window.removeEventListener('resize', fit); };
  }, [text]);

  return <div ref={containerRef} style={{ background: `linear-gradient(90deg, ${COLORS.blush}33 0%, ${COLORS.mistyBlue}33 100%)`, padding: '18px 12px', borderRadius: 16, textAlign: 'center', ...style }}>
    <p style={{ color: COLORS.darkTeal, fontSize, fontStyle: 'italic', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
      <span ref={textRef} style={{ display: 'inline-block', maxWidth: '100%' }}>{text}</span>
    </p>
  </div>;
}
