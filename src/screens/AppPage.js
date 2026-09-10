import React, { useEffect, useRef, useState } from 'react';
import { SplashScreen } from '../components';
import {
  SelectCourseScreen, LogRoundScreen, RoundCompleteScreen,
  StatsScreen, ManageCoursesScreen, CreateCourseScreen, ShopScreen,
  AboutScreen, AccountBackupScreen
} from './index';
import { useRounds, useCourses } from '../hooks';
import HomeScreen from './HomeScreenResume';
import { useAuth } from '../hooks/useAuth';
import { calcOverallStats, getLocalDateString } from '../utils';
import {
  deleteCourseFromCloud, deleteRoundFromCloud, loadCloudCourses, loadCloudRounds,
  mergeCourses, mergeRounds, syncCourseToCloud, syncCoursesToCloud,
  syncRoundToCloud, syncRoundsToCloud,
} from '../services/accountSyncService';
import { usePageSeo } from '../utils/seo';

const ACTIVE_ROUND_KEY = 'blushingBirdieActiveRound';

const loadActiveRound = () => {
  try {
    const saved = localStorage.getItem(ACTIVE_ROUND_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed && Array.isArray(parsed.currentRound) ? parsed : null;
  } catch (error) {
    console.error('Error loading active round:', error);
    return null;
  }
};

export default function AppPage() {
  usePageSeo({
    title: 'Blushing Birdie App',
    description: 'Open the Blushing Birdie private golf round tracker and scorecard app.',
    path: '/app', robots: 'noindex,nofollow',
  });

  const restoredActiveRoundRef = useRef(loadActiveRound());
  const restored = restoredActiveRoundRef.current;
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  const { rounds, setRounds, addRound, updateRound, deleteRound } = useRounds();
  const { courses, setCourses, addCourse, updateCourse, deleteCourse, getCourseByName } = useCourses();
  const auth = useAuth();
  const courseSyncUserIdRef = useRef(null);
  const roundSyncUserIdRef = useRef(null);

  const [currentHole, setCurrentHole] = useState(restored?.currentHole || 1);
  const [currentRound, setCurrentRound] = useState(restored?.currentRound || []);
  const [recordedHoles, setRecordedHoles] = useState(new Set(restored?.recordedHoles || []));
  const [customPars, setCustomPars] = useState(restored?.customPars || {});
  const [customYardages, setCustomYardages] = useState(restored?.customYardages || {});
  const [courseName, setCourseName] = useState(restored?.courseName || '');
  const [lastCompletedRoundId, setLastCompletedRoundId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

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
    if (!courseName && currentRound.length === 0) return;
    try {
      localStorage.setItem(ACTIVE_ROUND_KEY, JSON.stringify({
        courseName, currentHole, currentRound,
        recordedHoles: Array.from(recordedHoles), customPars, customYardages,
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error saving active round:', error);
    }
  }, [courseName, currentHole, currentRound, recordedHoles, customPars, customYardages]);

  useEffect(() => {
    if (auth.loading || !auth.user?.id || courseSyncUserIdRef.current === auth.user.id) {
      if (!auth.user?.id) courseSyncUserIdRef.current = null;
      return;
    }
    let cancelled = false;
    courseSyncUserIdRef.current = auth.user.id;
    (async () => {
      try {
        const cloudCourses = await loadCloudCourses({ user: auth.user });
        const mergedCourses = mergeCourses({ localCourses: courses, cloudCourses });
        const syncedCourses = await syncCoursesToCloud({ user: auth.user, courses: mergedCourses });
        if (!cancelled) setCourses(mergeCourses({ localCourses: mergedCourses, cloudCourses: syncedCourses }));
      } catch (error) { console.error('Error syncing account courses:', error); }
    })();
    return () => { cancelled = true; };
  }, [auth.loading, auth.user, courses, setCourses]);

  useEffect(() => {
    if (auth.loading || !auth.user?.id || roundSyncUserIdRef.current === auth.user.id) {
      if (!auth.user?.id) roundSyncUserIdRef.current = null;
      return;
    }
    let cancelled = false;
    roundSyncUserIdRef.current = auth.user.id;
    (async () => {
      try {
        const cloudRounds = await loadCloudRounds({ user: auth.user });
        const mergedRounds = mergeRounds({ localRounds: rounds, cloudRounds });
        const syncedRounds = await syncRoundsToCloud({ user: auth.user, rounds: mergedRounds });
        if (!cancelled) setRounds(mergeRounds({ localRounds: mergedRounds, cloudRounds: syncedRounds }));
      } catch (error) { console.error('Error syncing account rounds:', error); }
    })();
    return () => { cancelled = true; };
  }, [auth.loading, auth.user, rounds, setRounds]);

  const stats = calcOverallStats(rounds);
  const hasActiveRound = currentRound.length > 0 || Boolean(courseName && currentHole > 1);
  const activeRound = hasActiveRound ? {
    courseName: courseName || 'Current Course', currentHole,
    holesRecorded: recordedHoles.size,
  } : null;

  const clearActiveRoundStorage = () => {
    try { localStorage.removeItem(ACTIVE_ROUND_KEY); } catch (error) {
      console.error('Error clearing active round:', error);
    }
  };

  const resetRoundState = () => {
    setCurrentRound([]); setRecordedHoles(new Set()); setCurrentHole(1);
    setCustomPars({}); setCustomYardages({}); setCourseName('');
    setLastCompletedRoundId(null); clearActiveRoundStorage();
  };

  const handleRecordHole = (holeData) => {
    setCurrentRound(prev => [...prev.filter(h => h.hole !== holeData.hole), holeData].sort((a,b) => a.hole-b.hole));
    setRecordedHoles(prev => new Set(prev).add(holeData.hole));
  };

  const handleUnrecordHole = (holeNumber) => setRecordedHoles(prev => {
    const next = new Set(prev); next.delete(holeNumber); return next;
  });

  const replaceRoundWithSyncedCopy = (syncedRound) => {
    if (!syncedRound?.id) return;
    setRounds(prev => prev.map(r => r.id === syncedRound.id ? { ...r, ...syncedRound } : r));
  };
  const syncSavedRound = async (round) => {
    if (!auth.user?.id || !round?.id) return;
    try { replaceRoundWithSyncedCopy(await syncRoundToCloud({ user: auth.user, round })); }
    catch (error) { console.error('Error syncing round:', error); }
  };
  const deleteSyncedRound = async (roundId) => {
    if (!auth.user?.id || !roundId) return;
    try { await deleteRoundFromCloud({ user: auth.user, roundId }); }
    catch (error) { console.error('Error deleting synced round:', error); }
  };
  const replaceCourseWithSyncedCopy = (syncedCourse) => {
    if (!syncedCourse?.id) return;
    setCourses(prev => prev.map(c => c.id === syncedCourse.id ? { ...c, ...syncedCourse } : c));
  };
  const syncSavedCourse = async (course) => {
    if (!auth.user?.id || !course?.id) return;
    try { replaceCourseWithSyncedCopy(await syncCourseToCloud({ user: auth.user, course })); }
    catch (error) { console.error('Error syncing course:', error); }
  };
  const deleteSyncedCourse = async (courseId) => {
    if (!auth.user?.id || !courseId) return;
    try { await deleteCourseFromCloud({ user: auth.user, courseId }); }
    catch (error) { console.error('Error deleting synced course:', error); }
  };

  const handleCompleteRound = (finalHoleData) => {
    let holesData = [...currentRound];
    if (finalHoleData) {
      holesData = holesData.filter(h => h.hole !== finalHoleData.hole);
      holesData.push(finalHoleData); holesData.sort((a,b) => a.hole-b.hole);
    }
    if (!holesData.length) { alert('Please log at least one hole before completing the round.'); return; }
    setCurrentRound(holesData);
    const matchedCourse = getCourseByName(courseName);
    const saved = addRound({
      date: getLocalDateString(), holes: holesData, courseName: courseName || 'Unnamed Course',
      customPars, customYardages, courseRating: matchedCourse?.courseRating ?? null,
      slopeRating: matchedCourse?.slopeRating ?? null, highlight: '', focusNextRound: ''
    });
    clearActiveRoundStorage(); syncSavedRound(saved); setLastCompletedRoundId(saved.id); setCurrentScreen('roundComplete');
  };

  const handleSaveReflection = (roundId, reflection) => {
    const existing = rounds.find(r => r.id === roundId); if (!existing) return;
    const updatedRound = { ...existing,
      highlight: typeof reflection?.highlight === 'string' ? reflection.highlight : existing.highlight || '',
      focusNextRound: typeof reflection?.focusNextRound === 'string' ? reflection.focusNextRound : existing.focusNextRound || ''
    };
    updateRound(roundId, updatedRound);
    syncSavedRound({ ...updatedRound, updatedAt: new Date().toISOString(), syncedAt: null });
  };

  const handleEndActiveRoundEarly = () => {
    if (!currentRound.length) return;
    handleCompleteRound(null);
  };

  const handleSaveCourse = (name, parsData, yardagesData) => {
    const existing = getCourseByName(name);
    if (existing) {
      if (!window.confirm(`A course named "${name}" already exists. Would you like to overwrite it?`)) return;
      deleteCourse(existing.id); deleteSyncedCourse(existing.id);
    }
    const savedCourse = addCourse({ name, pars: parsData, yardages: yardagesData });
    syncSavedCourse(savedCourse); alert(`"${name}" has been saved!`);
  };

  const handleSaveCourseFromEditor = (courseData) => {
    if (courseData.id) {
      const existing = courses.find(c => c.id === courseData.id);
      const updated = { ...existing, ...courseData, id: courseData.id, createdAt: existing?.createdAt, updatedAt: new Date().toISOString(), syncedAt: null };
      updateCourse(courseData.id, updated); syncSavedCourse(updated); alert(`"${courseData.name}" has been updated!`);
    } else {
      const existing = getCourseByName(courseData.name);
      if (existing) {
        if (!window.confirm(`A course named "${courseData.name}" already exists. Would you like to overwrite it?`)) return;
        deleteCourse(existing.id); deleteSyncedCourse(existing.id);
      }
      const saved = addCourse(courseData); syncSavedCourse(saved); alert(`"${courseData.name}" has been saved!`);
    }
    setEditingCourse(null); setCurrentScreen('manageCourses');
  };

  if (showSplash) return <SplashScreen />;

  switch (currentScreen) {
    case 'home': return <HomeScreen stats={stats} savedCourses={courses} onNavigate={setCurrentScreen}
      activeRound={activeRound} onResumeRound={() => setCurrentScreen('logRound')} onEndRoundEarly={handleEndActiveRoundEarly} />;
    case 'selectCourse': return <SelectCourseScreen courses={courses} onUpdateCourses={setCourses}
      onSelectCourse={(course) => { resetRoundState(); setCustomPars(course.pars || {}); setCustomYardages(course.yardages || {}); setCourseName(course.name); setCurrentScreen('logRound'); }}
      onNewCourse={() => { resetRoundState(); setCurrentScreen('logRound'); }} onBack={() => setCurrentScreen('home')} />;
    case 'logRound': return <LogRoundScreen currentHole={currentHole} setCurrentHole={setCurrentHole} customPars={customPars}
      setCustomPars={setCustomPars} customYardages={customYardages} setCustomYardages={setCustomYardages} currentRound={currentRound}
      recordedHoles={recordedHoles} onRecordHole={handleRecordHole} onUnrecordHole={handleUnrecordHole}
      onCompleteRound={handleCompleteRound} onBack={() => setCurrentScreen('home')} />;
    case 'roundComplete': return <RoundCompleteScreen currentRound={currentRound} customPars={customPars} customYardages={customYardages}
      onSaveCourse={handleSaveCourse} lastCompletedRoundId={lastCompletedRoundId} onSaveReflection={handleSaveReflection}
      onGoHome={() => { resetRoundState(); setCurrentScreen('home'); }} onNewRound={() => { resetRoundState(); setCurrentScreen('logRound'); }} />;
    case 'stats': return <StatsScreen rounds={rounds} courses={courses} setRounds={setRounds} setCourses={setCourses} onBack={() => setCurrentScreen('home')}
      onUpdateRound={(roundId, updates) => { const existing=rounds.find(r=>r.id===roundId); const updated={...existing,...updates,id:roundId,createdAt:existing?.createdAt,updatedAt:new Date().toISOString(),syncedAt:null}; updateRound(roundId,updated); syncSavedRound(updated); }}
      onDeleteRound={(roundId) => { deleteRound(roundId); deleteSyncedRound(roundId); }} />;
    case 'manageCourses': return <ManageCoursesScreen courses={courses} onBack={() => setCurrentScreen('home')}
      onEditCourse={(course) => { setEditingCourse(course); setCurrentScreen('createCourse'); }} onDeleteCourse={(id) => { deleteCourse(id); deleteSyncedCourse(id); }}
      onCreateCourse={() => { setEditingCourse(null); setCurrentScreen('createCourse'); }} />;
    case 'createCourse': return <CreateCourseScreen initialCourse={editingCourse} onSave={handleSaveCourseFromEditor}
      onBack={() => { setEditingCourse(null); setCurrentScreen('manageCourses'); }} />;
    case 'shop': return <ShopScreen onBack={() => setCurrentScreen('home')} />;
    case 'accountBackup': return <AccountBackupScreen user={auth.user} authLoading={auth.loading} isSupabaseConfigured={auth.isConfigured}
      isPasswordRecovery={auth.isPasswordRecovery} onPasswordRecoveryComplete={auth.clearPasswordRecovery} rounds={rounds} courses={courses}
      onRestoreData={({rounds:rr,courses:cc}) => { setRounds(rr); setCourses(cc); }} onBack={() => setCurrentScreen('home')} />;
    case 'journal': return <div style={{padding:'24px'}}><button onClick={() => setCurrentScreen('home')}>← Back</button><h2>Tips & Journal - Coming Soon!</h2></div>;
    case 'about': return <AboutScreen onNavigate={setCurrentScreen} />;
    default: return <HomeScreen stats={stats} savedCourses={courses} onNavigate={setCurrentScreen} activeRound={activeRound}
      onResumeRound={() => setCurrentScreen('logRound')} onEndRoundEarly={handleEndActiveRoundEarly} />;
  }
}
