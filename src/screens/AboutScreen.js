import React from 'react';
import blushingBirdieLogo from '../assets/images/Blushing_Birdie_Logo.png';
// 👇 copy this import EXACTLY from HomeScreen.js
import { COLORS } from '../constants';

const AboutScreen = ({ onNavigate }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.cream,
        paddingBottom: '80px'
      }}
    >
      {/* Header – similar style to home, but smaller */}
      <div
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.85))',
          padding: '20px 24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '4px'
          }}
        >
          <img
            src={blushingBirdieLogo}
            alt="Blushing Birdie Logo"
            style={{
              width: '52px',
              height: '52px',
              objectFit: 'contain',
              marginTop: '4px'
            }}
          />
          <span
            style={{
              color: COLORS.darkTeal,
              fontSize: '22px',
              fontFamily: '"Playfair Display SC", serif',
              fontWeight: 700,
              letterSpacing: '0.75px'
            }}
          >
            About Blushing Birdie
          </span>
        </div>
      </div>

      {/* Content cards */}
      <div
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* How to use */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: '8px',
              color: COLORS.darkTeal,
              fontSize: '16px',
              fontWeight: 700
            }}
          >
            How to Use the App
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: '18px',
              color: COLORS.charcoal,
              fontSize: '14px',
              lineHeight: 1.5
            }}
          >
            <li>
              Tap <strong>Log Round</strong> to start a round and record each hole as you play.
            </li>
            <li>
              Use <strong>Manage Courses</strong> to add or edit course pars and yardages.
            </li>
            <li>
              Visit <strong>View Stats</strong> to see fairways hit, average putts, and trends.
            </li>
            <li>
              Come back to this page anytime to review how things work and where to find tips.
            </li>
          </ul>
        </section>

        {/* Tips & Links */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: '8px',
              color: COLORS.darkTeal,
              fontSize: '16px',
              fontWeight: 700
            }}
          >
            Tips & Links
          </h2>
          <p
            style={{
              margin: 0,
              marginBottom: '8px',
              color: COLORS.charcoal,
              fontSize: '14px'
            }}
          >
            Blushing Birdie is here to support your confidence on the course. You can use this
            space for:
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: '18px',
              color: COLORS.charcoal,
              fontSize: '14px',
              lineHeight: 1.5
            }}
          >
            <li>Links to your favorite beginner-friendly golf videos or articles.</li>
            <li>
              A link to your Blushing Birdie website or Instagram (you can add this later).
            </li>
            <li>Short reminders for mindset, pre-shot routine, or on-course confidence.</li>
          </ul>
        </section>

        {/* About the brand */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: '8px',
              color: COLORS.darkTeal,
              fontSize: '16px',
              fontWeight: 700
            }}
          >
            About the Brand
          </h2>
          <p
            style={{
              margin: 0,
              color: COLORS.charcoal,
              fontSize: '14px',
              lineHeight: 1.5
            }}
          >
            Blushing Birdie was created for women golfers who want a simple, encouraging way to
            see their progress—one swing, one fairway, one putt at a time. The soft colors and
            gentle design are intentional: this is a space for confidence, curiosity, and fun,
            not perfection.
          </p>
        </section>

        {/* Privacy & Data */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: '8px',
              color: COLORS.darkTeal,
              fontSize: '16px',
              fontWeight: 700
            }}
          >
            Privacy & Data
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: '18px',
              color: COLORS.charcoal,
              fontSize: '14px',
              lineHeight: 1.5
            }}
          >
            <li>
              Your rounds and courses are stored locally on your device using your browser&apos;s
              storage.
            </li>
            <li>No login or account is required to use this app.</li>
            <li>
              From this app, your golf data is not sent to a remote server or shared with third
              parties.
            </li>
          </ul>
          <p
            style={{
              marginTop: '8px',
              color: COLORS.charcoal,
              fontSize: '12px',
              lineHeight: 1.5
            }}
          >
            If you later add cloud sync or online features, you&apos;ll want to update this
            section and create a formal privacy policy.
          </p>
        </section>

        {/* Support / Feedback placeholder */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: '8px',
              color: COLORS.darkTeal,
              fontSize: '16px',
              fontWeight: 700
            }}
          >
            Support & Feedback
          </h2>
          <p
            style={{
              margin: 0,
              color: COLORS.charcoal,
              fontSize: '14px',
              lineHeight: 1.5
            }}
          >
            In the future, you can add a contact email or website link here for questions,
            ideas, or feature requests.
          </p>
        </section>

        {/* Back button */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            marginTop: '8px',
            alignSelf: 'flex-start',
            padding: '10px 16px',
            borderRadius: '999px',
            border: 'none',
            backgroundColor: COLORS.darkTeal,
            color: '#FFFFFF',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AboutScreen;
