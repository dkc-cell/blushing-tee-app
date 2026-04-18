/**
 * Generate a unique ID using timestamp + random string
 * This ensures uniqueness even if multiple items are created in the same millisecond
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get current local date as YYYY-MM-DD string
 */
export const getLocalDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a date string for display
 */
export const formatDateForDisplay = (dateString, options = {}) => {
  const defaultOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { ...defaultOptions, ...options });
};
const calcThreePuttPercentage = (holes = []) => {
  const holesWithPutts = holes.filter(h => Number.isFinite(h?.putts));
  if (holesWithPutts.length === 0) return 0;

  const threePuttHoles = holesWithPutts.filter(h => h.putts >= 3).length;
  return (threePuttHoles / holesWithPutts.length) * 100;
};

/**
 * Calculate statistics from an array of holes
 */
export const calcStats = (holes) => {
  if (!holes || holes.length === 0) return null;
  
  const totalScore = holes.reduce((sum, h) => sum + h.total, 0);
  const totalPar = holes.reduce((sum, h) => sum + h.par, 0);
  const totalPutts = holes.reduce((sum, h) => sum + (Number.isFinite(h?.putts) ? h.putts : 0), 0);
  const fairwayHoles = holes.filter(h => h.par > 3);
  const fairwaysHit = holes.filter(h => h.fairwayHit && h.par > 3).length;
  
  const par3Holes = holes.filter(h => h.par === 3);
  const par4Holes = holes.filter(h => h.par === 4);
  const par5Holes = holes.filter(h => h.par === 5);
  
  const calcAvg = (arr) => arr.length > 0 
    ? (arr.reduce((sum, h) => sum + h.total, 0) / arr.length).toFixed(1) 
    : 'N/A';
 
  const threePuttPercentage = Math.round(calcThreePuttPercentage(holes));
  const avgToParPerHole = ((totalScore - totalPar) / holes.length).toFixed(2);

  return {
    totalScore,
    totalPar,
    scoreToPar: totalScore - totalPar,
    avgToParPerHole,


    totalPutts,
    fairwayPct: fairwayHoles.length > 0 ? Math.round((fairwaysHit / fairwayHoles.length) * 100) : 0,
    fairwaysHit,
    totalFairways: fairwayHoles.length,
    avgPar3: calcAvg(par3Holes),
    avgPar4: calcAvg(par4Holes),
    avgPar5: calcAvg(par5Holes),
    threePuttPercentage,
  };
};

/**
 * Calculate overall stats from all rounds
 */
export const calcOverallStats = (rounds) => {
  if (!rounds || rounds.length === 0) {
    return {
      fairwaysHit: 0,
      threePuttPercentage: 0,
      unofficialHandicap: null
    };
  }

  const allHoles = rounds.flatMap(r => r.holes || []);
  const fairwayHoles = allHoles.filter(h => h.par > 3);
  const fairwaysHitCount = allHoles.filter(h => h.fairwayHit && h.par > 3).length;

  const threePuttPercentage = Math.round(calcThreePuttPercentage(allHoles));

  // ⭐ Handicap calculation
  const eligibleRounds = rounds.filter(r =>
    r.courseRating &&
    r.slopeRating &&
    r.holes &&
    r.holes.length > 0
  );

  const differentials = eligibleRounds.map(r => {
    const score = r.holes.reduce((sum, h) => sum + (Number(h.total) || 0), 0);
    return (score - r.courseRating) * 113 / r.slopeRating;
  });

  const unofficialHandicap = differentials.length
    ? (differentials.reduce((a, b) => a + b, 0) / differentials.length).toFixed(1)
    : null;

  return {
    fairwaysHit: fairwayHoles.length > 0
      ? Math.round((fairwaysHitCount / fairwayHoles.length) * 100)
      : 0,
    threePuttPercentage,
    unofficialHandicap
  };
};

/**
 * Export round summary data to CSV format
 */
