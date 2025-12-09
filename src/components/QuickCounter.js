import React from 'react';
import { COLORS } from '../constants';

/**
 * Get gradient color based on position and type
 */
const getColor = (index, max, type) => {
  const position = index / (max - 1);
  
  if (type === 'approach') {
    const baseR = 220, baseG = 235, baseB = 235;
    const endR = 172, endG = 200, endB = 200;
    const r = Math.round(baseR + (endR - baseR) * position);
    const g = Math.round(baseG + (endG - baseG) * position);
    const b = Math.round(baseB + (endB - baseB) * position);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  if (type === 'chip') {
    const r = Math.round(16 + (172 - 16) * (1 - position));
    const g = Math.round(62 + (200 - 62) * (1 - position));
    const b = Math.round(67 + (200 - 67) * (1 - position));
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  if (type === 'putt') {
    const r = Math.round(244 + (255 - 244) * (1 - position));
    const g = Math.round(168 + (220 - 168) * (1 - position));
    const b = Math.round(185 + (230 - 185) * (1 - position));
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  return COLORS.mistyBlue;
};

const QuickCounter = ({ value, onChange, max = 10, type = 'approach' }) => {
  const handleClick = (index) => {
    // Toggle: if clicking current value, go back one; otherwise set to clicked value
    onChange(value === index + 1 ? index : index + 1);
  };

  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      {[...Array(max)].map((_, i) => {
        const isSelected = i < value;
        const bgColor = getColor(i, max, type);
        const textColor = type === 'chip' ? COLORS.cream : COLORS.charcoal;
        
        return (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{ 
              width: "3.5rem", 
              height: "3.5rem", 
              borderRadius: "50%", 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", 
              cursor: "pointer", 
              transition: "all 0.3s",
              backgroundColor: isSelected ? COLORS.cream : bgColor,
              color: isSelected ? COLORS.charcoal : textColor,
              border: `3px solid ${bgColor}`
            }}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
};

export default QuickCounter;
