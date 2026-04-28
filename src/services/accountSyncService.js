import { supabase } from '../lib/supabase';

const toNullableNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const nowIso = () => new Date().toISOString();

const normalizeIso = (value, fallback = null) => {
  if (!value) return fallback;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
};

export const normalizeCourseForSync = (course) => {
  const timestamp = nowIso();
  const createdAt = normalizeIso(course.createdAt, timestamp);
  const updatedAt = normalizeIso(course.updatedAt, createdAt);

  return {
    ...course,
    createdAt,
    updatedAt,
    syncedAt: course.syncedAt || null,
  };
};

const mapCourseForSync = (course, userId) => {
  const normalizedCourse = normalizeCourseForSync(course);

  return {
    user_id: userId,
    local_id: String(normalizedCourse.id),
    name: normalizedCourse.name || 'Unnamed Course',
    pars: normalizedCourse.pars || {},
    yardages: normalizedCourse.yardages || {},
    course_rating: toNullableNumber(normalizedCourse.courseRating),
    slope_rating: toNullableNumber(normalizedCourse.slopeRating),
    client_created_at: normalizedCourse.createdAt,
    client_updated_at: normalizedCourse.updatedAt,
    deleted_at: normalizedCourse.deletedAt || null,
  };
};

const mapCourseFromCloud = (course) => {
  const createdAt = normalizeIso(course.client_created_at || course.created_at, nowIso());
  const updatedAt = normalizeIso(course.client_updated_at || course.updated_at, createdAt);
  const syncedAt = normalizeIso(course.updated_at, nowIso());

  return {
    id: course.local_id || course.id,
    name: course.name || 'Unnamed Course',
    pars: course.pars || {},
    yardages: course.yardages || {},
    courseRating: toNullableNumber(course.course_rating),
    slopeRating: toNullableNumber(course.slope_rating),
    createdAt,
    updatedAt,
    syncedAt,
    deletedAt: course.deleted_at || null,
  };
};

export const normalizeRoundForSync = (round) => {
  const timestamp = nowIso();
  const createdAt = normalizeIso(round.createdAt, timestamp);
  const updatedAt = normalizeIso(round.updatedAt, createdAt);

  return {
    ...round,
    createdAt,
    updatedAt,
    syncedAt: round.syncedAt || null,
  };
};

const mapRoundForSync = (round, userId) => {
  const normalizedRound = normalizeRoundForSync(round);

  return {
    user_id: userId,
    local_id: String(normalizedRound.id),
    date: normalizedRound.date,
    course_name: normalizedRound.courseName || 'Unnamed Course',
    holes: Array.isArray(normalizedRound.holes) ? normalizedRound.holes : [],
    custom_pars: normalizedRound.customPars || {},
    custom_yardages: normalizedRound.customYardages || {},
    course_rating: toNullableNumber(normalizedRound.courseRating),
    slope_rating: toNullableNumber(normalizedRound.slopeRating),
    highlight: normalizedRound.highlight || '',
    focus_next_round: normalizedRound.focusNextRound || '',
    client_created_at: normalizedRound.createdAt,
    client_updated_at: normalizedRound.updatedAt,
    deleted_at: normalizedRound.deletedAt || null,
  };
};

const mapRoundFromCloud = (round) => {
  const createdAt = normalizeIso(round.client_created_at || round.created_at, nowIso());
  const updatedAt = normalizeIso(round.client_updated_at || round.updated_at, createdAt);
  const syncedAt = normalizeIso(round.updated_at, nowIso());

  return {
    id: round.local_id || round.id,
    date: round.date,
    courseName: round.course_name || 'Unnamed Course',
    holes: Array.isArray(round.holes) ? round.holes : [],
    customPars: round.custom_pars || {},
    customYardages: round.custom_yardages || {},
    courseRating: toNullableNumber(round.course_rating),
    slopeRating: toNullableNumber(round.slope_rating),
    highlight: round.highlight || '',
    focusNextRound: round.focus_next_round || '',
    createdAt,
    updatedAt,
    syncedAt,
    deletedAt: round.deleted_at || null,
  };
};

