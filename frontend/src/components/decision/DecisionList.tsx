// ============================================
// COMPONENTS - Decision: DecisionList
// ============================================
// Lista de decisões disponíveis

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DecisionCard } from './DecisionCard';
import { Button } from '../ui/Button';
import type { EventDecision } from '../../types';

interface DecisionListProps {
  decisions: EventDecision[];
  onSubmit: (decision: EventDecision) => void;
  isLoading?: boolean;
}

export const DecisionList: React.FC<DecisionListProps> = ({
  decisions,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<EventDecision | null>(null);
  const [confirmMode, setConfirmMode] = useState(false);

  const handleSelect = (decision: EventDecision) => {
    if (isLoading) return;
    setSelectedDecision(decision);
    setConfirmMode(true);
  };

  const handleConfirm = () => {
    if (selectedDecision) {
      onSubmit(selectedDecision);
    }
  };

  const handleCancel = () => {
    setSelectedDecision(null);
    setConfirmMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-300 font-star-wars">
          {confirmMode ? 'Confirme sua escolha' : 'O que você fará?'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {confirmMode 
            ? 'Esta decisão não pode ser desfeita' 
            : 'Cada escolha molda seu destino'}
        </p>
      </div>

      {/* Decision cards */}
      <div className="space-y-4 ml-4">
        {decisions.map((decision, index) => (
          <DecisionCard
            key={decision.id}
            decision={decision}
            index={index}
            onSelect={handleSelect}
            isDisabled={isLoading || (confirmMode && selectedDecision?.id !== decision.id)}
            isSelected={selectedDecision?.id === decision.id}
          />
        ))}
      </div>

      {/* Confirmation buttons */}
      {confirmMode && selectedDecision && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 pt-4"
        >
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Voltar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            Confirmar Decisão
          </Button>
        </motion.div>
      )}

      {/* Warning for key decisions */}
      {confirmMode && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-gray-500 italic"
        >
          "Lembre-se: suas escolhas definem quem você se tornará."
        </motion.p>
      )}
    </div>
  );
};
