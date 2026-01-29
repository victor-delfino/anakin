// ============================================
// HOOKS - useNarrative
// ============================================

import { useCallback } from 'react';
import { useAnakinStore, selectNarrative } from '../stores';

export function useNarrative() {
  const narrative = useAnakinStore(selectNarrative);
  const lastDecisionResult = useAnakinStore(state => state.lastDecisionResult);
  const setNarrative = useAnakinStore(state => state.setNarrative);

  const clearNarrative = useCallback(() => {
    setNarrative('');
  }, [setNarrative]);

  const getNarrativeVariant = useCallback(() => {
    if (!lastDecisionResult) return 'default';
    
    if (lastDecisionResult.progression.triggeredFall) {
      return 'fall';
    }
    
    if (lastDecisionResult.progression.triggeredRedemption) {
      return 'redemption';
    }
    
    if (lastDecisionResult.progression.moralShift === 'stable') {
      return 'conflict';
    }
    
    return 'default';
  }, [lastDecisionResult]);

  return {
    narrative,
    lastDecisionResult,
    clearNarrative,
    getNarrativeVariant,
  };
}
