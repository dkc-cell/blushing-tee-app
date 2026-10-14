import React from 'react';
import { Link } from 'react-router-dom';
import { journalArticles } from '../data/journalArticles';
import { COLORS } from '../constants';

export default function AboutScreen({ onNavigate }) {
  const story = journalArticles.find(article => article.slug === 'my-story');
  const card = { background: 'white', padding: 20, borderRadius: 16, marginBottom: 14, lineHeight: 1.6 };
  return <main style={{ background: COLORS.cream, minHeight: '100dvh', color: COLORS.darkTeal, padding: '20px 18px' }}><div style={{ maxWidth: 560, margin: 'auto' }}>
    <button onClick={() => onNavigate('home')} style={{ border: 0, background: 'none', color: COLORS.darkTeal, minHeight: 44, padding: 0 }}>← Back to Home</button>
    <h1>About & Help</h1>
    <section style={card}><h2>Our Story</h2><p>{story?.excerpt}</p><p>{story?.content[2]}</p><Link to="/our-story">Read the full Blushing Birdie story →</Link></section>
    <section style={card}><h2>Using your tracker</h2><ol style={{ paddingLeft: 20 }}><li><strong>Start a Round:</strong> choose a saved course or start without one. Pick Quick Score or Detailed Tracking.</li><li><strong>My Courses:</strong> add a reusable course with its name and hole information, or edit an existing one.</li><li><strong>My Rounds & Stats:</strong> review saved rounds and your progress.</li></ol><p>In Quick Score, tap the course name to name today’s round. Par is optional and yardage is hidden. Naming a round does not automatically add it to My Courses.</p><p>Saved courses fill in hole information for future rounds. You can also save a course after a round when you’ve entered its hole information.</p><p>Resume Round returns to an unfinished round. End Round Early saves only recorded holes.</p></section>
    <section style={card}><h2>Your scoring options</h2><p><strong>Quick Score:</strong> enter the total, with optional putts and fairway or par-3 green results. These details never change your entered score.</p><p><strong>Detailed Tracking:</strong> record your tee result, approaches, short game, and putts; the app calculates the hole score.</p><p>Skipped details are excluded from the relevant statistics. Par-based comparisons use only holes where par is entered.</p></section>
    <section style={card}><h2>Tracking your progress</h2><p>Blushing Birdie does not calculate an official handicap. Golfers who maintain one can post eligible scores through GHIN or their handicap service.</p></section>
    <section style={card}><h2>Your data & backups</h2><p>No account is required. Your rounds and courses are stored in this browser on this device by default. Signing in for account sync is optional.</p><p>Use <strong>More → Backup & Account</strong> for account options and the link to file exports and imports. Export Backup saves a full backup; Export CSV makes a spreadsheet of your rounds. Read the confirmation before importing a backup, since it may replace device data.</p><Link to="/privacy">Read the privacy information →</Link></section>
    <section style={card}><h2>Explore Blushing Birdie</h2><p><Link to="/">Visit the website</Link> · <Link to="/journal">Read the Birdie Journal</Link></p></section>
  </div></main>;
}
