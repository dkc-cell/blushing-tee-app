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
  if (holesWithPutts.length === 0) return null;

  const threePuttHoles = holesWithPutts.filter(h => h.putts >= 3).length;
  return (threePuttHoles / holesWithPutts.length) * 100;
};

export const hasKnownPar = (hole) => [3, 4, 5].includes(hole?.par);
export const getRoundPar = (holes = []) => holes.length && holes.every(hasKnownPar)
  ? holes.reduce((sum, h) => sum + h.par, 0) : null;

/**
 * Calculate statistics from an array of holes
 */
export const calcStats = (holes) => {
  if (!holes || holes.length === 0) return null;
  
  const totalScore = holes.reduce((sum, h) => sum + h.total, 0);
  const totalPar = getRoundPar(holes);
  const knownParHoles = holes.filter(hasKnownPar);
  const totalPutts = holes.reduce((sum, h) => sum + (Number.isFinite(h?.putts) ? h.putts : 0), 0);
  const fairwayHoles = holes.filter(h => h.par > 3 && typeof h.fairwayHit === 'boolean');
  const fairwaysHit = holes.filter(h => h.fairwayHit && h.par > 3).length;
  
  const par3Holes = holes.filter(h => h.par === 3);
  const par3GreenHoles = par3Holes.filter(h => typeof h.greenInRegulation === 'boolean');
  const par4Holes = holes.filter(h => h.par === 4);
  const par5Holes = holes.filter(h => h.par === 5);
  
  const calcAvg = (arr) => arr.length > 0 
    ? (arr.reduce((sum, h) => sum + h.total, 0) / arr.length).toFixed(1) 
    : 'N/A';
 
  const threePuttPercentage = calcThreePuttPercentage(holes) == null ? null : Math.round(calcThreePuttPercentage(holes));
  const avgToParPerHole = knownParHoles.length ? (knownParHoles.reduce((sum, h) => sum + h.total - h.par, 0) / knownParHoles.length).toFixed(2) : null;

  return {
    totalScore,
    totalPar,
    scoreToPar: totalPar == null ? null : totalScore - totalPar,
    holeCount: holes.length,
    knownParCount: knownParHoles.length,
    par3GreenPct: par3GreenHoles.length ? Math.round(par3GreenHoles.filter(h => h.greenInRegulation).length / par3GreenHoles.length * 100) : null,
    avgToParPerHole,


    totalPutts: holes.some(h => Number.isFinite(h.putts)) ? totalPutts : null,
    fairwayPct: fairwayHoles.length > 0 ? Math.round((fairwaysHit / fairwayHoles.length) * 100) : null,
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
      threePuttPercentage: 0
    };
  }

  const allHoles = rounds.flatMap(r => r.holes || []);
  const fairwayHoles = allHoles.filter(h => h.par > 3 && typeof h.fairwayHit === 'boolean');
  const fairwaysHitCount = allHoles.filter(h => h.fairwayHit && h.par > 3).length;

  const threePuttPercentage = calcThreePuttPercentage(allHoles) == null ? null : Math.round(calcThreePuttPercentage(allHoles));

  return {
    fairwaysHit: fairwayHoles.length > 0
      ? Math.round((fairwaysHitCount / fairwayHoles.length) * 100)
      : null,
    threePuttPercentage
  };
};

/**
 * Export round summary data to CSV format
 */
