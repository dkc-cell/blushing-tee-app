import React from 'react';
import { Link } from 'react-router-dom';
import JournalArticleBody from '../components/JournalArticleBody';
import { journalArticles } from '../data/journalArticles';
import { COLORS } from '../constants';
import './AboutScreen.css';

export default function AboutScreen({ onNavigate }) {
  const story = journalArticles.find(article => article.slug === 'my-story');
  const card = { background: 'white', padding: 20, borderRadius: 16, marginBottom: 24, lineHeight: 1.6 };
  return <main className="tracker-about" style={{ background: COLORS.cream, minHeight: '100dvh', color: COLORS.darkTeal, padding: '20px 18px' }}><div style={{ maxWidth: 560, margin: 'auto' }}>
    <button onClick={() => onNavigate('home')} style={{ border: 0, background: 'none', color: COLORS.darkTeal, minHeight: 44, padding: 0 }}>← Back to Home</button>
    <h1 className="tracker-about-title">About & Help</h1>
    <article style={card} aria-labelledby="tracker-story-title">
      <h2 id="tracker-story-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: 16 }}>{story.title}</h2>
      <p style={{ color: '#7a8b8d', fontSize: '0.92rem', marginBottom: 30 }}>March 6, 2026</p>
      <p style={{ fontSize: '1.08rem', lineHeight: 1.85, color: '#5c7072', fontStyle: 'italic', marginBottom: 34 }}>{story.excerpt}</p>
      <JournalArticleBody article={story} />
    </article>
    <section className="tracker-help-card" style={card}><h2>Using your tracker</h2><ol style={{ paddingLeft: 20 }}><li><strong>Start a Round:</strong> choose a saved course or start without one. Pick Quick Score or Detailed Tracking.</li><li><strong>My Courses:</strong> add a reusable course with its name and hole information, or edit an existing one.</li><li><strong>My Rounds & Stats:</strong> review saved rounds and your progress.</li></ol><p><strong>Naming your round:</strong> In Quick Score, tap the course name to name today’s round. Naming a round does not automatically add it to My Courses.</p><p><strong>Hole details:</strong> Par is optional and yardage is hidden in Quick Score.</p><p><strong>Saved courses:</strong> fill in hole information for future rounds. You can also save a course after a round when you’ve entered its hole information.</p><p><strong>Resume Round:</strong> return to an unfinished round.</p><p><strong>End Round Early:</strong> save only recorded holes.</p></section>
    <section className="tracker-help-card" style={card}><h2>Your scoring options</h2><p><strong>Quick Score:</strong> enter the total, with optional putts and fairway or par-3 green results. These details never change your entered score.</p><p><strong>Detailed Tracking:</strong> record your tee result, approaches, short game, and putts; the app calculates the hole score.</p><p>Skipped details are excluded from the relevant statistics. Par-based comparisons use only holes where par is entered.</p></section>
    <section className="tracker-help-card" style={card}><h2>Tracking your progress</h2><p>Blushing Birdie does not calculate an official handicap. Golfers who maintain one can post eligible scores through GHIN or their handicap service.</p></section>
    <section className="tracker-help-card" style={card}><h2>Your data & backups</h2><p>No account is required. Your rounds and courses are stored in this browser on this device by default. Signing in for account sync is optional.</p><p>Use <strong>More → Backup & Account</strong> for account options and the link to file exports and imports. </p><p><strong>Export Backup:</strong> save a backup of your saved rounds and courses.</p><p><strong>Export CSV:</strong> make a spreadsheet of your rounds.</p><p><strong>Import Backup:</strong> read the confirmation before importing, since it may replace device data.</p><Link to="/privacy">Read the privacy information →</Link></section>
    <section className="tracker-help-card" style={card}><h2>Explore Blushing Birdie</h2><p><a href="/" target="_blank" rel="noopener noreferrer">Visit the website ↗</a></p></section>
    <button onClick={() => onNavigate('home')} style={{ border: 0, background: 'none', color: COLORS.darkTeal, minHeight: 44, padding: 0 }}>← Back to Home</button>
  </div></main>;
}
