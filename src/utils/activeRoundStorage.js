export const ACTIVE_ROUND_STORAGE_KEY = 'blushingBirdieActiveRound';

export const EMPTY_HOLE_DRAFT = {
  hole: 1,
  drive: '',
  approaches: 0,
  chips: 0,
  putts: 0,
  penalties: { water: false, lost: false, ob: false },
  notes: '',
};

export const loadActiveRound = () => {
  try {
    const saved = localStorage.getItem(ACTIVE_ROUND_STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      currentHole: Number(parsed.currentHole) || 1,
      currentRound: Array.isArray(parsed.currentRound) ? parsed.currentRound : [],
      recordedHoles: Array.isArray(parsed.recordedHoles) ? parsed.recordedHoles : [],
      customPars: parsed.customPars && typeof parsed.customPars === 'object' ? parsed.customPars : {},
      customYardages: parsed.customYardages && typeof parsed.customYardages === 'object' ? parsed.customYardages : {},
      courseName: typeof parsed.courseName === 'string' ? parsed.courseName : '',
      holeDraft: parsed.holeDraft && typeof parsed.holeDraft === 'object' ? parsed.holeDraft : null,
    };
  } catch (error) {
    console.error('Error loading active round:', error);
    return null;
  }
};

export const saveActiveRound = (activeRound) => {
  try {
    const currentHole = Number(activeRound?.currentHole) || 1;
    let existingDraft = null;

    const saved = localStorage.getItem(ACTIVE_ROUND_STORAGE_KEY);
    if (saved) {
      const existing = JSON.parse(saved);
      existingDraft = existing?.holeDraft && typeof existing.holeDraft === 'object'
        ? existing.holeDraft
        : null;
    }

    const incomingDraft = activeRound?.holeDraft && typeof activeRound.holeDraft === 'object'
      ? activeRound.holeDraft
      : null;

    const existingDraftIsCurrent = Number(existingDraft?.hole) === currentHole;
    const existingDraftIsNewer =
      existingDraftIsCurrent &&
      Number(existingDraft?.updatedAt || 0) > Number(incomingDraft?.updatedAt || 0);

    let holeDraft = existingDraftIsNewer ? existingDraft : incomingDraft;

    if (Number(holeDraft?.hole) !== currentHole) {
      holeDraft = null;
    }

    localStorage.setItem(
      ACTIVE_ROUND_STORAGE_KEY,
      JSON.stringify({
        ...activeRound,
        currentHole,
        holeDraft,
      })
    );
  } catch (error) {
    console.error('Error saving active round:', error);
  }
};

export const clearActiveRound = () => {
  try {
    localStorage.removeItem(ACTIVE_ROUND_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing active round:', error);
  }
};

export const isHoleDraftMeaningful = (draft) => Boolean(
  draft && !draft.cleared && (
    draft.drive ||
    Number(draft.approaches) > 0 ||
    Number(draft.chips) > 0 ||
    Number(draft.putts) > 0 ||
    draft.penalties?.water ||
    draft.penalties?.lost ||
    draft.penalties?.ob ||
    (typeof draft.notes === 'string' && draft.notes.trim())
  )
);
