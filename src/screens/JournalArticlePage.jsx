import BackButton from '../components/BackButton';
import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import JournalArticleBody from '../components/JournalArticleBody';
import { journalArticles } from '../data/journalArticles';
import { COLORS } from '../constants';
import { absoluteUrl, organizationSchema, usePageSeo } from '../utils/seo';

export default function JournalArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const article = journalArticles.find((item) => item.slug === slug);

  usePageSeo({
    title: article
      ? `${article.title} - Blushing Birdie Journal`
      : 'Article Not Found - Blushing Birdie Journal',
    description:
      article?.excerpt ??
      'This Blushing Birdie Journal article could not be found.',
    path: article ? `/journal/${article.slug}` : '/journal',
    type: 'article',
    robots: article ? 'index,follow' : 'noindex,follow',
    structuredData: article
      ? [
          organizationSchema,
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `${absoluteUrl(`/journal/${article.slug}`)}#article`,
            headline: article.title,
            description: article.excerpt,
            datePublished: article.date,
            dateModified: article.date,
            author: {
              '@type': 'Organization',
              name: 'Blushing Birdie',
            },
            publisher: { '@id': `${absoluteUrl('/')}#organization` },
            mainEntityOfPage: absoluteUrl(`/journal/${article.slug}`),
            articleSection: article.category,
            about: [
              'women golfers',
              'golf confidence',
              'golf mindset',
              'Blushing Birdie golf tracker',
            ],
          },
        ]
      : [organizationSchema],
  });

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

          <BackButton onClick={() => navigate('/journal')}>Back to Journal</BackButton>
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
        <BackButton onClick={() => navigate('/journal')}>Back to Journal</BackButton>

       <article
  style={{
    background: '#ffffff',
    borderRadius: 'clamp(24px, 4vw, 32px)',
    padding: 'clamp(30px, 6vw, 52px) clamp(22px, 5vw, 44px)',
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

  <JournalArticleBody article={article} />
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
            <BackButton onClick={() => navigate('/journal')}>Back to Journal</BackButton>
          </div>
        </div>
      </div>
    </div>
  );
}
