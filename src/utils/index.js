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

/**
 * Calculate statistics from an array of holes
 */
export const calcStats = (holes) => {
  if (!holes || holes.length === 0) return null;
  
  const totalScore = holes.reduce((sum, h) => sum + h.total, 0);
  const totalPar = holes.reduce((sum, h) => sum + h.par, 0);
  const totalPutts = holes.reduce((sum, h) => sum + h.putts, 0);
  const fairwayHoles = holes.filter(h => h.par > 3);
  const fairwaysHit = holes.filter(h => h.fairwayHit && h.par > 3).length;
  
  const par3Holes = holes.filter(h => h.par === 3);
  const par4Holes = holes.filter(h => h.par === 4);
  const par5Holes = holes.filter(h => h.par === 5);
  
  const calcAvg = (arr) => arr.length > 0 
    ? (arr.reduce((sum, h) => sum + h.total, 0) / arr.length).toFixed(1) 
    : 'N/A';
  
  return {
    totalScore,
    totalPar,
    scoreToPar: totalScore - totalPar,
    avgScore: (totalScore / holes.length).toFixed(1),
    avgPutts: (totalPutts / holes.length).toFixed(1),
    totalPutts,
    fairwayPct: fairwayHoles.length > 0 ? Math.round((fairwaysHit / fairwayHoles.length) * 100) : 0,
    fairwaysHit,
    totalFairways: fairwayHoles.length,
    avgPar3: calcAvg(par3Holes),
    avgPar4: calcAvg(par4Holes),
    avgPar5: calcAvg(par5Holes)
  };
};

/**
 * Calculate overall stats from all rounds
 */
export const calcOverallStats = (rounds) => {
  if (!rounds || rounds.length === 0) {
    return {
      fairwaysHit: 0,
      avgPutts: 0
    };
  }
  
  const allHoles = rounds.flatMap(r => r.holes);
  const fairwayHoles = allHoles.filter(h => h.par > 3);
  const fairwaysHitCount = allHoles.filter(h => h.fairwayHit && h.par > 3).length;
  
  return {
    fairwaysHit: fairwayHoles.length > 0 
      ? Math.round((fairwaysHitCount / fairwayHoles.length) * 100) 
      : 0,
    avgPutts: allHoles.length > 0 
      ? (allHoles.reduce((sum, h) => sum + h.putts, 0) / allHoles.length).toFixed(1) 
      : 0
  };
};

/**
 * Export rounds data to CSV format
 */
export const exportToCSV = (rounds, startDate = null, endDate = null) => {
  let filteredRounds = rounds;
  
  if (startDate || endDate) {
    filteredRounds = rounds.filter(r => {
      const roundDate = new Date(r.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      end.setHours(23, 59, 59, 999);
      return roundDate >= start && roundDate <= end;
    });
  }
  
  if (filteredRounds.length === 0) {
    return null;
  }
  
  const csvContent = [
    ['Date', 'Course', 'Hole', 'Par', 'Yardage', 'Score', 'Drive', 'Approaches', 'Chips', 'Putts', 'Penalties', 'Fairway Hit', 'Notes'].join(','),
    ...filteredRounds.flatMap(round =>
      round.holes.map(hole => [
        round.date,
        `"${round.courseName || 'Unnamed Course'}"`,
        hole.hole,
        hole.par,
        hole.yardage,
        hole.total,
        hole.drive,
        hole.approaches,
        hole.chips,
        hole.putts,
        hole.penalties.water + hole.penalties.lost + hole.penalties.ob,
        hole.fairwayHit ? 'Yes' : 'No',
        `"${hole.notes || ''}"`
      ].join(','))
    )
  ].join('\n');
  
  return csvContent;
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

/**
 * Format score relative to par
 */
export const formatScoreToPar = (score, par) => {
  const diff = score - par;
  if (diff > 0) return `+${diff}`;
  if (diff === 0) return 'E';
  return diff.toString();
};