export const exportToCSV = (rounds, startDate = null, endDate = null) => {
  const filtered = rounds.filter(round => {
    const date = String(round.date || '').slice(0, 10);
    return (!startDate || date >= startDate) && (!endDate || date <= endDate);
  });
  if (!filtered.length) return null;
  const escape = value => {
    let text = value == null ? '' : String(value);
    // Treat user-entered spreadsheet text as text rather than formulas.
    if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const percent = (count, total) => total ? (100 * count / total).toFixed(1) + '%' : '';
  const header = ['Date', 'Course', 'Holes Played', 'Score', 'Par', 'Score to Par',
    'Putts (Recorded Holes)', 'Holes with Putts Recorded', 'Avg Putts per Recorded Hole',
    '3+ Putts %', 'Fairways Hit', 'Fairways Recorded', 'Fairways %', 'Par 3 Greens %',
    'Eagles or Better', 'Birdies', 'Pars', 'Bogeys', 'Double Bogey or Worse'];
  const rows = filtered.map(round => {
    const holes = Array.isArray(round.holes) ? round.holes : [];
    const total = holes.reduce((sum, h) => sum + (Number(h.total) || 0), 0);
    const par = getRoundPar(holes);
    const putts = holes.filter(h => Number.isFinite(h.putts));
    const puttTotal = putts.reduce((sum, h) => sum + h.putts, 0);
    const fairways = holes.filter(h => h.par > 3 && typeof h.fairwayHit === 'boolean');
    const greens = holes.filter(h => h.par === 3 && typeof h.greenInRegulation === 'boolean');
    const knownPar = holes.filter(hasKnownPar);
    const count = predicate => knownPar.length ? knownPar.filter(h => predicate(h.total - h.par)).length : '';
    return [escape(round.date || ''), escape(round.courseName || 'Unnamed Course'), holes.length,
      total, par ?? '', par == null ? '' : total - par,
      putts.length ? puttTotal : '', putts.length || '', putts.length ? (puttTotal / putts.length).toFixed(2) : '',
      percent(putts.filter(h => h.putts >= 3).length, putts.length),
      fairways.length ? fairways.filter(h => h.fairwayHit).length : '', fairways.length || '',
      percent(fairways.filter(h => h.fairwayHit).length, fairways.length),
      percent(greens.filter(h => h.greenInRegulation).length, greens.length),
      count(d => d <= -2), count(d => d === -1), count(d => d === 0), count(d => d === 1), count(d => d >= 2),
    ].join(',');
  });
  return [header.join(','), ...rows].join('\n');
};

/** One row per recorded hole; legacy unknown details stay blank. */
export const exportHolesToCSV = (rounds, startDate = null, endDate = null) => {
  const text = value => {
    let v = value == null ? '' : String(value);
    if (/^\s*[=+@-]/.test(v)) v = "'" + v;
    return '"' + v.replace(/"/g, '""') + '"';
  };
  const rows = rounds.filter(r => {
    const date = String(r.date || '').slice(0, 10);
    return (!startDate || date >= startDate) && (!endDate || date <= endDate);
  }).flatMap(r => [...(r.holes || [])].sort((a, b) => a.hole - b.hole).map(h => {
    const par = hasKnownPar(h) ? h.par : null;
    return [text(r.id), text(r.date), text(r.courseName || 'Unnamed Course'), h.hole ?? '',
      par ?? '', h.total ?? '', par == null ? '' : h.total - par,
      h.yardage || r.customYardages?.[h.hole] || '', Number.isFinite(h.putts) ? h.putts : '',
      par > 3 && typeof h.fairwayHit === 'boolean' ? (h.fairwayHit ? 'Yes' : 'No') : '',
      par === 3 && typeof h.greenInRegulation === 'boolean' ? (h.greenInRegulation ? 'Yes' : 'No') : '',
    ].join(',');
  }));
  return rows.length ? ['Round ID,Date,Course,Hole,Par,Score,Score to Par,Yardage,Putts,Fairway Hit,Par 3 Green Hit', ...rows].join('\n') : null;
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
          !Array.isArray(parsed.courses) ||
          parsed.rounds.some(round => !round || typeof round !== 'object' || !Array.isArray(round.holes) || round.holes.some(hole => !hole || !Number.isFinite(hole.total))) ||
          parsed.courses.some(course => !course || typeof course.name !== 'string')
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
  if (par == null || !Number.isFinite(par)) return '—';
  const diff = score - par;
  if (diff > 0) return `+${diff}`;
  if (diff === 0) return 'E';
  return diff.toString();
};
