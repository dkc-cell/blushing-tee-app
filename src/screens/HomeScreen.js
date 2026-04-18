import React from 'react';
import { Heart, Flag, ChevronRight, BarChart3, BookOpen, Gem } from 'lucide-react';
import { COLORS } from '../constants';
import blushingBirdieLogo from '../assets/images/Blushing_Birdie_Logo.png';

const HomeScreen = ({ stats, savedCourses, onNavigate }) => {
  // Safeguards so UI doesn't break if stats are missing
  const fairwaysHit = stats?.fairwayPercentage ?? stats?.fairwaysHit ?? 0;
  const threePuttPct = stats?.threePuttPercentage ?? 0;

  const screenWidth = window.innerWidth;

  const brandScale = Math.max(0.78, Math.min(1, screenWidth / 430));

  const titleSize = 34 * brandScale;
  const taglineSize = 19 * brandScale;
  const logoSize = 102 * brandScale;
  const logoGap = 12 * brandScale;
  const textSpacing = 5 * brandScale;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.cream,
        paddingBottom: '64px',
      }}
    >
 {/* Header */}
{/* Header */}
<div
  style={{
    background: '#FFFFFF',
    padding: '20px 20px 12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    position: 'relative',
    zIndex: 10,
  }}
>
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: `${logoGap}px`,
      }}
    >
      <img
        src={blushingBirdieLogo}
        alt="Blushing Birdie Logo"
        style={{
          width: `${logoSize}px`,
          height: `${logoSize}px`,
          objectFit: 'contain',
          flexShrink: 0,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        <span
          style={{
            color: COLORS.darkTeal,
            fontSize: `${titleSize}px`,
            fontFamily: '"Playfair Display SC", serif',
            fontWeight: 500,
            letterSpacing: '0.15px',
            lineHeight: 1.02,
            marginBottom: `${textSpacing}px`,
            whiteSpace: 'nowrap',
          }}
        >
          Blushing Birdie
        </span>

        <span
          style={{
            color: '#c07084ff',
            fontSize: `${taglineSize}px`,
            fontFamily: '"Quicksand", sans-serif',
            letterSpacing: '0.35 px',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
          }}
        >
          confidence, one swing at a time
        </span>
      </div>
    </div>
  </div>
</div>

      {/* Main content */}
      <div style={{ padding: '16px 24px 24px' }}>
        {/* Stats “pills” row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {/* Fairways Hit */}
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.mistyBlue}70 0%, #FFFFFF 100%)`,
              borderRadius: '18px',
              padding: '14px 18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                color: COLORS.darkTeal,
                fontSize: '13px',
                marginBottom: '2px',
              }}
            >
              Fairways Hit
            </div>
            <div
              style={{
                color: COLORS.darkTeal,
                fontSize: '30px',
                fontWeight: 'bold',
                lineHeight: 1.1,
              }}
            >
              {fairwaysHit.toFixed ? fairwaysHit.toFixed(0) : Math.round(fairwaysHit)}%
            </div>
          </div>

          {/* 3-Putt % */}
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.blush}40 0%, #FFFFFF 100%)`,
              borderRadius: '18px',
              padding: '14px 18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                color: COLORS.darkTeal,
                fontSize: '13px',
                marginBottom: '2px',
              }}
            >
              3+ Putts
            </div>
            <div
              style={{
                color: COLORS.darkTeal,
                fontSize: '30px',
                fontWeight: 'bold',
                lineHeight: 1.1,
              }}
            >
              {threePuttPct.toFixed ? threePuttPct.toFixed(0) : Math.round(threePuttPct)}%
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <MenuButton
            onClick={() => onNavigate('selectCourse')}
            icon={
              <Flag
                style={{ width: '28px', height: '28px', color: COLORS.darkTeal }}
              />
            }
            title="Log Round"
            subtitle={
              savedCourses.length > 0
                ? `${savedCourses.length} course${
                    savedCourses.length !== 1 ? 's' : ''
                  } saved`
                : null
            }
            primary
          />

          <MenuButton
            onClick={() => onNavigate('manageCourses')}
            icon={
              <Gem
                style={{ width: '28px', height: '28px', color: COLORS.blushDeep }}
              />
            }
            title="Manage Courses"
            variant="manage"
          />

          <MenuButton
            onClick={() => onNavigate('stats')}
            icon={
              <BarChart3
                style={{ width: '28px', height: '28px', color: COLORS.darkTeal }}
              />
            }
            title="View Stats"
            variant="stats"
          />

          <MenuButton
            onClick={() => onNavigate('shop')}
            icon={
              <Heart
                style={{ width: '28px', height: '28px', color: COLORS.blushDeep }}
              />
            }
            title="Shop the Collection"
            variant="shop"
          />

          <MenuButton
            onClick={() => onNavigate('about')}
            icon={
              <BookOpen
                style={{ width: '28px', height: '28px', color: COLORS.darkTeal }}
              />
            }
            title="About Blushing Birdie"
            variant="about"
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
    // Log Round – misty → cream
    return `linear-gradient(90deg, ${COLORS.mistyBlue} 0%, ${COLORS.cream} 100%)`;
  }

  if (variant === 'manage') {
    // Manage Courses – cream → two blush
    return `linear-gradient(90deg, ${COLORS.cream} 0%, ${COLORS.twoblush} 100%)`;
  }

  if (variant === 'stats') {
    // View Stats – cream → misty
    return `linear-gradient(90deg, ${COLORS.cream} 0%, ${COLORS.mistyBlue} 100%)`;
  }

  if (variant === 'shop') {
    // Shop – cream → two blush
    return `linear-gradient(90deg, ${COLORS.cream} 0%, ${COLORS.twoblush} 100%)`;
  }

  if (variant === 'about') {
    // About – misty → cream
    return `linear-gradient(90deg, ${COLORS.mistyBlue} 0%, ${COLORS.cream} 100%)`;
  }

  // Fallback
  return `linear-gradient(90deg, ${COLORS.mistyBlue} 0%, ${COLORS.cream} 100%)`;
};

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: getBackground(),
        color: COLORS.charcoal,
        padding: '18px 20px',
        borderRadius: '18px',
        border: 'none',
        fontSize: '18px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: primary
          ? '0 4px 12px rgba(0,0,0,0.15)'
          : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon}
        <div style={{ textAlign: 'left' }}>
          <span>{title}</span>
          {subtitle && (
            <div
              style={{
                fontSize: '12px',
                fontWeight: 'normal',
                color: COLORS.darkTeal,
                opacity: 0.8,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <ChevronRight
        style={{ width: '24px', height: '24px', color: COLORS.darkTeal }}
      />
    </button>
  );
};

export default HomeScreen;
