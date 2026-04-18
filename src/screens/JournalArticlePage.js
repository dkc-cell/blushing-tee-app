import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { journalArticles } from '../data/journalArticles';
import { COLORS } from '../constants';

export default function JournalArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const article = journalArticles.find((item) => item.slug === slug);

  const relatedArticles = journalArticles
    .filter((item) => item.slug !== slug)
    .slice(0, 2);

  if (!article) {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '80px 24px',
          background: '#f8f5f2',
        }}
      >
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '28px',
            padding: '40px 28px',
            border: '1px solid #dbe4e5',
          }}
        >
          <h2
            style={{
              color: COLORS.darkTeal,
              fontFamily: "'Playfair Display', serif",
              marginBottom: '14px',
            }}
          >
            Article not found
          </h2>

          <p style={{ color: '#4f6365', marginBottom: '22px' }}>
            This article could not be found.
          </p>

          <button
            onClick={() => navigate('/journal')}
            style={{
              background: COLORS.darkTeal,
              color: COLORS.cream,
              border: 'none',
              borderRadius: '999px',
              padding: '14px 22px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Back to Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#f8f5f2',
        minHeight: '100vh',
        padding: '42px 24px 84px',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/journal')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            marginBottom: '28px',
            color: COLORS.darkTeal,
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          ← Back to Journal
        </button>

       <article
  style={{
    background: '#ffffff',
    borderRadius: window.innerWidth <= 768 ? '24px' : '32px',
    padding: window.innerWidth <= 768 ? '30px 22px' : '52px 44px',
    border: '1px solid #dbe4e5',
    boxShadow: '0 14px 36px rgba(16, 62, 67, 0.06)',
  }}
>
  <p
    style={{
      fontSize: '0.74rem',
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: COLORS.blush,
      fontWeight: 700,
      marginBottom: '16px',
    }}
  >
    {article.category}
  </p>

  <h1
    style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: 'clamp(2.15rem, 4vw, 3.35rem)',
      lineHeight: 1.14,
      color: COLORS.darkTeal,
      fontWeight: 500,
      marginBottom: '16px',
      maxWidth: '680px',
    }}
  >
    {article.title}
  </h1>

  <p
    style={{
      fontSize: '0.92rem',
      color: '#7a8b8d',
      letterSpacing: '0.02em',
      marginBottom: '30px',
    }}
  >
    {new Date(article.date + 'T12:00:00').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}
  </p>

  <p
    style={{
      fontSize: '1.08rem',
      lineHeight: 1.85,
      color: '#5c7072',
      fontStyle: 'italic',
      marginBottom: '34px',
      maxWidth: '660px',
    }}
  >
    {article.excerpt}
  </p>

  <div
    style={{
      borderTop: '1px solid rgba(16, 62, 67, 0.10)',
      paddingTop: '32px',
      color: '#415759',
      fontSize: '1.05rem',
      lineHeight: 1.95,
      maxWidth: '660px',
    }}
  >
    {article.content.map((paragraph, index) => {
      const isSectionHeading =
        paragraph.length < 42 &&
        !paragraph.includes('.') &&
        !paragraph.includes('?') &&
        !paragraph.includes('!');

      if (isSectionHeading) {
        return (
          <h2
            key={index}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.42rem',
              lineHeight: 1.32,
              color: COLORS.darkTeal,
              fontWeight: 600,
              marginTop: index === 0 ? '0' : '34px',
              marginBottom: '14px',
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
            margin: '0 0 22px',
          }}
        >
          {paragraph}
        </p>
      );
    })}
  </div>
</article>

        <div style={{ marginTop: '44px' }}>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              color: COLORS.darkTeal,
              fontSize: '1.5rem',
              marginBottom: '18px',
            }}
          >
            More from The Birdie Journal
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '18px',
            }}
          >
            {relatedArticles.map((item) => (
              <Link
                key={item.slug}
                to={`/journal/${item.slug}`}
                style={{
                  textDecoration: 'none',
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '22px',
                  border: '1px solid #dbe4e5',
                  boxShadow: '0 10px 24px rgba(16, 62, 67, 0.05)',
                }}
              >
                <p
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: COLORS.blush,
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  {item.category}
                </p>

                <h4
                  style={{
                    color: COLORS.darkTeal,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.2rem',
                    lineHeight: 1.4,
                    marginBottom: '8px',
                  }}
                >
                  {item.title}
                </h4>

                <p
                  style={{
                    color: '#4f6365',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {item.excerpt}
                </p>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: '26px' }}>
            <button
              onClick={() => navigate('/journal')}
              style={{
                background: COLORS.darkTeal,
                color: COLORS.cream,
                border: 'none',
                borderRadius: '999px',
                padding: '14px 24px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Back to all articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}