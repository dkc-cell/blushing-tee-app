import BackButton from '../components/BackButton';
import React, { useState, useEffect, useRef } from 'react';
import QuickScoreScreen from './QuickScoreScreen';
import { COLORS } from '../constants';
import { SplashScreen } from '../components';
import {
  HomeScreen,
  SelectCourseScreen,
  LogRoundScreen,
  RoundCompleteScreen,
  StatsScreen,
  ManageCoursesScreen,
  CreateCourseScreen,
  ShopScreen,
  AboutScreen,
  AccountBackupScreen
} from './index';
import { useRounds, useCourses } from '../hooks';
import { calcOverallStats, getLocalDateString } from '../utils';
import {
  clearActiveRound,
  loadActiveRound,
  saveActiveRound,
} from '../utils/activeRoundStorage';
import { usePageSeo } from '../utils/seo';

export default function AppPage() {
  usePageSeo({
    title: 'Blushing Birdie App',
    description:
      'Open the Blushing Birdie private golf round tracker and scorecard app.',
    path: '/app',
    robots: 'noindex,nofollow',
  });

  const initialActiveRoundRef = useRef(loadActiveRound());
  const initialActiveRound = initialActiveRoundRef.current;

  // Splash screen
  const [showSplash, setShowSplash] = useState(true);
  
  // Navigation
  const [currentScreen, setCurrentScreen] = useState('home');
  
  // Data hooks with localStorage persistence
  const { rounds, setRounds, addRound, updateRound, deleteRound } = useRounds();
  const { courses, setCourses, addCourse, updateCourse, deleteCourse, getCourseByName } = useCourses();

  
  const [scoringMode, setScoringMode] = useState(initialActiveRound?.scoringMode || 'detailed');

  // Current round state
  const [currentHole, setCurrentHole] = useState(initialActiveRound?.currentHole || 1);
  const [currentRound, setCurrentRound] = useState(initialActiveRound?.currentRound || []);
  const [recordedHoles, setRecordedHoles] = useState(
    new Set(initialActiveRound?.recordedHoles || [])
  );
  const [customPars, setCustomPars] = useState(initialActiveRound?.customPars || {});
  const [customYardages, setCustomYardages] = useState(initialActiveRound?.customYardages || {});
  const [courseName, setCourseName] = useState(initialActiveRound?.courseName || '');
  const [roundIsActive, setRoundIsActive] = useState(Boolean(initialActiveRound));
  const [lastCompletedRoundId, setLastCompletedRoundId] = useState(null);

  // Course editing state
  const [editingCourse, setEditingCourse] = useState(null);

  // Hide the combined splash after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (!roundIsActive) return;

    saveActiveRound({
      scoringMode,
      currentHole,
      currentRound,
      recordedHoles: [...recordedHoles],
      customPars,
      customYardages,
      courseName,
      holeDraft: loadActiveRound()?.holeDraft || null,
    });
  }, [
    roundIsActive,
    scoringMode,
    currentHole,
    currentRound,
    recordedHoles,
    customPars,
    customYardages,
    courseName,
  ]);

  // Calculate overall stats for home screen
  const stats = calcOverallStats(rounds);

  const getActiveRoundSnapshot = () => {
    if (!roundIsActive) return null;

    return {
      scoringMode,
      currentHole,
      currentRound,
      recordedHoles: [...recordedHoles],
      customPars,
      customYardages,
      courseName,
      holeDraft: loadActiveRound()?.holeDraft || null,
    };
  };

  // Reset round state
  const resetRoundState = () => {
    setCurrentRound([]);
    setRecordedHoles(new Set());
    setCurrentHole(1);
    setCustomPars({});
    setCustomYardages({});
    setCourseName('');
    setRoundIsActive(false);
    setLastCompletedRoundId(null);
    initialActiveRoundRef.current = null;
    clearActiveRound();
  };

  const handleCancelRound = () => {
    if (currentRound.length) return;
    if (!window.confirm('Cancel this round? No holes have been recorded. Any unfinished hole entries will be discarded.')) return;
    resetRoundState();
    setCurrentScreen('home');
  };

  const confirmReplaceActiveRound = () => {
    if (!roundIsActive) return true;

    return window.confirm(
      'You already have a round in progress. Starting another round will discard the unfinished round. Continue?'
    );
  };

  // Record a hole
  const handleRecordHole = (holeData) => {
    setCurrentRound(prev => {
      const filtered = prev.filter(h => h.hole !== holeData.hole);
      return [...filtered, holeData].sort((a, b) => a.hole - b.hole);
    });
    setRecordedHoles(prev => new Set(prev).add(holeData.hole));
    setRoundIsActive(true);
  };

  // Unrecord a hole (for editing)
  const handleUnrecordHole = (holeNumber) => {
    setRecordedHoles(prev => {
      const newSet = new Set(prev);
      newSet.delete(holeNumber);
      return newSet;
    });
  };

  // Complete round (save to storage)
  const handleCompleteRound = (finalHoleData) => {
    let holesData = [...currentRound];
    
    // If final hole data provided, add/update it
    if (finalHoleData) {
      holesData = holesData.filter(h => h.hole !== finalHoleData.hole);
      holesData.push(finalHoleData);
      holesData.sort((a, b) => a.hole - b.hole);
    }
    
    if (holesData.length === 0) {
      alert('Please log at least one hole before completing the round.');
      return;
    }
    
    // Update currentRound for the complete screen
    setCurrentRound(holesData);
    setRoundIsActive(false);
    initialActiveRoundRef.current = null;
    clearActiveRound();

  // Add round to storage
const matchedCourse = getCourseByName(courseName);

const saved = addRound({
  date: getLocalDateString(),
  holes: holesData,
  courseName: courseName || 'Unnamed Course',
  customPars,
  customYardages,
  courseRating: matchedCourse?.courseRating ?? null,
  slopeRating: matchedCourse?.slopeRating ?? null,
  highlight: '',
  focusNextRound: ''
});

setLastCompletedRoundId(saved.id);
setCurrentScreen('roundComplete');
  };
  // Save round reflection (highlight + focusNextRound)
