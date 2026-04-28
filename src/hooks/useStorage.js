import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';
import { generateId } from '../utils';

const nowIso = () => new Date().toISOString();

const normalizeCourse = (course) => {
  const timestamp = nowIso();
  const createdAt = course.createdAt || timestamp;

  return {
    ...course,
    id: course.id || generateId(),
    createdAt,
    updatedAt: course.updatedAt || createdAt,
    syncedAt: course.syncedAt || null,
  };
};

const normalizeCourses = (courses) =>
  Array.isArray(courses) ? courses.map(normalizeCourse) : [];

const normalizeRound = (round) => {
  const timestamp = nowIso();
  const createdAt = round.createdAt || timestamp;

  return {
    ...round,
    id: round.id || generateId(),
    createdAt,
    updatedAt: round.updatedAt || createdAt,
    syncedAt: round.syncedAt || null,
  };
};

const normalizeRounds = (rounds) =>
  Array.isArray(rounds) ? rounds.map(normalizeRound) : [];

/**
 * Custom hook for managing rounds data with localStorage persistence
 */
export const useRounds = () => {
  const [rounds, setRounds] = useState([]);

  // Load rounds from localStorage on mount
  useEffect(() => {
    try {
      const savedRounds = localStorage.getItem(STORAGE_KEYS.ROUNDS);
      if (savedRounds) {
        const parsedRounds = JSON.parse(savedRounds);
        setRounds(normalizeRounds(parsedRounds));
      }
    } catch (error) {
      console.error('Error loading rounds from localStorage:', error);
    }
  }, []);

  // Save rounds to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(rounds));
    } catch (error) {
      console.error('Error saving rounds to localStorage:', error);
    }
  }, [rounds]);

  const setRoundsForStorage = useCallback((nextRounds) => {
    if (typeof nextRounds === 'function') {
      setRounds(prev => normalizeRounds(nextRounds(prev)));
      return;
    }

    setRounds(normalizeRounds(nextRounds));
  }, []);

  const addRound = useCallback((roundData) => {
    const timestamp = nowIso();
    const newRound = normalizeRound({
      ...roundData,
      id: roundData.id || generateId(),
      createdAt: roundData.createdAt || timestamp,
      updatedAt: timestamp,
      syncedAt: roundData.syncedAt || null,
    });
    setRounds(prev => [...prev, newRound]);
    return newRound;
  }, []);

  const updateRound = useCallback((roundId, updates) => {
  let updatedRound = null;
  setRounds(prev =>
    prev.map(round =>
      round.id === roundId
        ? (updatedRound = normalizeRound({
            ...round,
            ...updates,
            id: round.id,
            createdAt: round.createdAt,
            updatedAt: nowIso(),
            syncedAt: updates.syncedAt ?? null,
          }))
        : round
    )
  );
  return updatedRound;
}, []);

  const deleteRound = useCallback((roundId) => {
    setRounds(prev => prev.filter(round => round.id !== roundId));
  }, []);

  const getRoundById = useCallback((roundId) => {
    return rounds.find(round => round.id === roundId);
  }, [rounds]);

  return {
  rounds,
  setRounds: setRoundsForStorage,
  addRound,
  updateRound,
  deleteRound,
  getRoundById
};
};

/**
 * Custom hook for managing courses data with localStorage persistence
 */
