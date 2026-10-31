import React from 'react';
import { Link } from 'react-router-dom';
import './BackButton.css';

export default function BackButton({ onClick, to, children = 'Back' }) {
  const Tag = to ? Link : 'button';
  return <Tag className="bb-back" {...(to ? { to } : { type: 'button', onClick })} style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    minHeight: 54, width: 'fit-content', maxWidth: '100%', alignSelf: 'flex-start', padding: '14px 16px', boxSizing: 'border-box',
    border: '1px solid #ACC8C8', borderRadius: 12, background: '#FFFFFF', color: '#103E43',
    fontFamily: 'inherit', fontSize: 16, fontWeight: 700, lineHeight: 1.35,
    textDecoration: 'none', cursor: 'pointer', marginBottom: 12,
  }}><span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>←</span><span>{children}</span></Tag>;
}
