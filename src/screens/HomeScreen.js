import React from 'react';
import { Heart, Flag, ChevronRight, BarChart3, BookOpen } from 'lucide-react';
import { COLORS } from '../constants';
import blushingBirdieLogo from '../assets/images/Blushing_Birdie_Logo.png';


const HomeScreen = ({ stats, savedCourses, onNavigate }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '80px' }}>
      {/* Header */}
<div
  style={{
    background: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.85))',
    padding: '20px 24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)', // softer than before
    position: 'relative',
    zIndex: 10
  }}
>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      marginBottom: '4px'
    }}
  >
    <img
      src={blushingBirdieLogo}
      alt="Blushing Birdie Logo"
      style={{
        width: '64px',
        height: '64px',
        objectFit: 'contain',
        marginTop: '5px'
      }}
    />

    <span
      style={{
        color: COLORS.darkTeal,
        fontSize: '28px',
        fontFamily: '"Playfair Display SC", serif',
        fontWeight: 700,
        letterSpacing: '0.75px'
      }}
    >
      BLUSHING BIRDIE
    </span>
  </div>
</div>

      <div style={{ padding: '24px' }}>
        <h1 style={{ color: COLORS.darkTeal, fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }}>
          Welcome Back!
        </h1>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            background: `linear-gradient(135deg, ${COLORS.mistyBlue}33 0%, #FFFFFF 100%)`, 
            borderRadius: '24px', 
            padding: '20px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ color: COLORS.darkTeal, fontSize: '14px', marginBottom: '4px' }}>
              Fairways Hit
            </div>
            <div style={{ color: COLORS.darkTeal, fontSize: '40px', fontWeight: 'bold' }}>
              {stats.fairwaysHit}%
            </div>
          </div>
          <div style={{ 
            background: `linear-gradient(135deg, ${COLORS.blush}33 0%, #FFFFFF 100%)`, 
            borderRadius: '24px', 
            padding: '20px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ color: COLORS.darkTeal, fontSize: '14px', marginBottom: '4px' }}>
              Avg Putts
            </div>
            <div style={{ color: COLORS.darkTeal, fontSize: '40px', fontWeight: 'bold' }}>
              {stats.avgPutts}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <MenuButton 
            onClick={() => onNavigate('selectCourse')}
            icon={<Flag style={{ width: '28px', height: '28px', color: COLORS.darkTeal }} />}
            title="Log Round"
            subtitle={savedCourses.length > 0 ? `${savedCourses.length} course${savedCourses.length !== 1 ? 's' : ''} saved` : null}
            primary
          />
          
          <MenuButton 
            onClick={() => onNavigate('manageCourses')}
            icon={<Flag style={{ width: '28px', height: '28px', color: COLORS.blush }} />}
            title="Manage Courses"
            variant="blush"
          />
          
          <MenuButton 
            onClick={() => onNavigate('stats')}
            icon={<BarChart3 style={{ width: '28px', height: '28px', color: COLORS.darkTeal }} />}
            title="View Stats"
            variant="misty"
          />
          
          <MenuButton 
            onClick={() => onNavigate('shop')}
            icon={<Heart style={{ width: '28px', height: '28px', color: COLORS.blush }} />}
            title="Shop the Collection"
            variant="blush"
          />
          
          <MenuButton 
            onClick={() => onNavigate('about')}
            icon={<BookOpen style={{ width: '28px', height: '28px', color: COLORS.darkTeal }} />}
            title="About Blushing Birdie"
            variant="misty"
          />
        </div>
      </div>
    </div>
  );
};

// Internal MenuButton component for cleaner code
const MenuButton = ({ onClick, icon, title, subtitle, primary, variant }) => {
  const getBackground = () => {
    if (primary) {
      return `linear-gradient(90deg, ${COLORS.mistyBlue} 0%, ${COLORS.mistyBlue}CC 100%)`;
    }
    if (variant === 'blush') {
      return `linear-gradient(90deg, ${COLORS.blush}4D 0%, #FFFFFF 100%)`;
    }
    return `linear-gradient(90deg, ${COLORS.mistyBlue}4D 0%, #FFFFFF 100%)`;
  };

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: getBackground(),
        color: COLORS.charcoal,
        padding: '20px',
        borderRadius: '16px',
        border: 'none',
        fontSize: '18px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: primary ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon}
        <div style={{ textAlign: 'left' }}>
          <span>{title}</span>
          {subtitle && (
            <div style={{ 
              fontSize: '12px', 
              fontWeight: 'normal', 
              color: COLORS.darkTeal, 
              opacity: 0.8 
            }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <ChevronRight style={{ width: '24px', height: '24px', color: COLORS.darkTeal }} />
    </button>
  );
};

export default HomeScreen;
