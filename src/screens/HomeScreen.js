import React, { useState } from 'react';
import { Flag, MapPin, BarChart3, ChevronRight } from 'lucide-react';
import ActiveRoundCard from '../components/ActiveRoundCard';
import logo from '../assets/images/Blushing_Birdie_Logo.png';
import './TrackerHome.css';

export default function HomeScreen({ savedCourses = [], onNavigate, activeRound = null, onResumeRound, onEndActiveRound }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const actions = [
    ['selectCourse', 'Start a Round', 'Choose your course and how you want to score.', Flag],
    ['manageCourses', 'My Courses', savedCourses.length ? `${savedCourses.length} saved · Add or edit a course` : 'Save a course to use again next time.', MapPin],
    ['stats', 'My Rounds & Stats', 'Review your rounds and see your progress.', BarChart3],
  ];
  return <main className="tracker-home">
    <header className="th-brand"><img src={logo} alt="Blushing Birdie" /><div><h1>Blushing Birdie</h1><p>Confidence, one swing at a time.</p></div></header>
    <div className="th-content">
      {activeRound && <ActiveRoundCard activeRound={activeRound} onResume={onResumeRound} onEndRoundEarly={onEndActiveRound} />}
      <nav aria-label="Tracker actions" className="th-actions">{actions.map(([screen, title, description, Icon], i) => <button key={screen} className={i === 0 ? 'th-action th-primary' : 'th-action'} onClick={() => onNavigate(screen)}><Icon aria-hidden="true" size={25} /><span><strong>{title}</strong><small>{description}</small></span><ChevronRight aria-hidden="true" size={20} /></button>)}</nav>
      <button className="th-more" aria-expanded={moreOpen} aria-controls="th-more-options" onClick={() => setMoreOpen(!moreOpen)}>More {moreOpen ? '−' : '+'}</button>
      {moreOpen && <nav id="th-more-options" aria-label="More options" className="th-secondary"><button onClick={() => onNavigate('about')}>About & Help <ChevronRight aria-hidden="true" size={18} /></button><button onClick={() => onNavigate('accountBackup')}>Backup & Account <ChevronRight aria-hidden="true" size={18} /></button></nav>}
    </div>
  </main>;
}
