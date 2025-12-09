import React from 'react';
import { Heart } from 'lucide-react';
import { COLORS } from '../constants';

const ShopScreen = ({ onBack }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '20px 24px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        marginBottom: '24px' 
      }}>
        <button 
          onClick={onBack} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: COLORS.darkTeal, 
            fontSize: '18px', 
            fontWeight: '600', 
            cursor: 'pointer', 
            marginBottom: '8px' 
          }}
        >
          ← Back
        </button>
        <h2 style={{ color: COLORS.darkTeal, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          Shop the Collection
        </h2>
        <p style={{ color: COLORS.charcoal, fontSize: '18px', margin: '4px 0 0 0' }}>
          Gear for confident golfers
        </p>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* Coming Soon Banner */}
        <div style={{ 
          background: `linear-gradient(135deg, ${COLORS.blush}33 0%, ${COLORS.mistyBlue}33 100%)`, 
          borderRadius: '24px', 
          padding: '40px 24px', 
          textAlign: 'center', 
          marginBottom: '24px' 
        }}>
          <Heart style={{ 
            width: '64px', 
            height: '64px', 
            color: COLORS.blush, 
            margin: '0 auto 20px auto' 
          }} />
          <h3 style={{ 
            color: COLORS.darkTeal, 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '16px' 
          }}>
            Products Coming Soon!
          </h3>
          <p style={{ 
            color: COLORS.charcoal, 
            fontSize: '18px', 
            lineHeight: '1.6', 
            marginBottom: '0' 
          }}>
            We're curating a beautiful collection of golf apparel and accessories designed just for you. Stay tuned!
          </p>
        </div>
        
        {/* What to Expect */}
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '16px', 
          padding: '28px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
          marginBottom: '24px' 
        }}>
          <h4 style={{ 
            color: COLORS.darkTeal, 
            fontSize: '22px', 
            fontWeight: 'bold', 
            marginTop: 0, 
            marginBottom: '20px' 
          }}>
            What to Expect:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FeatureItem 
              emoji="✨" 
              title="Curated Collections" 
              description="Thoughtfully selected apparel and accessories that combine style with performance" 
            />
            <FeatureItem 
              emoji="🩷" 
              title="Designed for You" 
              description="Pieces that make you feel confident and comfortable on the course" 
            />
            <FeatureItem 
              emoji="🌸" 
              title="Quality First" 
              description="Premium materials and attention to detail in every piece" 
            />
            <FeatureItem 
              emoji="⛳" 
              title="Golf Essentials" 
              description="From visors and gloves to stylish golf bags and accessories" 
            />
          </div>
        </div>

        {/* Quote */}
        <div style={{ 
          background: `linear-gradient(90deg, ${COLORS.blush}4D 0%, ${COLORS.mistyBlue}4D 100%)`, 
          borderRadius: '16px', 
          padding: '24px', 
          textAlign: 'center' 
        }}>
          <p style={{ 
            color: COLORS.darkTeal, 
            fontStyle: 'italic', 
            fontSize: '18px', 
            margin: 0, 
            lineHeight: '1.6' 
          }}>
            "Golf is a journey of self-discovery. Look good, feel great, play better! 💙"
          </p>
        </div>
      </div>
    </div>
  );
};

// Internal component for feature items
const FeatureItem = ({ emoji, title, description }) => (
  <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
    <div style={{ fontSize: '24px', minWidth: '32px' }}>{emoji}</div>
    <div>
      <p style={{ 
        color: COLORS.darkTeal, 
        fontWeight: 'bold', 
        margin: '0 0 4px 0', 
        fontSize: '16px' 
      }}>
        {title}
      </p>
      <p style={{ color: COLORS.charcoal, margin: 0, fontSize: '15px' }}>
        {description}
      </p>
    </div>
  </div>
);

export default ShopScreen;
