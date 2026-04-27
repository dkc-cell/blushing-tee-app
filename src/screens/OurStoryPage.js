import React from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants';
import logo from '../assets/images/Blushing_Birdie_Logo.png';
import { journalArticles } from '../data/journalArticles';

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

export default function OurStoryPage() {
  const storyArticle = journalArticles.find((article) => article.slug === 'my-story');
  const storyContent = storyArticle?.content ?? [];

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

          <Link
            to="/"
            style={{
              color: COLORS.darkTeal,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Back Home
          </Link>
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
            Our Story
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
            Our Story
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
            {storyArticle?.excerpt}
          </p>
        </div>

        <section style={{ ...cardStyle, padding: '34px 30px' }}>
          {storyContent.map((paragraph, index) => {
            const isHeading =
              paragraph.length < 42 &&
              !paragraph.includes('.') &&
              !paragraph.includes('?') &&
              !paragraph.includes('!');
            const isTagline = index === storyContent.length - 1;

            if (isHeading) {
              return (
                <h2
                  key={index}
                  style={{
                    marginTop: index === 0 ? 0 : '30px',
                    marginBottom: '14px',
                    color: COLORS.darkTeal,
                    fontSize: '1.35rem',
                  }}
                >
                  {paragraph}
                </h2>
              );
            }

            return (
              <p
                key={index}
                style={{
                  margin: isTagline ? '22px 0 0' : '0 0 16px',
                  color: isTagline ? COLORS.darkTeal : COLORS.charcoal,
                  lineHeight: 1.75,
                  fontWeight: isTagline ? 700 : 400,
                }}
              >
                {paragraph}
              </p>
            );
          })}
        </section>
      </main>
    </div>
  );
}
