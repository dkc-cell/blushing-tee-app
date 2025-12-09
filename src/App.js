import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components';
import {
  HomeScreen,
  SelectCourseScreen,
  LogRoundScreen,
  RoundCompleteScreen,
  StatsScreen,
  ManageCoursesScreen,
  CreateCourseScreen,
  ShopScreen,
  AboutScreen
} from './screens';
import { useRounds, useCourses } from './hooks';
import { calcOverallStats, getLocalDateString, generateId } from './utils';
import blushingBirdieLogo from './assets/images/Blushing_Birdie_Logo.png';

export default function App() {
  // Splash screen
  const [showSplash, setShowSplash] = useState(true);
  
  // Navigation
  const [currentScreen, setCurrentScreen] = useState('home');
  
  // Data hooks with localStorage persistence
  const { rounds, addRound, updateRound, deleteRound } = useRounds();
  const { courses, setCourses, addCourse, updateCourse, deleteCourse, getCourseByName } = useCourses();
  
  // Current round state
  const [currentHole, setCurrentHole] = useState(1);
  const [currentRound, setCurrentRound] = useState([]);
  const [recordedHoles, setRecordedHoles] = useState(new Set());
  const [customPars, setCustomPars] = useState({});
  const [customYardages, setCustomYardages] = useState({});
  const [courseName, setCourseName] = useState('');
  
  // Course editing state
  const [editingCourse, setEditingCourse] = useState(null);

  // Hide splash after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate overall stats for home screen
  const stats = calcOverallStats(rounds);

  // Reset round state
  const resetRoundState = () => {
    setCurrentRound([]);
    setRecordedHoles(new Set());
    setCurrentHole(1);
    setCustomPars({});
    setCustomYardages({});
    setCourseName('');
  };

  // Record a hole
  const handleRecordHole = (holeData) => {
    setCurrentRound(prev => {
      const filtered = prev.filter(h => h.hole !== holeData.hole);
      return [...filtered, holeData].sort((a, b) => a.hole - b.hole);
    });
    setRecordedHoles(prev => new Set(prev).add(holeData.hole));
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
    
    // Add round to storage
    addRound({
      date: getLocalDateString(),
      holes: holesData,
      courseName: courseName || 'Unnamed Course',
      customPars,
      customYardages
    });
    
    setCurrentScreen('roundComplete');
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
      updateCourse(courseData.id, courseData);
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

  // Render current screen
  switch (currentScreen) {
    case 'home':
      return (
        <HomeScreen
          stats={stats}
          savedCourses={courses}
          onNavigate={setCurrentScreen}
        />
      );

    case 'selectCourse':
      return (
        <SelectCourseScreen
          courses={courses}
          onUpdateCourses={setCourses}
          onSelectCourse={(course) => {
            setCustomPars(course.pars || {});
            setCustomYardages(course.yardages || {});
            setCourseName(course.name);
            setCurrentScreen('logRound');
          }}
          onNewCourse={() => {
            resetRoundState();
            setCurrentScreen('logRound');
          }}
          onBack={() => setCurrentScreen('home')}
        />
      );

    case 'logRound':
      return (
        <LogRoundScreen
          currentHole={currentHole}
          setCurrentHole={setCurrentHole}
          customPars={customPars}
          setCustomPars={setCustomPars}
          customYardages={customYardages}
          setCustomYardages={setCustomYardages}
          currentRound={currentRound}
          recordedHoles={recordedHoles}
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
          onGoHome={() => {
            resetRoundState();
            setCurrentScreen('home');
          }}
          onNewRound={() => {
            resetRoundState();
            setCurrentScreen('logRound');
          }}
        />
      );

    case 'stats':
      return (
        <StatsScreen
          rounds={rounds}
          onBack={() => setCurrentScreen('home')}
          onUpdateRound={updateRound}
          onDeleteRound={deleteRound}
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
          onDeleteCourse={deleteCourse}
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

    case 'journal':
      // Placeholder for journal screen
      return (
        <div style={{ padding: '24px' }}>
          <button onClick={() => setCurrentScreen('home')}>← Back</button>
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
        />
      );
  }
}
