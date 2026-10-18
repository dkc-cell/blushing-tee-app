import React from 'react';
import { COLORS } from '../constants';

export default function JournalArticleBody({ article }) {
  return (
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
      const isStoryQuote =
        article.slug === 'my-story' &&
        paragraph ===
          'After a period away from golf, following an unexpected setback, returning to the game reminded me that confidence often comes back quietly — one small step at a time. Sometimes progress is not dramatic. Sometimes it is simply showing up again.';

      const isArticleTagline = index === article.content.length - 1;

      const isSectionHeading =
        paragraph.length < 42 &&
        !paragraph.includes('.') &&
        !paragraph.includes('?') &&
        !paragraph.includes('!');

      if (isStoryQuote) {
        return (
          <p
            key={index}
            style={{
              margin: '10px 0 28px',
              paddingLeft: '24px',
              borderLeft: `3px solid ${COLORS.blush}`,
              fontStyle: 'italic',
              color: '#587072',
            }}
          >
            {paragraph}
          </p>
        );
      }

      if (isArticleTagline) {
        return (
          <p
            key={index}
            style={{
              margin: '10px 0 0',
              color: COLORS.darkTeal,
              fontWeight: 700,
              fontSize: '1.14rem',
              letterSpacing: '0.01em',
            }}
          >
            {paragraph}
          </p>
        );
      }

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
  );
}
