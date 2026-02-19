import React from 'react';
import { COLORS } from '../constants';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '500px' }) => {
  if (!isOpen) return null;

  return (
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
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '24px', 
          maxWidth,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div 
            style={{ 
              position: 'sticky', 
              top: 0, 
              backgroundColor: '#FFFFFF', 
              padding: '24px', 
              borderBottom: `2px solid ${COLORS.mistyBlue}33`, 
              borderRadius: '24px 24px 0 0' 
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: COLORS.charcoal
              }}
            >
              ✕
            </button>
            <h3 
              style={{ 
                color: COLORS.darkTeal, 
                fontSize: '24px', 
                fontWeight: 'bold', 
                margin: 0 
              }}
            >
              {title}
            </h3>
          </div>
        )}
        <div style={{ padding: title ? '24px' : '32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
