import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';
import { generateId } from '../utils';

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
        // Ensure all rounds have unique IDs (migration for old data)
        const roundsWithIds = parsedRounds.map(round => ({
          ...round,
          id: round.id || generateId()
        }));
        setRounds(roundsWithIds);
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

  const addRound = useCallback((roundData) => {
    const newRound = {
      ...roundData,
      id: generateId()
    };
    setRounds(prev => [...prev, newRound]);
    return newRound;
  }, []);

  const updateRound = useCallback((roundId, updates) => {
    setRounds(prev => prev.map(round => 
      round.id === roundId ? { ...round, ...updates } : round
    ));
  }, []);

  const deleteRound = useCallback((roundId) => {
    setRounds(prev => prev.filter(round => round.id !== roundId));
  }, []);

  const getRoundById = useCallback((roundId) => {
    return rounds.find(round => round.id === roundId);
  }, [rounds]);

  return {
    rounds,
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
        setCourses(parsedCourses);
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

  const addCourse = useCallback((courseData) => {
    const newCourse = {
      ...courseData,
      id: generateId()
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  }, []);

  const updateCourse = useCallback((courseId, updates) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, ...updates } : course
    ));
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
    setCourses,
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
