import React from 'react';
import { Link } from 'react-router-dom';
import './BackButton.css';

export default function BackButton({ onClick, to, children = 'Back', fullWidth = false }) {
  const Tag = to ? Link : 'button';
  return <Tag className="bb-back" {...(to ? { to } : { type: 'button', onClick })} style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    minHeight: 52, minWidth: 112, padding: '12px 16px', boxSizing: 'border-box',
    border: '2px solid #103E43', borderRadius: 12, background: '#FFFFFF', color: '#103E43',
    fontFamily: 'inherit', fontSize: 18, fontWeight: 700, lineHeight: 1.35,
    textDecoration: 'none', cursor: 'pointer', marginBottom: 12,
    ...(fullWidth ? { width: '100%' } : {}),
  }}><span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>←</span><span>{children}</span></Tag>;
}
