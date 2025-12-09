import React from 'react';
import { COLORS } from '../constants';

const NumberPad = ({ onNumberClick, onBackspace, onClear, onDone, value, maxLength = 3 }) => {
  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', '←'];
  
  const handleButtonClick = (btn) => {
    if (btn === 'Clear') {
      onClear();
    } else if (btn === '←') {
      onBackspace();
    } else {
      if (!maxLength || (value || '').length < maxLength) {
        onNumberClick(btn);
      }
    }
  };

  const isDisabled = !value || value === '0';

  return (
    <div style={{ padding: "1.25rem" }}>
      {/* Display */}
      <div 
        style={{ 
          backgroundColor: COLORS.cream, 
          padding: "1.25rem", 
          borderRadius: "0.75rem", 
          marginBottom: "1rem", 
          border: `3px solid ${COLORS.mistyBlue}`, 
          textAlign: "center", 
          fontSize: "1.875rem", 
          fontWeight: "bold", 
          color: COLORS.charcoal, 
          minHeight: "60px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}
      >
        {value || '0'}
      </div>
      
      {/* Buttons Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "0.75rem", 
          marginBottom: "1rem" 
        }}
      >
        {buttons.map(btn => (
          <button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            style={{ 
              padding: "1.25rem", 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              borderRadius: "0.75rem", 
              cursor: "pointer", 
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", 
              transition: "all 0.3s", 
              border: "none",
              backgroundColor: btn === 'Clear' || btn === '←' ? COLORS.mistyBlue : COLORS.blush,
              color: COLORS.charcoal
            }}
          >
            {btn}
          </button>
        ))}
      </div>
      
      {/* Done Button */}
      <button
        onClick={onDone}
        disabled={isDisabled}
        style={{ 
          width: "100%", 
          padding: "1.25rem", 
          fontSize: "1.25rem", 
          fontWeight: "bold", 
          borderRadius: "0.75rem", 
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", 
          border: "none",
          backgroundColor: isDisabled ? '#E0E0E0' : COLORS.darkTeal,
          color: isDisabled ? COLORS.charcoal : COLORS.cream,
          cursor: isDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        Done
      </button>
    </div>
  );
};

export default NumberPad;
