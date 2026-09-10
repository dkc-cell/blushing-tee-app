import { useCallback, useState } from 'react';

export const ACTIVE_ROUND_KEY = 'blushingBirdieActiveRound';

const readActiveRound = () => {
  try {
    const raw = localStorage.getItem(ACTIVE_ROUND_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error reading active round:', error);
    return null;
  }
};

export default function useActiveRound() {
  const [activeRound, setActiveRoundState] = useState(readActiveRound);

  const saveActiveRound = useCallback((round) => {
    try {
      localStorage.setItem(ACTIVE_ROUND_KEY, JSON.stringify(round));
      setActiveRoundState(round);
    } catch (error) {
      console.error('Error saving active round:', error);
    }
  }, []);

  const clearActiveRound = useCallback(() => {
    try {
      localStorage.removeItem(ACTIVE_ROUND_KEY);
      setActiveRoundState(null);
    } catch (error) {
      console.error('Error clearing active round:', error);
    }
  }, []);

  return { activeRound, saveActiveRound, clearActiveRound };
}
