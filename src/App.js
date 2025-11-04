import React, { useState, useEffect } from 'react';
import { Heart, Flag, ChevronRight, CheckCircle2, BarChart3, BookOpen } from 'lucide-react';
import logo from './assets/images/Blushing_Birdie_Logo.png';
import tagline from './assets/images/Blushing_Birdie_Tagline.png';
import './SplashScreen.css';

const COLORS = {

  blush: '#F4A8B9',
  mistyBlue: '#ACC8C8',
  darkTeal: '#103E43',
  charcoal: '#1F2B2D',
  cream: '#FFF9F5'
};

const ENCOURAGING_QUOTES = [
  "Every swing is a step forward 💗",
  "Breathe in the moment, enjoy the game 💗",
  "Progress over perfection ✨",
  "You're exactly where you need to be 🌿",
  "Celebrate the small wins today 💗"
];

const HOLE_PARS = [4, 4, 3, 5, 4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 3, 4, 5, 4];
const HOLE_YARDAGES = [350, 380, 160, 490, 360, 145, 400, 520, 370, 340, 390, 170, 510, 350, 155, 380, 500, 385];

export default function App() {
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // All existing state
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentHole, setCurrentHole] = useState(1);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState([]);
  const [recordedHoles, setRecordedHoles] = useState(new Set());
  const [editingHole, setEditingHole] = useState(false);
  const [savedCourses, setSavedCourses] = useState([]);
  const [showSaveCourseModal, setShowSaveCourseModal] = useState(false);
  const [inputCourseName, setInputCourseName] = useState('');
  
  const [drive, setDrive] = useState('');
  const [approaches, setApproaches] = useState(0);
  const [chips, setChips] = useState(0);
  const [putts, setPutts] = useState(0);
  const [penalties, setPenalties] = useState({ water: 0, lost: 0, ob: 0 });
  const [holeNotes, setHoleNotes] = useState('');
  
  const [customPars, setCustomPars] = useState({});
  const [customYardages, setCustomYardages] = useState({});
  const [showParModal, setShowParModal] = useState(false);
  const [showYardageModal, setShowYardageModal] = useState(false);
  const [tempYardage, setTempYardage] = useState('');

  const [selectedRound, setSelectedRound] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  
  // Course creation state
  const [newCourseName, setNewCourseName] = useState('');
  const [newCoursePars, setNewCoursePars] = useState({});
  const [newCourseYardages, setNewCourseYardages] = useState({});

 // New modal states
  const [showCourseSelectionModal, setShowCourseSelectionModal] = useState(false);
  const [showManageCoursesModal, setShowManageCoursesModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showYardageModalForHole, setShowYardageModalForHole] = useState(null);



  // Splash screen effect - hide after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Load rounds from localStorage on app startup
  useEffect(() => {
    try {
      const savedRounds = localStorage.getItem('blushingTeeRounds');
      if (savedRounds) {
        const parsedRounds = JSON.parse(savedRounds);
        setRounds(parsedRounds);
      }
      
      const savedCoursesData = localStorage.getItem('blushingTeeCourses');
      if (savedCoursesData) {
        const parsedCourses = JSON.parse(savedCoursesData);
        setSavedCourses(parsedCourses);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save rounds to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('blushingTeeRounds', JSON.stringify(rounds));
    } catch (error) {
      console.error('Error saving rounds to localStorage:', error);
    }
  }, [rounds]);
  
  // Save courses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('blushingTeeCourses', JSON.stringify(savedCourses));
    } catch (error) {
      console.error('Error saving courses to localStorage:', error);
    }
  }, [savedCourses]);

  const totalShots = (drive ? 1 : 0) + approaches + chips + putts;
  const totalWithPenalties = totalShots + penalties.water + penalties.lost + penalties.ob;
  
  const getCurrentPar = () => customPars[currentHole] || HOLE_PARS[currentHole - 1];
  const getCurrentYardage = () => customYardages[currentHole] || HOLE_YARDAGES[currentHole - 1];

  const stats = {
    fairwaysHit: rounds.length > 0 ? (() => {
      const allHoles = rounds.flatMap(r => r.holes);
      const fairwayHoles = allHoles.filter(h => h.par > 3);
      const fairwaysHit = allHoles.filter(h => h.fairwayHit && h.par > 3).length;
      return fairwayHoles.length > 0 ? Math.round((fairwaysHit / fairwayHoles.length) * 100) : 0;
    })() : 0,
    avgPutts: rounds.flatMap(r => r.holes).length > 0 ? (rounds.flatMap(r => r.holes).reduce((sum, h) => sum + h.putts, 0) / rounds.flatMap(r => r.holes).length).toFixed(1) : 0
  };

  // If splash screen is showing, render only the splash screen
  if (showSplash) {
    return (
      <div className="splash-screen">
        <div className="splash-container">
          {/* Logo - First Screen (2 seconds) */}
          <div className="logo-screen">
            <img 
              src={logo} 
              alt="Blushing Birdie" 
              className="logo-image"
            />
          </div>

          {/* Tagline - Second Screen (appears after 2 seconds) */}
          <div className="tagline-screen">
            <img 
              src={tagline} 
              alt="confidence, one swing at a time" 
              className="tagline-image"
            />
          </div>
        </div>
      </div>
    );
  }

  const NumberPad = ({ onNumberClick, onBackspace, onClear, onDone, value }) => {
    const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', '←'];
    
    return (
      <div style={{ padding: "1.25rem" }}>
        <div style={{ backgroundColor: COLORS.cream, padding: "1.25rem", borderRadius: "0.75rem", marginBottom: "1rem", border: `3px solid ${COLORS.mistyBlue}`, textAlign: "center", fontSize: "1.875rem", fontWeight: "bold", color: COLORS.charcoal, minHeight: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {value || '0'}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
          {buttons.map(btn => (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'Clear') onClear();
                else if (btn === '←') onBackspace();
                else onNumberClick(btn);
              }}
              style={{ padding: "1.25rem", fontSize: "1.5rem", fontWeight: "bold", borderRadius: "0.75rem", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", transition: "all 0.3s", border: "none",
                backgroundColor: btn === 'Clear' || btn === '←' ? COLORS.mistyBlue : COLORS.blush,
                color: COLORS.charcoal
              }}
            >
              {btn}
            </button>
          ))}
        </div>
        <button
          onClick={onDone}
          disabled={!value || value === '0'}
          style={{ width: "100%", padding: "1.25rem", fontSize: "1.25rem", fontWeight: "bold", borderRadius: "0.75rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", border: "none",
            backgroundColor: (!value || value === '0') ? '#E0E0E0' : COLORS.darkTeal,
            color: (!value || value === '0') ? COLORS.charcoal : COLORS.cream,
            cursor: (!value || value === '0') ? 'not-allowed' : 'pointer'
          }}
        >
          Done
        </button>
      </div>
    );
  };

  const QuickCounter = ({ value, onChange, max = 10, type = 'approach' }) => {
    const getColor = (index) => {
      const position = index / (max - 1);
      if (type === 'approach') {
        const baseR = 220, baseG = 235, baseB = 235;
        const endR = 172, endG = 200, endB = 200;
        const r = Math.round(baseR + (endR - baseR) * position);
        const g = Math.round(baseG + (endG - baseG) * position);
        const b = Math.round(baseB + (endB - baseB) * position);
        return `rgb(${r}, ${g}, ${b})`;
      }
      if (type === 'chip') {
        const r = Math.round(16 + (172 - 16) * (1 - position));
        const g = Math.round(62 + (200 - 62) * (1 - position));
        const b = Math.round(67 + (200 - 67) * (1 - position));
        return `rgb(${r}, ${g}, ${b})`;
      }
      if (type === 'putt') {
        const r = Math.round(244 + (255 - 244) * (1 - position));
        const g = Math.round(168 + (220 - 168) * (1 - position));
        const b = Math.round(185 + (230 - 185) * (1 - position));
        return `rgb(${r}, ${g}, ${b})`;
      }
      return COLORS.mistyBlue;
    };
    
    return (
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {[...Array(max)].map((_, i) => {
          const isSelected = i < value;
          const bgColor = getColor(i);
          const textColor = type === 'chip' ? COLORS.cream : COLORS.charcoal;
          
          return (
            <button
              key={i}
              onClick={() => onChange(value === i + 1 ? i : i + 1)}
              style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", fontSize: "1.5rem", fontWeight: "bold", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", cursor: "pointer", transition: "all 0.3s",
                backgroundColor: isSelected ? COLORS.cream : bgColor,
                color: isSelected ? COLORS.charcoal : textColor,
                border: `3px solid ${bgColor}`
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    );
  };

  const completeHole = () => {
    const newHoleData = {
      hole: currentHole,
      par: getCurrentPar(),
      yardage: getCurrentYardage(),
      drive,
      approaches,
      chips,
      putts,
      penalties,
      total: totalWithPenalties,
      notes: holeNotes,
      fairwayHit: drive === 'middle'
    };
    
    const updatedRound = [...currentRound.filter(h => h.hole !== currentHole), newHoleData].sort((a, b) => a.hole - b.hole);
    setCurrentRound(updatedRound);
    
    const newRecorded = new Set(recordedHoles);
    newRecorded.add(currentHole);
    setRecordedHoles(newRecorded);
    setEditingHole(false);
    
    setDrive('');
    setApproaches(0);
    setChips(0);
    setPutts(0);
    setPenalties({ water: 0, lost: 0, ob: 0 });
    setHoleNotes('');
    
    setTimeout(() => {
      if (currentHole < 18) {
        setCurrentHole(currentHole + 1);
      } else {
        setCurrentScreen('roundComplete');
      }
    }, 800);
  };

  const enableEditHole = () => {
    const recordedData = currentRound.find(h => h.hole === currentHole);
    if (recordedData) {
      setDrive(recordedData.drive);
      setApproaches(recordedData.approaches);
      setChips(recordedData.chips);
      setPutts(recordedData.putts);
      setPenalties(recordedData.penalties);
      setHoleNotes(recordedData.notes);
      setEditingHole(true);
      const newRecorded = new Set(recordedHoles);
      newRecorded.delete(currentHole);
      setRecordedHoles(newRecorded);
    }
  };

  const completeRound = () => {
    if (currentRound.length === 0) {
      alert('Please log at least one hole before completing the round.');
      return;
    }
    
    // Get local date (not UTC)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    
    alert(`Round being saved with date: ${currentDate} (Local time: ${today.toLocaleString()})`);
    console.log('Completing round with date:', currentDate);
    console.log('Local date object:', today);
    console.log('UTC date:', today.toISOString().slice(0, 10));
    
    const newRound = {
      date: currentDate,
      holes: currentRound,
      courseName: inputCourseName || 'Unnamed Course',
      customPars,
      customYardages
    };
    
    console.log('New round object:', newRound);
    setRounds([...rounds, newRound]);
    setCurrentScreen('roundComplete');
  };

  const saveCourse = (name, parsData = {}, yardagesData = {}, isEdit = false, courseId = null) => {
    if (!name.trim()) {
      alert('Please enter a course name');
      return;
    }
    
    // Check if course name already exists (but allow if editing the same course)
    const existingCourse = savedCourses.find(c => 
      c.name.toLowerCase() === name.trim().toLowerCase() && 
      (!isEdit || c.id !== courseId)
    );
    
    if (existingCourse) {
      const shouldOverwrite = window.confirm(
        `A course named "${name.trim()}" already exists. Would you like to overwrite it?`
      );
      
      if (!shouldOverwrite) {
        return;
      }
      
      // Remove the old course
      setSavedCourses(savedCourses.filter(c => c.id !== existingCourse.id));
    }
    
    const courseData = {
      id: isEdit && courseId ? courseId : Date.now(),
      name: name.trim(),
      pars: {},
      yardages: {}
    };
    
    // Use provided data or fall back to current customPars/customYardages
    const sourcePars = Object.keys(parsData).length > 0 ? parsData : customPars;
    const sourceYardages = Object.keys(yardagesData).length > 0 ? yardagesData : customYardages;
    
    for (let i = 1; i <= 18; i++) {
      courseData.pars[i] = sourcePars[i] || HOLE_PARS[i - 1];
      courseData.yardages[i] = sourceYardages[i] || HOLE_YARDAGES[i - 1];
    }
    
    if (isEdit) {
      // Update existing course
      setSavedCourses(savedCourses.map(c => c.id === courseId ? courseData : c));
      alert(`"${name.trim()}" has been updated!`);
    } else {
      // Add new course
      setSavedCourses([...savedCourses.filter(c => c.id !== existingCourse?.id), courseData]);
      alert(`"${name.trim()}" has been saved!`);
    }
    
    setShowSaveCourseModal(false);
    setInputCourseName('');
    setEditingCourse(null);
  };

  const calcStats = (holes) => {
    if (holes.length === 0) return null;
    
    const totalScore = holes.reduce((sum, h) => sum + h.total, 0);
    const totalPar = holes.reduce((sum, h) => sum + h.par, 0);
    const totalPutts = holes.reduce((sum, h) => sum + h.putts, 0);
    const fairwayHoles = holes.filter(h => h.par > 3);
    const fairwaysHit = holes.filter(h => h.fairwayHit && h.par > 3).length;
    
    const par3Holes = holes.filter(h => h.par === 3);
    const par4Holes = holes.filter(h => h.par === 4);
    const par5Holes = holes.filter(h => h.par === 5);
    
    return {
      totalScore,
      totalPar,
      scoreToPar: totalScore - totalPar,
      avgScore: (totalScore / holes.length).toFixed(1),
      avgPutts: (totalPutts / holes.length).toFixed(1),
      totalPutts,
      fairwayPct: fairwayHoles.length > 0 ? Math.round((fairwaysHit / fairwayHoles.length) * 100) : 0,
      fairwaysHit,
      totalFairways: fairwayHoles.length,
      avgPar3: par3Holes.length > 0 ? (par3Holes.reduce((sum, h) => sum + h.total, 0) / par3Holes.length).toFixed(1) : 'N/A',
      avgPar4: par4Holes.length > 0 ? (par4Holes.reduce((sum, h) => sum + h.total, 0) / par4Holes.length).toFixed(1) : 'N/A',
      avgPar5: par5Holes.length > 0 ? (par5Holes.reduce((sum, h) => sum + h.total, 0) / par5Holes.length).toFixed(1) : 'N/A'
    };
  };

  const exportData = () => {
    let filteredRounds = rounds;
    
    if (exportStartDate || exportEndDate) {
      filteredRounds = rounds.filter(r => {
        const roundDate = new Date(r.date);
        const start = exportStartDate ? new Date(exportStartDate) : new Date('1900-01-01');
        const end = exportEndDate ? new Date(exportEndDate) : new Date('2100-12-31');
        // Set end date to end of day
        end.setHours(23, 59, 59, 999);
        return roundDate >= start && roundDate <= end;
      });
    }
    
    if (filteredRounds.length === 0) {
      alert('No rounds found in the selected date range.');
      return;
    }
    
    try {
      const csvContent = [
        ['Date', 'Course', 'Hole', 'Par', 'Yardage', 'Score', 'Drive', 'Approaches', 'Chips', 'Putts', 'Penalties', 'Fairway Hit', 'Notes'].join(','),
        ...filteredRounds.flatMap(round =>
          round.holes.map(hole => [
            round.date,
            `"${round.courseName || 'Unnamed Course'}"`,
            hole.hole,
            hole.par,
            hole.yardage,
            hole.total,
            hole.drive,
            hole.approaches,
            hole.chips,
            hole.putts,
            hole.penalties.water + hole.penalties.lost + hole.penalties.ob,
            hole.fairwayHit ? 'Yes' : 'No',
            `"${hole.notes || ''}"`
          ].join(','))
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `blushing-tee-stats-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setShowExportModal(false);
      setExportStartDate('');
      setExportEndDate('');
      
      alert('CSV file downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('There was an error exporting the data. Please try again.');
    }
  };

  if (currentScreen === 'home') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '80px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: COLORS.blush, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
            </div>
            <span style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: '600' }}>The Blushing Tee</span>
          </div>
          {savedCourses.length > 0 && (
            <div style={{ marginTop: '12px', fontSize: '14px', color: COLORS.mistyBlue }}>
              {savedCourses.length} saved course{savedCourses.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        <div style={{ padding: '24px' }}>
          <h1 style={{ color: COLORS.darkTeal, fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>Welcome back,</h1>
          <h1 style={{ color: COLORS.darkTeal, fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }}>Blushing Tee!</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: `linear-gradient(135deg, ${COLORS.mistyBlue}33 0%, #FFFFFF 100%)`, borderRadius: '24px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ color: COLORS.darkTeal, fontSize: '14px', marginBottom: '4px' }}>Fairways Hit</div>
              <div style={{ color: COLORS.darkTeal, fontSize: '40px', fontWeight: 'bold' }}>{stats.fairwaysHit}%</div>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${COLORS.blush}33 0%, #FFFFFF 100%)`, borderRadius: '24px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ color: COLORS.darkTeal, fontSize: '14px', marginBottom: '4px' }}>Avg Putts</div>
              <div style={{ color: COLORS.darkTeal, fontSize: '40px', fontWeight: 'bold' }}>{stats.avgPutts}</div>
            </div>
          </div>

   {/* Course Selection Modal */}
        {showCourseSelectionModal && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px'
            }}
            onClick={() => setShowCourseSelectionModal(false)}
          >
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px', 
                padding: '32px',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '24px', textAlign: 'center' }}>
                Select a Course
              </h3>
              
              {savedCourses.length > 0 ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {savedCourses.map(course => (
                      <button
                        key={course.id}
                        onClick={() => {
                          setCustomPars(course.pars);
                          setCustomYardages(course.yardages);
                          setInputCourseName(course.name);
                          setCurrentHole(1);
                          setShowCourseSelectionModal(false);
                          setCurrentScreen('logRound');
                        }}
                        style={{
                          width: '100%',
                          backgroundColor: COLORS.cream,
                          border: `2px solid ${COLORS.mistyBlue}`,
                          borderRadius: '12px',
                          padding: '16px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                          {course.name}
                        </div>
                        <div style={{ color: COLORS.charcoal, fontSize: '14px' }}>
                          18 holes • Click to select
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div style={{ borderTop: `2px solid ${COLORS.mistyBlue}33`, paddingTop: '16px' }}>
                    <button
                      onClick={() => {
                        setCustomPars({});
                        setCustomYardages({});
                        setInputCourseName('');
                        setCurrentHole(1);
                        setShowCourseSelectionModal(false);
                        setCurrentScreen('logRound');
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: COLORS.blush,
                        color: COLORS.charcoal,
                        padding: '16px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Enter Manually (Use Default Course)
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>⛳</div>
                  <p style={{ color: COLORS.charcoal, marginBottom: '24px' }}>
                    No saved courses yet. You can create one in Course Management or enter manually.
                  </p>
                  <button
                    onClick={() => {
                      setCustomPars({});
                      setCustomYardages({});
                      setInputCourseName('');
                      setCurrentHole(1);
                      setShowCourseSelectionModal(false);
                      setCurrentScreen('logRound');
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: COLORS.blush,
                      color: COLORS.charcoal,
                      padding: '16px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Enter Manually
                  </button>
                </div>
              )}
              
              <button
                onClick={() => setShowCourseSelectionModal(false)}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: COLORS.mistyBlue,
                  color: COLORS.charcoal,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
    
 {/* Manage Courses Modal */}
        {showManageCoursesModal && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px'
            }}
            onClick={() => setShowManageCoursesModal(false)}
          >
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px', 
                padding: '32px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '24px', textAlign: 'center' }}>
                Course Management
              </h3>
              
              <button
                onClick={() => {
                  setNewCourseName('');
                  setNewCoursePars({});
                  setNewCourseYardages({});
                  setEditingCourse(null);
                  setShowManageCoursesModal(false);
                  setCurrentScreen('createCourse');
                }}
                style={{
                  width: '100%',
                  background: `linear-gradient(90deg, ${COLORS.blush} 0%, ${COLORS.blush}CC 100%)`,
                  color: COLORS.charcoal,
                  padding: '20px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '24px' }}>➕</span>
                Create New Course
              </button>
              
              {savedCourses.length > 0 && (
                <button
                  onClick={() => {
                    setShowManageCoursesModal(false);
                    setCurrentScreen('manageCourses');
                  }}
                  style={{
                    width: '100%',
                    background: `linear-gradient(90deg, ${COLORS.mistyBlue}4D 0%, #FFFFFF 100%)`,
                    color: COLORS.charcoal,
                    padding: '20px',
                    borderRadius: '12px',
                    border: `2px solid ${COLORS.mistyBlue}`,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>✏️</span>
                  Edit Existing Course
                </button>
              )}
              
              <button
                onClick={() => setShowManageCoursesModal(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: COLORS.mistyBlue,
                  color: COLORS.charcoal,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => setShowCourseSelectionModal(true)}
              style={{
                width: '100%',
                background: `linear-gradient(90deg, ${COLORS.mistyBlue} 0%, ${COLORS.mistyBlue}CC 100%)`,
                color: COLORS.charcoal,
                padding: '20px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Flag style={{ width: '28px', height: '28px', color: COLORS.darkTeal }} />
                <span>Log Round</span>
              </div>
              <ChevronRight style={{ width: '24px', height: '24px', color: COLORS.darkTeal }} />
            </button>
            <button
              onClick={() => setShowManageCoursesModal(true)}
              style={{
                width: '100%',
                background: `linear-gradient(90deg, ${COLORS.blush}4D 0%, #FFFFFF 100%)`,
                color: COLORS.charcoal,
                padding: '20px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Flag style={{ width: '28px', height: '28px', color: COLORS.blush }} />
                <span>Manage Courses</span>
              </div>
              <ChevronRight style={{ width: '24px', height: '24px', color: COLORS.darkTeal }} />
            </button>
            <button
              onClick={() => setCurrentScreen('stats')}
              style={{
                width: '100%',
                background: `linear-gradient(90deg, ${COLORS.mistyBlue}4D 0%, #FFFFFF 100%)`,
                color: COLORS.charcoal,
                padding: '20px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BarChart3 style={{ width: '28px', height: '28px', color: COLORS.darkTeal }} />
                <span>View Stats</span>
              </div>
              <ChevronRight style={{ width: '24px', height: '24px', color: COLORS.darkTeal }} />
            </button>
            <button
              onClick={() => setCurrentScreen('shop')}
              style={{
                width: '100%',
                background: `linear-gradient(90deg, ${COLORS.blush}4D 0%, #FFFFFF 100%)`,
                color: COLORS.charcoal,
                padding: '20px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Heart style={{ width: '28px', height: '28px', color: COLORS.blush }} />
                <span>Shop the Collection</span>
              </div>
              <ChevronRight style={{ width: '24px', height: '24px', color: COLORS.darkTeal }} />
            </button>
            <button
              onClick={() => setCurrentScreen('journal')}
              style={{
                width: '100%',
                background: `linear-gradient(90deg, ${COLORS.mistyBlue}4D 0%, #FFFFFF 100%)`,
                color: COLORS.charcoal,
                padding: '20px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen style={{ width: '28px', height: '28px', color: COLORS.darkTeal }} />
                <span>Tips & Journal</span>
              </div>
              <ChevronRight style={{ width: '24px', height: '24px', color: COLORS.darkTeal }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'logRound') {
    const randomQuote = ENCOURAGING_QUOTES[currentHole % ENCOURAGING_QUOTES.length];
    const isHoleRecorded = recordedHoles.has(currentHole);
    const recordedData = currentRound.find(h => h.hole === currentHole);
    
    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '160px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <button 
            onClick={() => setCurrentScreen('home')}
            style={{ background: 'none', border: 'none', color: COLORS.darkTeal, fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}
          >
            ← Back to Home
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <h2 style={{ color: COLORS.darkTeal, fontSize: '32px', fontWeight: 'bold', margin: 0 }}>Hole {currentHole}</h2>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <button
                  onClick={() => setShowParModal(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: COLORS.blush,
                    color: COLORS.charcoal,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  Par {getCurrentPar()}
                </button>
                <button
                  onClick={() => {
                    setTempYardage(getCurrentYardage().toString());
                    setShowYardageModal(true);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: COLORS.mistyBlue,
                    color: COLORS.charcoal,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  {getCurrentYardage()} yds
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {totalShots > 0 && (
                <div style={{ backgroundColor: `${COLORS.blush}33`, padding: '12px 20px', borderRadius: '999px', marginBottom: '8px' }}>
                  <span style={{ color: COLORS.darkTeal, fontSize: '32px', fontWeight: 'bold' }}>{totalWithPenalties}</span>
                </div>
              )}
              <button
                onClick={completeRound}
                style={{
                  backgroundColor: `${COLORS.mistyBlue}4D`,
                  color: COLORS.darkTeal,
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                End Round Early
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: `linear-gradient(90deg, ${COLORS.blush}33 0%, ${COLORS.mistyBlue}33 100%)`, margin: '24px', padding: '20px', borderRadius: '16px' }}>
          <p style={{ color: COLORS.darkTeal, fontSize: '20px', textAlign: 'center', fontStyle: 'italic', fontWeight: '500', margin: 0 }}>
            {randomQuote}
          </p>
        </div>

        {isHoleRecorded && recordedData && !editingHole && (
          <div style={{ margin: '0 24px 24px 24px', backgroundColor: COLORS.mistyBlue, padding: '20px', borderRadius: '16px', border: `3px solid ${COLORS.darkTeal}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <h3 style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Hole Recap</h3>
              <button
                onClick={enableEditHole}
                style={{
                  backgroundColor: COLORS.blush,
                  color: COLORS.charcoal,
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Edit Hole
              </button>
            </div>
            <div style={{ color: COLORS.charcoal, fontSize: '16px', lineHeight: '1.6' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div><strong>Par:</strong> {recordedData.par}</div>
                <div><strong>Score:</strong> <span style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: 'bold' }}>{recordedData.total}</span></div>
                <div><strong>Drive:</strong> {recordedData.drive === 'middle' ? '✨ Fairway' : recordedData.drive.charAt(0).toUpperCase() + recordedData.drive.slice(1)}</div>
                <div><strong>Putts:</strong> {recordedData.putts}</div>
              </div>
              {recordedData.notes && (
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: COLORS.cream, borderRadius: '8px', fontStyle: 'italic' }}>
                  "{recordedData.notes}"
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
              Drive
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { key: 'left', label: 'Left', color: '#C4DEDE', textColor: COLORS.charcoal },
                { key: 'middle', label: 'Fairway', color: '#F9C8D4', textColor: COLORS.charcoal },
                { key: 'right', label: 'Right', color: '#2A6B72', textColor: COLORS.cream }
              ].map(pos => (
                <button
                  key={pos.key}
                  onClick={() => setDrive(pos.key)}
                  style={{
                    flex: 1,
                    padding: '20px',
                    borderRadius: '12px',
                    border: pos.key === 'middle' ? '3px solid #F9C8D4' : `3px solid ${pos.key === 'left' ? '#C4DEDE' : '#2A6B72'}`,
                    background: drive === pos.key ? COLORS.cream : pos.color,
                    color: drive === pos.key ? COLORS.charcoal : pos.textColor,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s'
                  }}
                >
                  {pos.key === 'middle' ? (
                    <>
                      <span style={{ color: drive === 'middle' ? COLORS.blush : COLORS.darkTeal }}>♥</span>
                      {' Fairway '}
                      <span style={{ color: drive === 'middle' ? COLORS.blush : COLORS.darkTeal }}>♥</span>
                    </>
                  ) : pos.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
              Approach Shots
            </label>
            <QuickCounter value={approaches} onChange={setApproaches} max={5} type="approach" />
          </div>

          <div>
            <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
              Chip/Pitch Shots
            </label>
            <QuickCounter value={chips} onChange={setChips} max={5} type="chip" />
          </div>

          <div>
            <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
              Putts
            </label>
            <QuickCounter value={putts} onChange={setPutts} max={5} type="putt" />
          </div>

          <div>
            <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
              Penalties (optional)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ color: COLORS.charcoal, fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>💧 Water</div>
                <QuickCounter value={penalties.water} onChange={(v) => setPenalties({...penalties, water: v})} max={3} type="approach" />
              </div>
              <div>
                <div style={{ color: COLORS.charcoal, fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>🔍 Lost Ball</div>
                <QuickCounter value={penalties.lost} onChange={(v) => setPenalties({...penalties, lost: v})} max={3} type="chip" />
              </div>
              <div>
                <div style={{ color: COLORS.charcoal, fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>⚠️ Out of Bounds</div>
                <QuickCounter value={penalties.ob} onChange={(v) => setPenalties({...penalties, ob: v})} max={3} type="putt" />
              </div>
            </div>
          </div>

          <div>
            <label style={{ color: COLORS.charcoal, fontSize: '22px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
              Notes (optional)
            </label>
            <textarea
              value={holeNotes}
              onChange={(e) => setHoleNotes(e.target.value)}
              placeholder="Beautiful weather today! 🌸"
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                border: `3px solid ${COLORS.mistyBlue}`,
                color: COLORS.charcoal,
                fontSize: '16px',
                padding: '16px',
                borderRadius: '12px',
                minHeight: '100px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {totalShots > 0 && !isHoleRecorded && (
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: `3px solid ${COLORS.mistyBlue}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: COLORS.charcoal, fontSize: '20px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>
                Hole Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: COLORS.charcoal, fontSize: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Par</span>
                  <span style={{ fontWeight: 'bold' }}>{getCurrentPar()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Your Score</span>
                  <span style={{ color: COLORS.blush, fontSize: '24px', fontWeight: 'bold' }}>{totalWithPenalties}</span>
                </div>
                {(penalties.water + penalties.lost + penalties.ob > 0) && (
                  <div style={{ color: COLORS.mistyBlue, fontSize: '16px', paddingTop: '12px', borderTop: `2px solid ${COLORS.mistyBlue}` }}>
                    Includes {penalties.water + penalties.lost + penalties.ob} penalty stroke(s)
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={completeHole}
            disabled={(totalShots === 0 && !editingHole) || (isHoleRecorded && !editingHole)}
            style={{
              width: '100%',
              backgroundColor: (isHoleRecorded && !editingHole) ? '#999999' : (totalShots > 0 || editingHole ? COLORS.blush : '#E0E0E0'),
              color: COLORS.charcoal,
              padding: '24px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '22px',
              fontWeight: 'bold',
              cursor: ((totalShots > 0 || editingHole) && (!isHoleRecorded || editingHole)) ? 'pointer' : 'not-allowed',
              opacity: ((totalShots === 0 && !editingHole) || (isHoleRecorded && !editingHole)) ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.3s'
            }}
          >
            <CheckCircle2 style={{ width: '28px', height: '28px' }} />
            {(isHoleRecorded && !editingHole) ? 'Hole Recorded' : editingHole ? 'Update Hole' : 'Record Hole & Continue'}
          </button>
        </div>

        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: '#FFFFFF', 
          padding: '16px 24px',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <button
            onClick={() => { if (currentHole > 1) setCurrentHole(currentHole - 1); }}
            disabled={currentHole === 1}
            style={{
              flex: 1,
              maxWidth: '200px',
              backgroundColor: currentHole === 1 ? '#E0E0E0' : COLORS.mistyBlue,
              color: COLORS.charcoal,
              padding: '16px 24px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: currentHole === 1 ? 'not-allowed' : 'pointer',
              opacity: currentHole === 1 ? 0.5 : 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            ← Previous
          </button>
          <button
            onClick={() => { if (currentHole < 18) setCurrentHole(currentHole + 1); }}
            disabled={currentHole === 18}
            style={{
              flex: 1,
              maxWidth: '200px',
              backgroundColor: currentHole === 18 ? '#E0E0E0' : COLORS.blush,
              color: COLORS.charcoal,
              padding: '16px 24px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: currentHole === 18 ? 'not-allowed' : 'pointer',
              opacity: currentHole === 18 ? 0.5 : 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            Next →
          </button>
        </div>

        {showParModal && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px'
            }}
            onClick={() => setShowParModal(false)}
          >
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px', 
                padding: '32px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '24px', textAlign: 'center' }}>
                Select Par for Hole {currentHole}
              </h3>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                {[3, 4, 5].map(par => (
                  <button
                    key={par}
                    onClick={() => {
                      setCustomPars({...customPars, [currentHole]: par});
                      setShowParModal(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '32px 20px',
                      fontSize: '48px',
                      fontWeight: 'bold',
                      backgroundColor: getCurrentPar() === par ? COLORS.blush : COLORS.cream,
                      color: COLORS.charcoal,
                      border: `4px solid ${getCurrentPar() === par ? COLORS.blush : COLORS.mistyBlue}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {par}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowParModal(false)}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  backgroundColor: COLORS.mistyBlue,
                  color: COLORS.charcoal,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showYardageModal && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px'
            }}
            onClick={() => {
              setShowYardageModal(false);
              setTempYardage('');
            }}
          >
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px', 
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px 24px 0 24px' }}>
                <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px', textAlign: 'center' }}>
                  Yardage for Hole {currentHole}
                </h3>
              </div>
              <NumberPad
                value={tempYardage}
                onNumberClick={(num) => {
                  if (tempYardage.length < 3) {
                    setTempYardage(tempYardage + num);
                  }
                }}
                onBackspace={() => {
                  setTempYardage(tempYardage.slice(0, -1));
                }}
                onClear={() => {
                  setTempYardage('');
                }}
                onDone={() => {
                  const yards = parseInt(tempYardage);
                  if (yards >= 50 && yards <= 700) {
                    setCustomYardages({...customYardages, [currentHole]: yards});
                    setShowYardageModal(false);
                    setTempYardage('');
                  } else {
                    alert('Please enter a yardage between 50 and 700');
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentScreen === 'roundComplete') {
    const totalScore = currentRound.reduce((sum, hole) => sum + hole.total, 0);
    const totalPar = currentRound.reduce((sum, hole) => sum + hole.par, 0);
    const holesPlayed = currentRound.length;
    const scoreToPar = totalScore - totalPar;
    const fairwaysHit = currentRound.filter(h => h.fairwayHit && h.par > 3).length;
    const possibleFairways = currentRound.filter(h => h.par > 3).length;
    const totalPutts = currentRound.reduce((sum, h) => sum + h.putts, 0);
    const avgPutts = holesPlayed > 0 ? (totalPutts / holesPlayed).toFixed(1) : 0;
    
    const hasCustomCourseData = Object.keys(customPars).length > 0 || Object.keys(customYardages).length > 0;

    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${COLORS.blush}33 0%, ${COLORS.cream} 50%, ${COLORS.mistyBlue}33 100%)`, padding: '32px 24px 80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ color: COLORS.darkTeal, fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Round Complete!</h1>
          <p style={{ color: COLORS.mistyBlue, fontSize: '20px', margin: 0 }}>You played {holesPlayed} hole{holesPlayed > 1 ? 's' : ''} beautifully</p>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '56px', fontWeight: 'bold', color: COLORS.blush, marginBottom: '8px' }}>{totalScore}</div>
            <div style={{ color: COLORS.darkTeal, fontSize: '20px' }}>
              {scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar === 0 ? 'Even' : scoreToPar}
              <span style={{ color: COLORS.mistyBlue, marginLeft: '8px' }}>(Par {totalPar})</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: `2px solid ${COLORS.mistyBlue}33` }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.darkTeal, marginBottom: '4px' }}>
                {possibleFairways > 0 ? Math.round((fairwaysHit / possibleFairways) * 100) : 0}%
              </div>
              <div style={{ fontSize: '14px', color: COLORS.mistyBlue }}>Fairways Hit</div>
              <div style={{ fontSize: '12px', color: COLORS.darkTeal, marginTop: '4px' }}>{fairwaysHit}/{possibleFairways}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.darkTeal, marginBottom: '4px' }}>{avgPutts}</div>
              <div style={{ fontSize: '14px', color: COLORS.mistyBlue }}>Avg Putts</div>
              <div style={{ fontSize: '12px', color: COLORS.darkTeal, marginTop: '4px' }}>{totalPutts} total</div>
            </div>
          </div>
        </div>

        <div style={{ background: `linear-gradient(90deg, ${COLORS.blush}4D 0%, ${COLORS.mistyBlue}4D 100%)`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <p style={{ color: COLORS.darkTeal, fontSize: '20px', textAlign: 'center', fontStyle: 'italic', margin: 0 }}>
            "Every round is progress. Celebrate how far you've come! 🌸"
          </p>
        </div>

        {hasCustomCourseData && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '12px' }}>
              💾 Save This Course
            </h3>
            <p style={{ color: COLORS.charcoal, fontSize: '16px', marginBottom: '16px' }}>
              You customized par and yardage for this round. Would you like to save this course for future rounds?
            </p>
            <button
              onClick={() => setShowSaveCourseModal(true)}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: COLORS.darkTeal,
                color: COLORS.cream,
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              Save Course to Favorites
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => {
              setCurrentRound([]);
              setCurrentHole(1);
              setRecordedHoles(new Set());
              setDrive('');
              setApproaches(0);
              setChips(0);
              setPutts(0);
              setPenalties({ water: 0, lost: 0, ob: 0 });
              setHoleNotes('');
              setCurrentScreen('home');
            }}
            style={{
              width: '100%',
              background: `linear-gradient(90deg, ${COLORS.blush} 0%, ${COLORS.blush}CC 100%)`,
              color: COLORS.charcoal,
              padding: '20px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Back to Home
          </button>
          <button
            onClick={() => {
              setCurrentRound([]);
              setCurrentHole(1);
              setRecordedHoles(new Set());
              setDrive('');
              setApproaches(0);
              setChips(0);
              setPutts(0);
              setPenalties({ water: 0, lost: 0, ob: 0 });
              setHoleNotes('');
              setCurrentScreen('logRound');
            }}
            style={{
              width: '100%',
              backgroundColor: `${COLORS.mistyBlue}4D`,
              color: COLORS.darkTeal,
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Start New Round
          </button>
        </div>

        {showSaveCourseModal && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px'
            }}
            onClick={() => {
              setShowSaveCourseModal(false);
              setInputCourseName('');
            }}
          >
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px', 
                padding: '32px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px', textAlign: 'center' }}>
                💾 Save Course
              </h3>
              <p style={{ color: COLORS.charcoal, fontSize: '16px', marginBottom: '24px', textAlign: 'center' }}>
                Give this course a name to save it for future rounds
              </p>
              
              <input
                type="text"
                value={inputCourseName}
                onChange={(e) => setInputCourseName(e.target.value)}
                placeholder="e.g., Pine Valley Golf Club"
                maxLength={50}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '18px',
                  border: `3px solid ${COLORS.mistyBlue}`,
                  borderRadius: '12px',
                  marginBottom: '24px',
                  fontFamily: 'inherit',
                  color: COLORS.charcoal
                }}
              />
              
              <div style={{ backgroundColor: COLORS.cream, padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <p style={{ color: COLORS.charcoal, fontSize: '14px', margin: 0 }}>
                  <strong>What will be saved:</strong><br/>
                  â€¢ Par for each hole<br/>
                  â€¢ Yardage for each hole<br/>
                  â€¢ Course name
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowSaveCourseModal(false);
                    setInputCourseName('');
                  }}
                  style={{
                    flex: 1,
                    padding: '16px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: COLORS.mistyBlue,
                    color: COLORS.charcoal,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveCourse(inputCourseName)}
                  disabled={!inputCourseName.trim()}
                  style={{
                    flex: 1,
                    padding: '16px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: inputCourseName.trim() ? COLORS.blush : '#E0E0E0',
                    color: COLORS.charcoal,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: inputCourseName.trim() ? 'pointer' : 'not-allowed',
                    opacity: inputCourseName.trim() ? 1 : 0.5
                  }}
                >
                  Save Course
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentScreen === 'stats') {
    const currentYear = new Date().getFullYear();
    const ytdRounds = rounds.filter(r => new Date(r.date).getFullYear() === currentYear);
    const allHoles = rounds.flatMap(r => r.holes);
    const ytdHoles = ytdRounds.flatMap(r => r.holes);
    
    const allTimeStats = calcStats(allHoles);
    const ytdStats = calcStats(ytdHoles);

    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '80px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', color: COLORS.darkTeal, fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px' }}>← Back</button>
          <h2 style={{ color: COLORS.darkTeal, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Your Stats</h2>
          <p style={{ color: COLORS.charcoal, fontSize: '18px', margin: '4px 0 0 0' }}>Track your progress over time</p>
        </div>
        
        <div style={{ padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: `linear-gradient(135deg, ${COLORS.blush}33 0%, #FFFFFF 100%)`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.darkTeal }}>{rounds.length}</div>
              <div style={{ color: COLORS.charcoal, fontSize: '16px', fontWeight: '600' }}>Total Rounds</div>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${COLORS.mistyBlue}33 0%, #FFFFFF 100%)`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.darkTeal }}>{ytdRounds.length}</div>
              <div style={{ color: COLORS.charcoal, fontSize: '16px', fontWeight: '600' }}>Rounds in {currentYear}</div>
            </div>
          </div>
          
          {rounds.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏌️‍♀️</div>
              <p style={{ color: COLORS.charcoal }}>No rounds logged yet. Start your first round to see your stats!</p>
            </div>
          ) : (
            <>
              {ytdStats && (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '16px' }}>
                    📊 {currentYear} Year-to-Date
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '12px', backgroundColor: `${COLORS.blush}1A`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.darkTeal }}>{ytdStats.avgScore}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.charcoal }}>Avg Score/Hole</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: `${COLORS.mistyBlue}33`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.darkTeal }}>{ytdStats.avgPutts}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.charcoal }}>Avg Putts/Hole</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: `${COLORS.blush}1A`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.darkTeal }}>{ytdStats.fairwayPct}%</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.charcoal }}>Fairways Hit</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: `${COLORS.mistyBlue}33`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.darkTeal }}>
                        {ytdStats.scoreToPar > 0 ? `+${ytdStats.scoreToPar}` : ytdStats.scoreToPar}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.charcoal }}>Score to Par</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `2px solid ${COLORS.mistyBlue}33` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '14px', color: COLORS.charcoal }}>
                      <div><strong>Par 3:</strong> {ytdStats.avgPar3}</div>
                      <div><strong>Par 4:</strong> {ytdStats.avgPar4}</div>
                      <div><strong>Par 5:</strong> {ytdStats.avgPar5}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {allTimeStats && (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '16px' }}>
                    🌟 All-Time Statistics
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '12px', backgroundColor: `${COLORS.blush}1A`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.darkTeal }}>{allTimeStats.avgScore}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.charcoal }}>Avg Score/Hole</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: `${COLORS.mistyBlue}33`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.darkTeal }}>{allTimeStats.avgPutts}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.charcoal }}>Avg Putts/Hole</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: `${COLORS.blush}1A`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.darkTeal }}>{allTimeStats.fairwayPct}%</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.charcoal }}>Fairways Hit</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: `${COLORS.mistyBlue}33`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.darkTeal }}>{allHoles.length}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.charcoal }}>Total Holes</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `2px solid ${COLORS.mistyBlue}33` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '14px', color: COLORS.charcoal }}>
                      <div><strong>Par 3:</strong> {allTimeStats.avgPar3}</div>
                      <div><strong>Par 4:</strong> {allTimeStats.avgPar4}</div>
                      <div><strong>Par 5:</strong> {allTimeStats.avgPar5}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setShowExportModal(true)}
                style={{
                  width: '100%',
                  backgroundColor: COLORS.darkTeal,
                  color: COLORS.cream,
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '24px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                📥 Export Data to CSV
              </button>
              
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '16px' }}>
                  📅 Round History
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[...rounds].reverse().map((round, idx) => {
                    const roundScore = round.holes.reduce((sum, h) => sum + h.total, 0);
                    const roundPar = round.holes.reduce((sum, h) => sum + h.par, 0);
                    const scoreToPar = roundScore - roundPar;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedRound(round)}
                        style={{
                          width: '100%',
                          backgroundColor: COLORS.cream,
                          border: `2px solid ${COLORS.mistyBlue}`,
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                              {new Date(round.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div style={{ color: COLORS.charcoal, fontSize: '16px', fontWeight: '600' }}>
                              {round.courseName || 'Unnamed Course'} â€¢ {round.holes.length} holes
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.blush }}>{roundScore}</div>
                            <div style={{ fontSize: '14px', color: COLORS.mistyBlue }}>
                              {scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar === 0 ? 'E' : scoreToPar}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
        
        {selectedRound && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px',
              overflowY: 'auto'
            }}
            onClick={() => setSelectedRound(null)}
          >
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px', 
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF', padding: '24px', borderBottom: `2px solid ${COLORS.mistyBlue}33`, borderRadius: '24px 24px 0 0' }}>
                <button
                  onClick={() => setSelectedRound(null)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: COLORS.charcoal
                  }}
                >
                  âœ•
                </button>
                <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                  {new Date(selectedRound.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <p style={{ color: COLORS.mistyBlue, fontSize: '16px', margin: 0 }}>
                  {selectedRound.courseName || 'Unnamed Course'}
                </p>
              </div>
              
              <div style={{ padding: '24px' }}>
                <div style={{ backgroundColor: `${COLORS.blush}1A`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.darkTeal }}>
                        {selectedRound.holes.reduce((sum, h) => sum + h.total, 0)}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.charcoal }}>Total Score</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.darkTeal }}>
                        {selectedRound.holes.reduce((sum, h) => sum + h.total, 0) - selectedRound.holes.reduce((sum, h) => sum + h.par, 0) > 0 
                          ? `+${selectedRound.holes.reduce((sum, h) => sum + h.total, 0) - selectedRound.holes.reduce((sum, h) => sum + h.par, 0)}`
                          : selectedRound.holes.reduce((sum, h) => sum + h.total, 0) - selectedRound.holes.reduce((sum, h) => sum + h.par, 0)}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.charcoal }}>To Par</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.darkTeal }}>
                        {selectedRound.holes.reduce((sum, h) => sum + h.putts, 0)}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.charcoal }}>Total Putts</div>
                    </div>
                  </div>
                </div>
                
                <h4 style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                  Hole-by-Hole Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedRound.holes.map(hole => (
                    <div 
                      key={hole.hole}
                      style={{ 
                        backgroundColor: COLORS.cream, 
                        borderRadius: '12px', 
                        padding: '16px',
                        border: `2px solid ${COLORS.mistyBlue}33`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <span style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold' }}>
                            Hole {hole.hole}
                          </span>
                          <span style={{ color: COLORS.mistyBlue, fontSize: '14px', marginLeft: '8px' }}>
                            Par {hole.par} â€¢ {hole.yardage} yds
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.blush }}>{hole.total}</div>
                          <div style={{ fontSize: '12px', color: COLORS.mistyBlue }}>
                            {hole.total - hole.par > 0 ? `+${hole.total - hole.par}` : hole.total - hole.par === 0 ? 'E' : hole.total - hole.par}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: COLORS.charcoal }}>
                        <div><strong>Drive:</strong> {hole.drive === 'middle' ? 'âœ¨ Fairway' : hole.drive.charAt(0).toUpperCase() + hole.drive.slice(1)}</div>
                        <div><strong>Putts:</strong> {hole.putts}</div>
                        <div><strong>Approaches:</strong> {hole.approaches}</div>
                        <div><strong>Chips:</strong> {hole.chips}</div>
                        {(hole.penalties.water + hole.penalties.lost + hole.penalties.ob > 0) && (
                          <div style={{ gridColumn: '1 / -1', color: COLORS.mistyBlue }}>
                            <strong>Penalties:</strong> {hole.penalties.water + hole.penalties.lost + hole.penalties.ob}
                          </div>
                        )}
                      </div>
                      
                      {hole.notes && (
                        <div style={{ 
                          marginTop: '12px', 
                          padding: '12px', 
                          backgroundColor: '#FFFFFF', 
                          borderRadius: '8px',
                          fontStyle: 'italic',
                          fontSize: '14px',
                          color: COLORS.charcoal
                        }}>
                          "{hole.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {showExportModal && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px'
            }}
            onClick={() => {
              setShowExportModal(false);
              setExportStartDate('');
              setExportEndDate('');
            }}
          >
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px', 
                padding: '32px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>
                ðŸ“¥ Export Data
              </h3>
              <p style={{ color: COLORS.charcoal, fontSize: '16px', marginBottom: '24px' }}>
                Export your round data to CSV. Leave dates empty to export all rounds.
              </p>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px' }}>
                  Start Date (optional)
                </label>
                <input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: `2px solid ${COLORS.mistyBlue}`,
                    borderRadius: '8px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px' }}>
                  End Date (optional)
                </label>
                <input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: `2px solid ${COLORS.mistyBlue}`,
                    borderRadius: '8px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              
              <div style={{ backgroundColor: COLORS.cream, padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <p style={{ color: COLORS.charcoal, fontSize: '14px', margin: 0 }}>
                  <strong>Export will include:</strong><br/>
                  â€¢ Date and course name<br/>
                  â€¢ Hole-by-hole details<br/>
                  â€¢ Scores, putts, drives, and more<br/>
                  â€¢ All notes and penalties
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowExportModal(false);
                    setExportStartDate('');
                    setExportEndDate('');
                  }}
                  style={{
                    flex: 1,
                    padding: '16px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: COLORS.mistyBlue,
                    color: COLORS.charcoal,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={exportData}
                  style={{
                    flex: 1,
                    padding: '16px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: COLORS.darkTeal,
                    color: COLORS.cream,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

 if (currentScreen === 'manageCourses') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '80px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', color: COLORS.darkTeal, fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px' }}>← Back</button>
          <h2 style={{ color: COLORS.darkTeal, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Manage Courses</h2>
          <p style={{ color: COLORS.charcoal, fontSize: '18px', margin: '4px 0 0 0' }}>Edit or delete your saved courses</p>
        </div>
        
        <div style={{ padding: '0 24px' }}>
          {savedCourses.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⛳</div>
              <p style={{ color: COLORS.charcoal, fontSize: '16px' }}>No saved courses yet. Create your first course to get started!</p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '16px' }}>
                Your Saved Courses ({savedCourses.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {savedCourses.map(course => (
                  <div
                    key={course.id}
                    style={{
                      backgroundColor: COLORS.cream,
                      border: `2px solid ${COLORS.mistyBlue}`,
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {course.name}
                      </div>
                      <div style={{ color: COLORS.charcoal, fontSize: '14px' }}>
                        18 holes • Custom pars & yardages
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setNewCourseName(course.name);
                          setNewCoursePars(course.pars);
                          setNewCourseYardages(course.yardages);
                          setEditingCourse(course);
                          setCurrentScreen('createCourse');
                        }}
                        style={{
                          backgroundColor: COLORS.mistyBlue,
                          color: COLORS.charcoal,
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${course.name}"?`)) {
                            setSavedCourses(savedCourses.filter(c => c.id !== course.id));
                          }
                        }}
                        style={{
                          backgroundColor: '#FF6B6B',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

if (currentScreen === 'createCourse') {
    // Calculate yardage totals
    const front9Yardage = [1,2,3,4,5,6,7,8,9].reduce((sum, hole) => {
      return sum + (newCourseYardages[hole] || HOLE_YARDAGES[hole - 1]);
    }, 0);
    
    const back9Yardage = [10,11,12,13,14,15,16,17,18].reduce((sum, hole) => {
      return sum + (newCourseYardages[hole] || HOLE_YARDAGES[hole - 1]);
    }, 0);
    
    const totalYardage = front9Yardage + back9Yardage;
    const isEditing = editingCourse !== null;
    
    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '120px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
          <button 
            onClick={() => {
              setCurrentScreen(isEditing ? 'manageCourses' : 'home');
              setEditingCourse(null);
            }}
            style={{ background: 'none', border: 'none', color: COLORS.darkTeal, fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}
          >
            ← Back
          </button>
          
          <h2 style={{ color: COLORS.darkTeal, fontSize: '28px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h2>
          
          <div style={{ marginBottom: '0' }}>
            <label style={{ display: 'block', color: COLORS.darkTeal, fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
              Course Name
            </label>
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="e.g., Pine Valley Golf Club"
              maxLength={50}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: `3px solid ${COLORS.mistyBlue}`,
                borderRadius: '12px',
                fontFamily: 'inherit',
                color: COLORS.charcoal
              }}
            />
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ background: `linear-gradient(90deg, ${COLORS.blush}33 0%, ${COLORS.mistyBlue}33 100%)`, padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
            <p style={{ color: COLORS.darkTeal, fontSize: '16px', textAlign: 'center', fontWeight: '500', margin: 0 }}>
              Set the par and yardage for each hole below 💚
            </p>
          </div>

          {/* Front 9 */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>
              Front 9
            </h3>
            
            {[1,2,3,4,5,6,7,8,9].map(hole => {
              const currentPar = newCoursePars[hole] || HOLE_PARS[hole - 1];
              const currentYardage = newCourseYardages[hole] || HOLE_YARDAGES[hole - 1];
              
              return (
                <div 
                  key={hole}
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 1fr',
                    gap: '12px',
                    alignItems: 'center',
                    marginBottom: '12px',
                    padding: '12px',
                    backgroundColor: COLORS.cream,
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ 
                    color: COLORS.darkTeal, 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    #{hole}
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '12px', color: COLORS.mistyBlue, marginBottom: '4px', fontWeight: '600' }}>Par</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[3, 4, 5].map(par => (
                        <button
                          key={par}
                          onClick={() => setNewCoursePars({...newCoursePars, [hole]: par})}
                          style={{
                            flex: 1,
                            padding: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            backgroundColor: currentPar === par ? COLORS.blush : '#FFFFFF',
                            color: COLORS.charcoal,
                            border: `2px solid ${currentPar === par ? COLORS.blush : COLORS.mistyBlue}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {par}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '12px', color: COLORS.mistyBlue, marginBottom: '4px', fontWeight: '600' }}>Yardage</div>
                    <button
                      onClick={() => {
                        setShowYardageModalForHole(hole);
                        setTempYardage(currentYardage.toString());
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: `2px solid ${COLORS.mistyBlue}`,
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        color: COLORS.charcoal,
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {currentYardage} yds
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: `${COLORS.mistyBlue}33`,
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: COLORS.darkTeal, fontSize: '16px', fontWeight: 'bold' }}>Front 9 Total:</span>
              <span style={{ color: COLORS.blush, fontSize: '20px', fontWeight: 'bold' }}>{front9Yardage} yds</span>
            </div>
          </div>

          {/* Back 9 */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: COLORS.darkTeal, fontSize: '20px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>
              Back 9
            </h3>
            
            {[10,11,12,13,14,15,16,17,18].map(hole => {
              const currentPar = newCoursePars[hole] || HOLE_PARS[hole - 1];
              const currentYardage = newCourseYardages[hole] || HOLE_YARDAGES[hole - 1];
              
              return (
                <div 
                  key={hole}
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 1fr',
                    gap: '12px',
                    alignItems: 'center',
                    marginBottom: '12px',
                    padding: '12px',
                    backgroundColor: COLORS.cream,
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ 
                    color: COLORS.darkTeal, 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    #{hole}
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '12px', color: COLORS.mistyBlue, marginBottom: '4px', fontWeight: '600' }}>Par</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[3, 4, 5].map(par => (
                        <button
                          key={par}
                          onClick={() => setNewCoursePars({...newCoursePars, [hole]: par})}
                          style={{
                            flex: 1,
                            padding: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            backgroundColor: currentPar === par ? COLORS.blush : '#FFFFFF',
                            color: COLORS.charcoal,
                            border: `2px solid ${currentPar === par ? COLORS.blush : COLORS.mistyBlue}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {par}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '12px', color: COLORS.mistyBlue, marginBottom: '4px', fontWeight: '600' }}>Yardage</div>
                    <button
                      onClick={() => {
                        setShowYardageModalForHole(hole);
                        setTempYardage(currentYardage.toString());
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: `2px solid ${COLORS.mistyBlue}`,
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        color: COLORS.charcoal,
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {currentYardage} yds
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: `${COLORS.mistyBlue}33`,
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: COLORS.darkTeal, fontSize: '16px', fontWeight: 'bold' }}>Back 9 Total:</span>
              <span style={{ color: COLORS.blush, fontSize: '20px', fontWeight: 'bold' }}>{back9Yardage} yds</span>
            </div>
          </div>

          {/* Total Yardage */}
          <div style={{ 
            backgroundColor: COLORS.darkTeal, 
            borderRadius: '16px', 
            padding: '20px', 
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: COLORS.cream, fontSize: '20px', fontWeight: 'bold' }}>Total Course Yardage:</span>
              <span style={{ color: COLORS.blush, fontSize: '28px', fontWeight: 'bold' }}>{totalYardage} yds</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!newCourseName.trim()) {
                alert('Please enter a course name before saving');
                return;
              }
              if (isEditing) {
                saveCourse(newCourseName, newCoursePars, newCourseYardages, true, editingCourse.id);
              } else {
                saveCourse(newCourseName, newCoursePars, newCourseYardages);
              }
              setCurrentScreen('manageCourses');
            }}
            style={{
              width: '100%',
              backgroundColor: newCourseName.trim() ? COLORS.blush : '#E0E0E0',
              color: COLORS.charcoal,
              padding: '20px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: newCourseName.trim() ? 'pointer' : 'not-allowed',
              opacity: newCourseName.trim() ? 1 : 0.7,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <CheckCircle2 style={{ width: '24px', height: '24px' }} />
            {isEditing ? 'Update Course' : 'Save Course'}
          </button>
        </div>

        {/* NumberPad Modal for Yardage Entry */}
        {showYardageModalForHole !== null && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px'
            }}
            onClick={() => {
              setShowYardageModalForHole(null);
              setTempYardage('');
            }}
          >
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px', 
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px 24px 0 24px' }}>
                <h3 style={{ color: COLORS.darkTeal, fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px', textAlign: 'center' }}>
                  Yardage for Hole {showYardageModalForHole}
                </h3>
              </div>
              <NumberPad
                value={tempYardage}
                onNumberClick={(num) => {
                  if (tempYardage.length < 3) {
                    setTempYardage(tempYardage + num);
                  }
                }}
                onBackspace={() => {
                  setTempYardage(tempYardage.slice(0, -1));
                }}
                onClear={() => {
                  setTempYardage('');
                }}
                onDone={() => {
                  const yards = parseInt(tempYardage);
                  if (yards >= 50 && yards <= 700) {
                    setNewCourseYardages({...newCourseYardages, [showYardageModalForHole]: yards});
                    setShowYardageModalForHole(null);
                    setTempYardage('');
                  } else {
                    alert('Please enter a yardage between 50 and 700');
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }


  if (currentScreen === 'shop') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '80px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', color: COLORS.darkTeal, fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px' }}>← Back</button>
          <h2 style={{ color: COLORS.darkTeal, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Shop the Collection</h2>
          <p style={{ color: COLORS.charcoal, fontSize: '18px', margin: '4px 0 0 0' }}>Gear for confident golfers</p>
        </div>
        <div style={{ padding: '0 24px' }}>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.blush}33 0%, ${COLORS.mistyBlue}33 100%)`, borderRadius: '24px', padding: '40px 24px', textAlign: 'center', marginBottom: '24px' }}>
            <Heart style={{ width: '64px', height: '64px', color: COLORS.blush, margin: '0 auto 20px auto' }} />
            <h3 style={{ color: COLORS.darkTeal, fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Products Coming Soon!</h3>
            <p style={{ color: COLORS.charcoal, fontSize: '18px', lineHeight: '1.6', marginBottom: '0' }}>
              We're curating a beautiful collection of golf apparel and accessories designed just for you. Stay tuned!
            </p>
          </div>
          
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h4 style={{ color: COLORS.darkTeal, fontSize: '22px', fontWeight: 'bold', marginTop: 0, marginBottom: '20px' }}>What to Expect:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <div style={{ fontSize: '24px', minWidth: '32px' }}>✨</div>
                <div>
                  <p style={{ color: COLORS.darkTeal, fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '16px' }}>Curated Collections</p>
                  <p style={{ color: COLORS.charcoal, margin: 0, fontSize: '15px' }}>Thoughtfully selected apparel and accessories that combine style with performance</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <div style={{ fontSize: '24px', minWidth: '32px' }}>💗</div>
                <div>
                  <p style={{ color: COLORS.darkTeal, fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '16px' }}>Designed for You</p>
                  <p style={{ color: COLORS.charcoal, margin: 0, fontSize: '15px' }}>Pieces that make you feel confident and comfortable on the course</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <div style={{ fontSize: '24px', minWidth: '32px' }}>🌸</div>
                <div>
                  <p style={{ color: COLORS.darkTeal, fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '16px' }}>Quality First</p>
                  <p style={{ color: COLORS.charcoal, margin: 0, fontSize: '15px' }}>Premium materials and attention to detail in every piece</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <div style={{ fontSize: '24px', minWidth: '32px' }}>⛳</div>
                <div>
                  <p style={{ color: COLORS.darkTeal, fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '16px' }}>Golf Essentials</p>
                  <p style={{ color: COLORS.charcoal, margin: 0, fontSize: '15px' }}>From visors and gloves to stylish golf bags and accessories</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: `linear-gradient(90deg, ${COLORS.blush}4D 0%, ${COLORS.mistyBlue}4D 100%)`, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <p style={{ color: COLORS.darkTeal, fontStyle: 'italic', fontSize: '18px', margin: 0, lineHeight: '1.6' }}>
              "Golf is a journey of self-discovery. Look good, feel great, play better! 💙"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <div>Other screens coming...</div>;
}