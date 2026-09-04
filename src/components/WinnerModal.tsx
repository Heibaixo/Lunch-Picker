import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, Check, Sparkles, X } from 'lucide-react';
import { LunchOption } from '../types';
import { WINNER_QUOTES } from '../data/defaults';
import { fireCelebrationConfetti } from '../utils/confetti';

interface WinnerModalProps {
  winner: LunchOption | null;
  onClose: () => void;
  onSpinAgain: () => void;
  onExcludeAndSpinAgain?: (option: LunchOption) => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  onClose,
  onSpinAgain,
  onExcludeAndSpinAgain,
}) => {
  // Fire confetti bursts when modal mounts with a winner
  useEffect(() => {
    if (winner) {
      fireCelebrationConfetti();
    }
  }, [winner]);

  // Pick a randomized cheerful quote
  const quote = useMemo(() => {
    return WINNER_QUOTES[Math.floor(Math.random() * WINNER_QUOTES.length)];
  }, [winner]);

  if (!winner) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2D3436]/60 backdrop-blur-xs">
        <motion.div
          id="winner-announcement-card"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 15 }}
          transition={{ type: 'spring', stiffness: 380, damping: 25 }}
          className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#FF6B6B] text-center overflow-hidden"
        >
          {/* Subtle background celebratory glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-15 pointer-events-none blur-3xl"
            style={{ backgroundColor: winner.color }}
          />

          {/* Close button */}
          <button
            id="close-winner-modal"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#7F8C8D] hover:text-[#2D3436] p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black tracking-[0.2em] uppercase bg-[#FF6B6B]/10 text-[#FF6B6B] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B6B] animate-pulse" />
            <span>Lunch Verdict</span>
          </div>

          {/* Giant Emoji with Bouncy Entrance */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.15, stiffness: 400, damping: 15 }}
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto my-2 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl shadow-sm border border-[#2D3436]/10"
            style={{ backgroundColor: `${winner.color}25` }}
          >
            <span>{winner.emoji || '🍽️'}</span>
          </motion.div>

          <h3 className="text-[#7F8C8D] text-xs font-black uppercase tracking-[0.2em] mt-2">
            You are having
          </h3>

          {/* Big Winner Name */}
          <motion.h2
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            id="winner-name-display"
            className="text-3xl sm:text-4xl font-black text-[#2D3436] tracking-tight uppercase my-2"
          >
            {winner.name}
          </motion.h2>

          <p className="text-[#7F8C8D] text-sm font-medium px-4 mb-6 italic">
            "{quote}"
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {/* Primary Spin Again */}
            <button
              id="spin-again-button"
              type="button"
              onClick={onSpinAgain}
              className="w-full py-4 px-6 rounded-2xl font-black text-base uppercase tracking-[0.15em] text-white bg-[#FF6B6B] hover:bg-[#FF5252] shadow-[0_8px_0_#D64545] active:translate-y-1 active:shadow-[0_2px_0_#D64545] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCw className="w-5 h-5" />
              <span>Spin Again</span>
            </button>

            {/* Accept & Enjoy */}
            <button
              id="accept-winner-button"
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-[#2D3436] bg-[#2D3436]/5 hover:bg-[#2D3436]/10 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Sounds Delicious! Let's Eat</span>
            </button>

            {/* Exclude and spin if not feeling it */}
            {onExcludeAndSpinAgain && (
              <button
                id="exclude-and-spin-button"
                type="button"
                onClick={() => onExcludeAndSpinAgain(winner)}
                className="text-xs font-bold text-[#7F8C8D] hover:text-[#FF6B6B] transition-colors pt-1 cursor-pointer"
              >
                Not feeling {winner.name}? Exclude & spin again
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
