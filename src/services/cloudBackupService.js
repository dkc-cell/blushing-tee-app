import { supabase } from '../lib/supabase';

const toNullableNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const mapCourseForBackup = (course, userId) => ({
  user_id: userId,
  local_id: String(course.id),
  name: course.name || 'Unnamed Course',
  pars: course.pars || {},
  yardages: course.yardages || {},
  course_rating: toNullableNumber(course.courseRating),
  slope_rating: toNullableNumber(course.slopeRating),
});

const mapRoundForBackup = (round, userId) => ({
  user_id: userId,
  local_id: String(round.id),
  date: round.date,
  course_name: round.courseName || 'Unnamed Course',
  holes: Array.isArray(round.holes) ? round.holes : [],
  custom_pars: round.customPars || {},
  custom_yardages: round.customYardages || {},
  course_rating: toNullableNumber(round.courseRating),
  slope_rating: toNullableNumber(round.slopeRating),
  highlight: round.highlight || '',
  focus_next_round: round.focusNextRound || '',
});

const mapCourseFromCloud = (course) => ({
  id: course.local_id || course.id,
  name: course.name || 'Unnamed Course',
  pars: course.pars || {},
  yardages: course.yardages || {},
  courseRating: toNullableNumber(course.course_rating),
  slopeRating: toNullableNumber(course.slope_rating),
});

const mapRoundFromCloud = (round) => ({
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
});

export const backupLocalDataToCloud = async ({ user, rounds, courses }) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  if (!user?.id) {
    throw new Error('Please sign in before backing up your data.');
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email || null,
  });

  if (profileError) throw profileError;

  const courseRows = courses.map((course) => mapCourseForBackup(course, user.id));
  const roundRows = rounds.map((round) => mapRoundForBackup(round, user.id));

  if (courseRows.length > 0) {
    const { error } = await supabase
      .from('courses')
      .upsert(courseRows, { onConflict: 'user_id,local_id' });

    if (error) throw error;
  }

  if (roundRows.length > 0) {
    const { error } = await supabase
      .from('rounds')
      .upsert(roundRows, { onConflict: 'user_id,local_id' });

    if (error) throw error;
  }

  return {
    roundsBackedUp: roundRows.length,
    coursesBackedUp: courseRows.length,
  };
};

export const restoreCloudData = async ({ user }) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  if (!user?.id) {
    throw new Error('Please sign in before restoring your data.');
  }

  const { data: courseRows, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (coursesError) throw coursesError;

  const { data: roundRows, error: roundsError } = await supabase
    .from('rounds')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })
    .order('created_at', { ascending: true });

  if (roundsError) throw roundsError;

  return {
    courses: (courseRows || []).map(mapCourseFromCloud),
    rounds: (roundRows || []).map(mapRoundFromCloud),
  };
};
