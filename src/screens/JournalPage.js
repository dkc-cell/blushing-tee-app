import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { journalArticles } from '../data/journalArticles';
import { COLORS } from '../constants';

export default function JournalPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [sortOrder, setSortOrder] = useState('newest');

  const categories = [
    'All Topics',
    ...new Set(journalArticles.map((article) => article.category)),
  ];

  const filteredArticles = useMemo(() => {
    let results = [...journalArticles];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      results = results.filter((article) => {
        return (
          article.title.toLowerCase().includes(term) ||
          article.excerpt.toLowerCase().includes(term) ||
          article.category.toLowerCase().includes(term)
        );
      });
    }

    if (selectedCategory !== 'All Topics') {
      results = results.filter(
        (article) => article.category === selectedCategory
      );
    }

    if (sortOrder === 'newest') {
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (sortOrder === 'oldest') {
      results.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (sortOrder === 'az') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    return results;
  }, [searchTerm, selectedCategory, sortOrder]);

  return (
    <div style={{ padding: '72px 24px', background: '#f8f5f2' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Link
            to="/"
            style={{
                display: 'inline-block',
                marginBottom: '26px',
                color: COLORS.darkTeal,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
            }}
            >
            ← Back to Home
            </Link>

        {/* HEADER */}
        <p style={{
          fontSize: '0.78rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: COLORS.blush,
          fontWeight: 700,
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          Editorial
        </p>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontWeight: 515,
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          color: COLORS.darkTeal,
          textAlign: 'center',
          marginBottom: '16px',
        }}>
          the birdie journal
        </h1>

        <p style={{
          maxWidth: '760px',
          margin: '0 auto 42px',
          lineHeight: 1.7,
          color: '#4f6365',
          textAlign: 'center',
        }}>
          Thoughtful notes, simple encouragement, and everyday reflections for women who love the game.
        </p>

        {/* SEARCH + FILTER */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: '14px',
          marginBottom: '34px',
        }}>
          <input
            type="text"
            placeholder="Search by title, topic, or keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid #d8e1e2',
            }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '14px 18px',
              borderRadius: '999px',
              border: '1px solid #d8e1e2',
            }}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: '14px 18px',
              borderRadius: '999px',
              border: '1px solid #d8e1e2',
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">A–Z</option>
          </select>
        </div>

        {/* ARTICLES */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
            }}>

          {filteredArticles.map((article) => (
           <Link
                key={article.slug}
                to={`/journal/${article.slug}`}
                style={{
                    textDecoration: 'none',
                    display: 'flex',
                }}
                >
              <div style={{
                    background: '#ffffff',
                    borderRadius: '28px',
                    padding: '28px',
                    border: '1px solid #dbe4e5',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    width: '100%',
                    boxSizing: 'border-box',
                    }}>
                <p style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: COLORS.blush,
                  fontWeight: 700,
                  marginBottom: '12px',
                }}>
                  {article.category}
                </p>

                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  color: COLORS.darkTeal,
                  fontSize: '1.4rem',
                  marginBottom: '10px',
                }}>
                  {article.title}
                </h2>

                <p style={{
                  fontSize: '0.85rem',
                  color: '#7a8b8d',
                  marginBottom: '12px',
                }}>
                 {new Date(article.date + 'T12:00:00').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                </p>

                <p style={{
                  color: '#4f6365',
                  lineHeight: 1.7,
                }}>
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}