export const useCourses = () => {
  const [courses, setCourses] = useState([]);

  // Load courses from localStorage on mount
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (savedCourses) {
        const parsedCourses = JSON.parse(savedCourses);
        setCourses(normalizeCourses(parsedCourses));
      }
    } catch (error) {
      console.error('Error loading courses from localStorage:', error);
    }
  }, []);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving courses to localStorage:', error);
    }
  }, [courses]);

  const setCoursesForStorage = useCallback((nextCourses) => {
    if (typeof nextCourses === 'function') {
      setCourses(prev => normalizeCourses(nextCourses(prev)));
      return;
    }

    setCourses(normalizeCourses(nextCourses));
  }, []);

  const addCourse = useCallback((courseData) => {
    const timestamp = nowIso();
    const newCourse = normalizeCourse({
      ...courseData,
      id: courseData.id || generateId(),
      createdAt: courseData.createdAt || timestamp,
      updatedAt: timestamp,
      syncedAt: courseData.syncedAt || null,
    });
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  }, []);

  const updateCourse = useCallback((courseId, updates) => {
    let updatedCourse = null;
    setCourses(prev => prev.map(course => 
      course.id === courseId
        ? (updatedCourse = normalizeCourse({
            ...course,
            ...updates,
            id: course.id,
            createdAt: course.createdAt,
            updatedAt: nowIso(),
            syncedAt: updates.syncedAt ?? null,
          }))
        : course
    ));
    return updatedCourse;
  }, []);

  const deleteCourse = useCallback((courseId) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  }, []);

  const getCourseById = useCallback((courseId) => {
    return courses.find(course => course.id === courseId);
  }, [courses]);

  const getCourseByName = useCallback((name) => {
    return courses.find(course => 
      course.name.toLowerCase() === name.toLowerCase()
    );
  }, [courses]);

  return {
    courses,
    setCourses: setCoursesForStorage,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    getCourseByName
  };
};

/**
 * Custom hook for managing current round state during play
 */
export const useCurrentRound = () => {
  const [currentRound, setCurrentRound] = useState([]);
  const [recordedHoles, setRecordedHoles] = useState(new Set());
  const [currentHole, setCurrentHole] = useState(1);
  const [customPars, setCustomPars] = useState({});
  const [customYardages, setCustomYardages] = useState({});
  const [courseName, setCourseName] = useState('');

  const recordHole = useCallback((holeData) => {
    setCurrentRound(prev => {
      const filtered = prev.filter(h => h.hole !== holeData.hole);
      return [...filtered, holeData].sort((a, b) => a.hole - b.hole);
    });
    setRecordedHoles(prev => new Set(prev).add(holeData.hole));
  }, []);

  const unrecordHole = useCallback((holeNumber) => {
    setRecordedHoles(prev => {
      const newSet = new Set(prev);
      newSet.delete(holeNumber);
      return newSet;
    });
  }, []);

  const getHoleData = useCallback((holeNumber) => {
    return currentRound.find(h => h.hole === holeNumber);
  }, [currentRound]);

  const isHoleRecorded = useCallback((holeNumber) => {
    return recordedHoles.has(holeNumber);
  }, [recordedHoles]);

  const getCurrentPar = useCallback(() => {
    return customPars[currentHole] || null;
  }, [customPars, currentHole]);

  const getCurrentYardage = useCallback(() => {
    return customYardages[currentHole] || null;
  }, [customYardages, currentHole]);

  const needsHoleSetup = useCallback(() => {
    return getCurrentPar() === null || getCurrentYardage() === null;
  }, [getCurrentPar, getCurrentYardage]);

  const resetRound = useCallback(() => {
    setCurrentRound([]);
    setRecordedHoles(new Set());
    setCurrentHole(1);
    setCustomPars({});
    setCustomYardages({});
    setCourseName('');
  }, []);

  const loadCourseData = useCallback((course) => {
    setCustomPars(course.pars || {});
    setCustomYardages(course.yardages || {});
    setCourseName(course.name || '');
  }, []);

  return {
    currentRound,
    recordedHoles,
    currentHole,
    customPars,
    customYardages,
    courseName,
    setCurrentHole,
    setCustomPars,
    setCustomYardages,
    setCourseName,
    recordHole,
    unrecordHole,
    getHoleData,
    isHoleRecorded,
    getCurrentPar,
    getCurrentYardage,
    needsHoleSetup,
    resetRound,
    loadCourseData
  };
};
