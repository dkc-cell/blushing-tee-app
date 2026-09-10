import React, { useState, useEffect, useRef } from 'react';
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
import { useAuth } from '../hooks/useAuth';
import { calcOverallStats, getLocalDateString } from '../utils';
import {
  deleteCourseFromCloud,
  deleteRoundFromCloud,
  loadCloudCourses,
  loadCloudRounds,
  mergeCourses,
  mergeRounds,
  syncCourseToCloud,
  syncCoursesToCloud,
  syncRoundToCloud,
  syncRoundsToCloud,
} from '../services/accountSyncService';
import { usePageSeo } from '../utils/seo';

export default function AppPage() {
  usePageSeo({
    title: 'Blushing Birdie App',
    description:
      'Open the Blushing Birdie private golf round tracker and scorecard app.',
    path: '/app',
    robots: 'noindex,nofollow',
  });

  // Splash screen
  const [showSplash, setShowSplash] = useState(true);
  
  // Navigation
  const [currentScreen, setCurrentScreen] = useState('home');
  
  // Data hooks with localStorage persistence
  const { rounds, setRounds, addRound, updateRound, deleteRound } = useRounds();
  const { courses, setCourses, addCourse, updateCourse, deleteCourse, getCourseByName } = useCourses();
  const auth = useAuth();
  const courseSyncUserIdRef = useRef(null);
  const roundSyncUserIdRef = useRef(null);
  
  // Current round state
  const [currentHole, setCurrentHole] = useState(1);
  const [currentRound, setCurrentRound] = useState([]);
  const [recordedHoles, setRecordedHoles] = useState(new Set());
  const [customPars, setCustomPars] = useState({});
  const [customYardages, setCustomYardages] = useState({});
  const [courseName, setCourseName] = useState('');
  const [lastCompletedRoundId, setLastCompletedRoundId] = useState(null);

  // Course editing state
  const [editingCourse, setEditingCourse] = useState(null);

  // Hide splash after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!auth.isPasswordRecovery) return;

    setShowSplash(false);
    setCurrentScreen('accountBackup');
  }, [auth.isPasswordRecovery]);

  useEffect(() => {
    if (auth.loading) return;

    if (!auth.user?.id) {
      courseSyncUserIdRef.current = null;
      return;
    }

    if (courseSyncUserIdRef.current === auth.user.id) return;

    let cancelled = false;
    courseSyncUserIdRef.current = auth.user.id;

    const syncCoursesForSignedInUser = async () => {
      try {
        const cloudCourses = await loadCloudCourses({ user: auth.user });
        const mergedCourses = mergeCourses({ localCourses: courses, cloudCourses });
        const syncedCourses = await syncCoursesToCloud({
          user: auth.user,
          courses: mergedCourses,
        });

        if (cancelled) return;

        setCourses(
          mergeCourses({
            localCourses: mergedCourses,
            cloudCourses: syncedCourses,
          })
        );
      } catch (error) {
        console.error('Error syncing account courses:', error);
      }
    };

    syncCoursesForSignedInUser();

    return () => {
      cancelled = true;
    };
  }, [auth.loading, auth.user, courses, setCourses]);

  useEffect(() => {
    if (auth.loading) return;

    if (!auth.user?.id) {
      roundSyncUserIdRef.current = null;
      return;
    }

    if (roundSyncUserIdRef.current === auth.user.id) return;

    let cancelled = false;
    roundSyncUserIdRef.current = auth.user.id;

    const syncRoundsForSignedInUser = async () => {
      try {
        const cloudRounds = await loadCloudRounds({ user: auth.user });
        const mergedRounds = mergeRounds({ localRounds: rounds, cloudRounds });
        const syncedRounds = await syncRoundsToCloud({
          user: auth.user,
          rounds: mergedRounds,
        });

        if (cancelled) return;

        setRounds(
          mergeRounds({
            localRounds: mergedRounds,
            cloudRounds: syncedRounds,
          })
        );
      } catch (error) {
        console.error('Error syncing account rounds:', error);
      }
    };

    syncRoundsForSignedInUser();

    return () => {
      cancelled = true;
    };
  }, [auth.loading, auth.user, rounds, setRounds]);

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
    setLastCompletedRoundId(null);
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

syncSavedRound(saved);
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
  syncSavedRound({ ...updatedRound, updatedAt: new Date().toISOString(), syncedAt: null });
};

  const replaceRoundWithSyncedCopy = (syncedRound) => {
    if (!syncedRound?.id) return;

    setRounds(prevRounds =>
      prevRounds.map(round =>
        round.id === syncedRound.id ? { ...round, ...syncedRound } : round
      )
    );
  };

  const syncSavedRound = async (round) => {
    if (!auth.user?.id || !round?.id) return;

    try {
      const syncedRound = await syncRoundToCloud({ user: auth.user, round });
      replaceRoundWithSyncedCopy(syncedRound);
    } catch (error) {
      console.error('Error syncing round:', error);
    }
  };

  const deleteSyncedRound = async (roundId) => {
    if (!auth.user?.id || !roundId) return;

    try {
      await deleteRoundFromCloud({ user: auth.user, roundId });
    } catch (error) {
      console.error('Error deleting synced round:', error);
    }
  };

  const replaceCourseWithSyncedCopy = (syncedCourse) => {
    if (!syncedCourse?.id) return;

    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === syncedCourse.id ? { ...course, ...syncedCourse } : course
      )
    );
  };

  const syncSavedCourse = async (course) => {
    if (!auth.user?.id || !course?.id) return;

    try {
      const syncedCourse = await syncCourseToCloud({ user: auth.user, course });
      replaceCourseWithSyncedCopy(syncedCourse);
    } catch (error) {
      console.error('Error syncing course:', error);
    }
  };

  const deleteSyncedCourse = async (courseId) => {
    if (!auth.user?.id || !courseId) return;

    try {
      await deleteCourseFromCloud({ user: auth.user, courseId });
    } catch (error) {
      console.error('Error deleting synced course:', error);
    }
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
      deleteSyncedCourse(existing.id);
    }
    
    const savedCourse = addCourse({
      name,
      pars: parsData,
      yardages: yardagesData
    });
    syncSavedCourse(savedCourse);
    
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
      syncSavedCourse(updatedCourse);
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
        deleteSyncedCourse(existing.id);
      }
      const savedCourse = addCourse(courseData);
      syncSavedCourse(savedCourse);
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
          lastCompletedRoundId={lastCompletedRoundId}
          onSaveReflection={handleSaveReflection}
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
            syncSavedRound(updatedRound);
          }}
          onDeleteRound={(roundId) => {
            deleteRound(roundId);
            deleteSyncedRound(roundId);
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
            deleteSyncedCourse(courseId);
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
          user={auth.user}
          authLoading={auth.loading}
          isSupabaseConfigured={auth.isConfigured}
          isPasswordRecovery={auth.isPasswordRecovery}
          onPasswordRecoveryComplete={auth.clearPasswordRecovery}
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