const getUpdatedTime = (record) => new Date(record.updatedAt || record.createdAt || 0).getTime();

export const mergeCourses = ({ localCourses = [], cloudCourses = [] }) => {
  const coursesById = new Map();

  [...localCourses, ...cloudCourses].forEach((course) => {
    if (!course?.id || course.deletedAt) return;

    const normalizedCourse = normalizeCourseForSync(course);
    const existingCourse = coursesById.get(normalizedCourse.id);

    if (!existingCourse || getUpdatedTime(normalizedCourse) >= getUpdatedTime(existingCourse)) {
      coursesById.set(normalizedCourse.id, normalizedCourse);
    }
  });

  return Array.from(coursesById.values()).sort((a, b) =>
    (a.name || '').localeCompare(b.name || '')
  );
};

export const syncCourseToCloud = async ({ user, course }) => {
  if (!supabase || !user?.id || !course?.id) return null;

  const { data, error } = await supabase
    .from('courses')
    .upsert(mapCourseForSync(course, user.id), { onConflict: 'user_id,local_id' })
    .select()
    .single();

  if (error) throw error;

  return data ? mapCourseFromCloud(data) : null;
};

export const syncCoursesToCloud = async ({ user, courses = [] }) => {
  if (!supabase || !user?.id || courses.length === 0) return [];

  const rows = courses.map((course) => mapCourseForSync(course, user.id));
  const { data, error } = await supabase
    .from('courses')
    .upsert(rows, { onConflict: 'user_id,local_id' })
    .select();

  if (error) throw error;

  return (data || []).map(mapCourseFromCloud);
};

export const loadCloudCourses = async ({ user }) => {
  if (!supabase || !user?.id) return [];

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('name', { ascending: true });

  if (error) throw error;

  return (data || []).map(mapCourseFromCloud);
};

export const deleteCourseFromCloud = async ({ user, courseId }) => {
  if (!supabase || !user?.id || !courseId) return;

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('user_id', user.id)
    .eq('local_id', String(courseId));

  if (error) throw error;
};

export const mergeRounds = ({ localRounds = [], cloudRounds = [] }) => {
  const roundsById = new Map();

  [...localRounds, ...cloudRounds].forEach((round) => {
    if (!round?.id || round.deletedAt) return;

    const normalizedRound = normalizeRoundForSync(round);
    const existingRound = roundsById.get(normalizedRound.id);

    if (!existingRound || getUpdatedTime(normalizedRound) >= getUpdatedTime(existingRound)) {
      roundsById.set(normalizedRound.id, normalizedRound);
    }
  });

  return Array.from(roundsById.values()).sort((a, b) => {
    const dateCompare = new Date(a.date || 0) - new Date(b.date || 0);
    if (dateCompare !== 0) return dateCompare;
    return getUpdatedTime(a) - getUpdatedTime(b);
  });
};

export const syncRoundToCloud = async ({ user, round }) => {
  if (!supabase || !user?.id || !round?.id) return null;

  const { data, error } = await supabase
    .from('rounds')
    .upsert(mapRoundForSync(round, user.id), { onConflict: 'user_id,local_id' })
    .select()
    .single();

  if (error) throw error;

  return data ? mapRoundFromCloud(data) : null;
};

export const syncRoundsToCloud = async ({ user, rounds = [] }) => {
  if (!supabase || !user?.id || rounds.length === 0) return [];

  const rows = rounds.map((round) => mapRoundForSync(round, user.id));
  const { data, error } = await supabase
    .from('rounds')
    .upsert(rows, { onConflict: 'user_id,local_id' })
    .select();

  if (error) throw error;

  return (data || []).map(mapRoundFromCloud);
};

export const loadCloudRounds = async ({ user }) => {
  if (!supabase || !user?.id) return [];

  const { data, error } = await supabase
    .from('rounds')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('date', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map(mapRoundFromCloud);
};

export const deleteRoundFromCloud = async ({ user, roundId }) => {
  if (!supabase || !user?.id || !roundId) return;

  const { error } = await supabase
    .from('rounds')
    .delete()
    .eq('user_id', user.id)
    .eq('local_id', String(roundId));

  if (error) throw error;
};