// Ensure we update the FULL round object so it persists correctly
  const handleSaveReflection = (roundId, reflection) => {
  const existing = rounds.find(r => r.id === roundId);
  if (!existing) return;

  const updatedRound = {
    ...existing,
    highlight: typeof reflection?.highlight === 'string'
      ? reflection.highlight
      : existing.highlight || '',
    focusNextRound: typeof reflection?.focusNextRound === 'string'
      ? reflection.focusNextRound
      : existing.focusNextRound || ''
  };

  updateRound(roundId, updatedRound);

};

  // Save course
  const handleSaveCourse = (name, parsData, yardagesData) => {
    // Check for existing course with same name
    const existing = getCourseByName(name);
    if (existing) {
      const shouldOverwrite = window.confirm(
        `A course named "${name}" already exists. Would you like to overwrite it?`
      );
      if (!shouldOverwrite) return;
      deleteCourse(existing.id);

    }
    
    addCourse({
      name,
      pars: parsData,
      yardages: yardagesData
    });

    
    alert(`"${name}" has been saved!`);
  };

  // Handle course save from create/edit screen
  const handleSaveCourseFromEditor = (courseData) => {
    if (courseData.id) {
      // Update existing
      const existing = courses.find(course => course.id === courseData.id);
      const updatedCourse = {
        ...existing,
        ...courseData,
        id: courseData.id,
        createdAt: existing?.createdAt,
        updatedAt: new Date().toISOString(),
        syncedAt: null,
      };
      updateCourse(courseData.id, updatedCourse);

      alert(`"${courseData.name}" has been updated!`);
    } else {
      // Check for duplicate name
      const existing = getCourseByName(courseData.name);
      if (existing) {
        const shouldOverwrite = window.confirm(
          `A course named "${courseData.name}" already exists. Would you like to overwrite it?`
        );
        if (!shouldOverwrite) return;
        deleteCourse(existing.id);

      }
      addCourse(courseData);

      alert(`"${courseData.name}" has been saved!`);
    }
    setEditingCourse(null);
    setCurrentScreen('manageCourses');
  };

  // Show splash screen
  if (showSplash) {
    return <SplashScreen />;
  }

  const RoundScoringScreen = scoringMode === 'quick' ? QuickScoreScreen : LogRoundScreen;

  // Render current screen
  switch (currentScreen) {
    case 'home':
      return (
        <HomeScreen
          stats={stats}
          savedCourses={courses}
          onNavigate={setCurrentScreen}
          activeRound={getActiveRoundSnapshot()}
          onResumeRound={() => setCurrentScreen('logRound')}
          onEndActiveRound={() => handleCompleteRound(null)}
          onCancelRound={handleCancelRound}
        />
      );

    case 'selectCourse':
      return (
        <SelectCourseScreen
          courses={courses}
          onUpdateCourses={setCourses}
          onSelectCourse={(course) => {
            if (!confirmReplaceActiveRound()) return;
            resetRoundState();
            setCustomPars(course.pars || {});
            setCustomYardages(course.yardages || {});
            setCourseName(course.name);
            setRoundIsActive(true);
            setCurrentScreen('chooseScoring');
          }}
          onNewCourse={() => {
            if (!confirmReplaceActiveRound()) return;
            resetRoundState();
            setRoundIsActive(true);
            setCurrentScreen('chooseScoring');
          }}
          onBack={() => setCurrentScreen('home')}
        />
      );

    case 'chooseScoring':
      return <main style={{ maxWidth: 520, margin: 'auto', padding: 24, color: COLORS.darkTeal }}>
        <BackButton onClick={() => setCurrentScreen('selectCourse')}>Back</BackButton>
        <h1>How would you like to score?</h1>
        <p>Choose what works for you today.</p>
        {[['quick', 'Quick Score', 'Enter your total. Add fairway and putt stats if you like.'], ['detailed', 'Detailed Tracking', 'Record your tee shot, approaches, short game and putts. We calculate your score.']].map(([mode, title, description]) => <button key={mode} onClick={() => { setScoringMode(mode); localStorage.setItem('bb_scoringMode', mode); setCurrentScreen('logRound'); }} style={{ display: 'block', width: '100%', textAlign: 'left', background: mode === (localStorage.getItem('bb_scoringMode') || 'quick') ? '#f8dfe6' : '#eff8f8', border: `2px solid ${COLORS.mistyBlue}`, borderRadius: 18, padding: 20, margin: '16px 0', color: COLORS.darkTeal, cursor: 'pointer' }}><strong style={{ fontSize: 22 }}>{title}</strong><p>{description}</p>{mode === localStorage.getItem('bb_scoringMode') && <span>Last used</span>}</button>)}
      </main>;

    case 'logRound':
      return (
        <RoundScoringScreen
          courseName={courseName}
          setCourseName={setCourseName}
          currentHole={currentHole}
          setCurrentHole={setCurrentHole}
          customPars={customPars}
          setCustomPars={setCustomPars}
          customYardages={customYardages}
          setCustomYardages={setCustomYardages}
          currentRound={currentRound}
          recordedHoles={recordedHoles}
          onCancelRound={handleCancelRound}
          onRecordHole={handleRecordHole}
          onUnrecordHole={handleUnrecordHole}
          onCompleteRound={handleCompleteRound}
          onBack={() => setCurrentScreen('home')}
        />
      );

    case 'roundComplete':
      return (
        <RoundCompleteScreen
          currentRound={currentRound}
          customPars={customPars}
          customYardages={customYardages}
          onSaveCourse={handleSaveCourse}
          lastCompletedRoundId={lastCompletedRoundId}
          onSaveReflection={handleSaveReflection}
          onGoHome={() => {
            resetRoundState();
            setCurrentScreen('home');
          }}
          onNewRound={() => {
            resetRoundState();
            setCurrentScreen('selectCourse');
          }}
        />
      );

    case 'stats':
      return (
        <StatsScreen
          rounds={rounds}
          courses={courses}
          setRounds={setRounds}
          setCourses={setCourses}
          onBack={() => setCurrentScreen('home')}
          onUpdateRound={(roundId, updates) => {
            const existing = rounds.find(round => round.id === roundId);
            const updatedRound = {
              ...existing,
              ...updates,
              id: roundId,
              createdAt: existing?.createdAt,
              updatedAt: new Date().toISOString(),
              syncedAt: null,
            };
            updateRound(roundId, updatedRound);

          }}
          onDeleteRound={(roundId) => {
            deleteRound(roundId);

          }}
        />
      );

    case 'manageCourses':
      return (
        <ManageCoursesScreen
          courses={courses}
          onBack={() => setCurrentScreen('home')}
          onEditCourse={(course) => {
            setEditingCourse(course);
            setCurrentScreen('createCourse');
          }}
          onDeleteCourse={(courseId) => {
            deleteCourse(courseId);

          }}
          onCreateCourse={() => {
            setEditingCourse(null);
            setCurrentScreen('createCourse');
          }}
        />
      );

    case 'createCourse':
      return (
        <CreateCourseScreen
          initialCourse={editingCourse}
          onSave={handleSaveCourseFromEditor}
          onBack={() => {
            setEditingCourse(null);
            setCurrentScreen('manageCourses');
          }}
        />
      );

    case 'shop':
      return (
        <ShopScreen
          onBack={() => setCurrentScreen('home')}
        />
      );

    case 'accountBackup':
      return (
        <AccountBackupScreen
          onFileBackup={() => setCurrentScreen('stats')}
          rounds={rounds}
          courses={courses}
          onRestoreData={({ rounds: restoredRounds, courses: restoredCourses }) => {
            setRounds(restoredRounds);
            setCourses(restoredCourses);
          }}
          onBack={() => setCurrentScreen('home')}
        />
      );

    case 'journal':
      // Placeholder for journal screen
      return (
        <div style={{ padding: '24px' }}>
          <BackButton onClick={() => setCurrentScreen('home')}>Back to Home</BackButton>
          <h2>Tips & Journal - Coming Soon!</h2>
        </div>
      );
      
case 'about':
  return <AboutScreen onNavigate={setCurrentScreen} />;

    default:
      return (
        <HomeScreen
          stats={stats}
          savedCourses={courses}
          onNavigate={setCurrentScreen}
          activeRound={getActiveRoundSnapshot()}
          onResumeRound={() => setCurrentScreen('logRound')}
          onEndActiveRound={() => handleCompleteRound(null)}
          onCancelRound={handleCancelRound}
        />
      );
  }
}