export const exportToCSV = (rounds, startDate = null, endDate = null) => {
  let filteredRounds = rounds;

  if (startDate || endDate) {
    filteredRounds = rounds.filter((r) => {
      const roundDate = new Date(r.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      end.setHours(23, 59, 59, 999);
      return roundDate >= start && roundDate <= end;
    });
  }

  if (!filteredRounds.length) {
    return null;
  }

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const getPenaltyCount = (hole) => {
    const water = hole.penalties?.water ? 1 : 0;
    const lost = hole.penalties?.lost ? 1 : 0;
    const ob = hole.penalties?.ob ? 1 : 0;
    return water + lost + ob;
  };

  const getParBucketAverage = (holes, parValue) => {
    const matching = holes.filter((hole) => Number(hole.par) === parValue);
    if (!matching.length) return '';
    const total = matching.reduce((sum, hole) => sum + (Number(hole.total) || 0), 0);
    return (total / matching.length).toFixed(2);
  };

  const rows = filteredRounds.map((round) => {
    const holes = Array.isArray(round.holes) ? round.holes : [];

    const holesPlayed = holes.length;

    const totalScore = holes.reduce((sum, hole) => sum + (Number(hole.total) || 0), 0);
    const totalPar = holes.reduce((sum, hole) => sum + (Number(hole.par) || 0), 0);
    const scoreToPar = totalScore - totalPar;

    const totalPutts = holes.reduce((sum, hole) => sum + (Number(hole.putts) || 0), 0);
    const avgPuttsPerHole = holesPlayed ? (totalPutts / holesPlayed).toFixed(2) : '';

    const fairwayOpportunities = holes.filter((hole) => Number(hole.par) > 3).length;
    const fairwaysHit = holes.filter(
      (hole) => Number(hole.par) > 3 && hole.fairwayHit
    ).length;
    const fairwayPct = fairwayOpportunities
      ? ((fairwaysHit / fairwayOpportunities) * 100).toFixed(1)
      : '';

    const birdies = holes.filter(
      (hole) => (Number(hole.total) || 0) - (Number(hole.par) || 0) === -1
    ).length;

    const pars = holes.filter(
      (hole) => (Number(hole.total) || 0) - (Number(hole.par) || 0) === 0
    ).length;

    const bogeys = holes.filter(
      (hole) => (Number(hole.total) || 0) - (Number(hole.par) || 0) === 1
    ).length;

    const doubleBogeyPlus = holes.filter(
      (hole) => (Number(hole.total) || 0) - (Number(hole.par) || 0) >= 2
    ).length;

    const totalPenalties = holes.reduce((sum, hole) => sum + getPenaltyCount(hole), 0);

    const notes = holes
      .map((hole) => hole.notes?.trim())
      .filter(Boolean)
      .join(' | ');

    return [
      escapeCSV(round.date || ''),
      escapeCSV(round.courseName || 'Unnamed Course'),
      holesPlayed,

      totalScore, 
      totalPar,
      scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar,

      totalPutts,
      avgPuttsPerHole,

      fairwaysHit,
      fairwayOpportunities,
      fairwayPct ? `${fairwayPct}%` : '',

      birdies,
      pars,
      bogeys,
      doubleBogeyPlus, // 👈 remove triple, combine into this

      totalPenalties,

      getParBucketAverage(holes, 3),
      getParBucketAverage(holes, 4),
      getParBucketAverage(holes, 5),

      escapeCSV(round.unofficialHandicap ?? ''),
      escapeCSV(notes),
    ].join(',');
      });

  const header = [
    'Date',
  'Course',
  'Holes Played',
  'Score',
  'Par',
  'Score to Par',

  'Putts',
  'Avg Putts / Hole',

  'Fairways Hit',
  'Fairways Total',
  'Fairways %',

  'Birdies',
  'Pars',
  'Bogeys',
  'Doubles+',

  'Penalties',

  'Avg Par 3',
  'Avg Par 4',
  'Avg Par 5',

  'Unofficial Handicap',
  'Notes',
  ].join(',');

  return [header, ...rows].join('\n');
};

/**
 * Download CSV content as a file
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ✅ Backup export (JSON)
export const downloadBackupJSON = (backupData, fileName) => {
  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: 'application/json',
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

// ✅ Backup import (JSON)
export const readBackupFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        if (
          !parsed ||
          parsed.app !== 'Blushing Birdie' ||
          !Array.isArray(parsed.rounds) ||
          !Array.isArray(parsed.courses)
        ) {
          reject(new Error('Invalid backup file.'));
          return;
        }

        resolve(parsed);
      } catch (error) {
        reject(new Error('Invalid backup file.'));
      }
    };

    reader.onerror = () => reject(new Error('Unable to read file.'));
    reader.readAsText(file);
  });

/**
 * Format score relative to par
 */
export const formatScoreToPar = (score, par) => {
  const diff = score - par;
  if (diff > 0) return `+${diff}`;
  if (diff === 0) return 'E';
  return diff.toString();
};
