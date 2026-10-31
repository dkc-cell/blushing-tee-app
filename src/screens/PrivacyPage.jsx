import BackButton from '../components/BackButton';
import React from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants';
import logo from '../assets/images/Blushing_Birdie_Logo.png';
import { usePageSeo } from '../utils/seo';

const pageWidth = {
  width: '100%',
  maxWidth: '860px',
  margin: '0 auto',
  paddingLeft: '24px',
  paddingRight: '24px',
};

const cardStyle = {
  background: 'rgba(255,255,255,0.9)',
  borderRadius: '24px',
  border: '1px solid rgba(172,200,200,0.32)',
  boxShadow: '0 16px 40px rgba(16, 62, 67, 0.08)',
};

export default function PrivacyPage() {
  usePageSeo({
    title: 'Privacy and Data - Blushing Birdie',
    description:
      'How Blushing Birdie handles golf round data, local storage, and file backups.',
    path: '/privacy',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #FFF9F5 0%, #FFFDFC 35%, #FFF6F8 100%)',
        paddingBottom: '72px',
      }}
    >
      <header
        style={{
          background: 'rgba(255,255,255,0.9)',
          borderBottom: '1px solid rgba(16, 62, 67, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            ...pageWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingTop: '16px',
            paddingBottom: '16px',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              textDecoration: 'none',
            }}
          >
            <img
              src={logo}
              alt="Blushing Birdie"
              style={{ width: '46px', height: '46px', objectFit: 'contain' }}
            />
            <span
              style={{
                color: COLORS.darkTeal,
                fontSize: '1.35rem',
                fontWeight: 700,
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Blushing Birdie
            </span>
          </Link>

          <BackButton to="/">Back to Home</BackButton>
        </div>
      </header>

      <main style={{ ...pageWidth, paddingTop: '54px' }}>
        <div style={{ textAlign: 'center', marginBottom: '34px' }}>
          <p
            style={{
              margin: '0 0 12px',
              color: COLORS.blush,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
            }}
          >
            Privacy
          </p>
          <h1
            style={{
              margin: 0,
              color: COLORS.darkTeal,
              fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
              lineHeight: 1.1,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Privacy and data
          </h1>
          <p
            style={{
              maxWidth: '680px',
              margin: '18px auto 0',
              color: '#4F6365',
              fontSize: '1.02rem',
              lineHeight: 1.75,
            }}
          >
            This page describes how Blushing Birdie currently handles your data based on the app as
            it works today.
          </p>
        </div>

        <section style={{ ...cardStyle, padding: '34px 30px', marginBottom: '22px' }}>
          <h2
            style={{
              marginTop: 0,
              marginBottom: '14px',
              color: COLORS.darkTeal,
              fontSize: '1.35rem',
            }}
          >
            What is stored
          </h2>
          <p style={{ margin: '0 0 14px', color: COLORS.charcoal, lineHeight: 1.75 }}>
            Your rounds and course information are currently stored locally in your browser on the
            device you use.
          </p>
          <p style={{ margin: 0, color: COLORS.charcoal, lineHeight: 1.75 }}>
            No account is required. Your saved rounds and courses stay in this browser on your
            device. Use Export Backup to keep a separate copy of your data.
          </p>
        </section>

        <section style={{ ...cardStyle, padding: '34px 30px', marginBottom: '22px' }}>
          <h2
            style={{
              marginTop: 0,
              marginBottom: '14px',
              color: COLORS.darkTeal,
              fontSize: '1.35rem',
            }}
          >
            What to expect
          </h2>
          <p style={{ margin: '0 0 14px', color: COLORS.charcoal, lineHeight: 1.75 }}>
            Because data is stored locally, it does not automatically appear on another device. If
            browser storage is cleared, locally stored rounds and courses may be removed.
          </p>
          <p style={{ margin: 0, color: COLORS.charcoal, lineHeight: 1.75 }}>
            Export Backup saves your saved rounds and courses in a JSON file. Import Backup restores
            that file and replaces the saved rounds and courses on the destination device. CSV exports
            are spreadsheets for reviewing golf stats and cannot restore the app.
          </p>
        </section>

        <section style={{ ...cardStyle, padding: '34px 30px', marginBottom: '22px' }}>
          <h2 style={{ margin: '0 0 14px', color: COLORS.darkTeal, fontSize: '1.35rem' }}>Sharing feedback</h2>
          <p style={{ margin: 0, color: COLORS.charcoal, lineHeight: 1.75 }}>Share Feedback opens your email app. If you send a message, we receive your email address and the information you choose to include. Your scores and courses are not attached automatically.</p>
        </section>

        <section style={{ ...cardStyle, padding: '34px 30px' }}>
          <h2
            style={{
              marginTop: 0,
              marginBottom: '14px',
              color: COLORS.darkTeal,
              fontSize: '1.35rem',
            }}
          >
            Keeping a separate copy
          </h2>
          <p style={{ margin: 0, color: COLORS.charcoal, lineHeight: 1.75 }}>
            Save a backup after each round or course change, and before switching phones or clearing
            browser data. Store it outside this browser, such as in Files or iCloud Drive, and keep
            your two most recent copies. A backup can only restore data included when it was saved.
          </p>
        </section>
      </main>
    </div>
  );
}
