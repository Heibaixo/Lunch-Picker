import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LunchOption, PresetMenu } from './types';
import { INITIAL_OPTIONS, VIBRANT_PALETTE } from './data/defaults';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { SpinWheel } from './components/SpinWheel';
import { WinnerModal } from './components/WinnerModal';
import { OptionManager } from './components/OptionManager';
import { RotateCw, Sparkles, Trophy } from 'lucide-react';

const STORAGE_KEY = 'lunch_picker_options_v1';
const SOUND_KEY = 'lunch_picker_sound_enabled';

export default function App() {
  // Load options from localStorage or defaults
  const [options, setOptions] = useState<LunchOption[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Fallback to initial
      }
    }
    return INITIAL_OPTIONS;
  });

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SOUND_KEY);
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [latestWinner, setLatestWinner] = useState<LunchOption | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const spinWheelRef = useRef<{ triggerSpin?: () => void }>({});

  // Sync options to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
    } catch {
      // Storage quota or private mode
    }
  }, [options]);

  // Sync sound setting
  useEffect(() => {
    sound.setEnabled(soundEnabled);
    try {
      localStorage.setItem(SOUND_KEY, String(soundEnabled));
    } catch {
      // Storage error
    }
  }, [soundEnabled]);

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleSpinStart = () => {
    setIsSpinning(true);
    setShowWinnerModal(false);
  };

  const handleSpinComplete = useCallback((winner: LunchOption) => {
    setIsSpinning(false);
    setLatestWinner(winner);
    setShowWinnerModal(true);
  }, []);

  const handleToggleOption = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, enabled: !opt.enabled } : opt))
    );
  };

  const handleAddOption = (name: string, emoji: string) => {
    const color = VIBRANT_PALETTE[options.length % VIBRANT_PALETTE.length];
    const newOption: LunchOption = {
      id: Date.now().toString(),
      name,
      emoji,
      color,
      enabled: true,
    };
    setOptions((prev) => [...prev, newOption]);
  };

  const handleRemoveOption = (id: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  const handleApplyPreset = (preset: PresetMenu) => {
    const newOptions: LunchOption[] = preset.options.map((item, idx) => ({
      id: `${preset.id}-${idx}-${Date.now()}`,
      name: item.name,
      emoji: item.emoji,
      color: item.color,
      enabled: true,
    }));
    setOptions(newOptions);
  };

  const handleResetDefaults = () => {
    setOptions(INITIAL_OPTIONS);
  };

  // When clicking "Spin Again" from the winner modal
  const handleSpinAgainFromModal = () => {
    setShowWinnerModal(false);
    // Short delay to let the modal animate out before spinning
    setTimeout(() => {
      const spinBtn = document.getElementById('spin-lunch-button');
      if (spinBtn) {
        spinBtn.click();
      }
    }, 120);
  };

  // Exclude option and spin again
  const handleExcludeAndSpinAgain = (excluded: LunchOption) => {
    // Disable option
    setOptions((prev) =>
      prev.map((opt) => (opt.id === excluded.id ? { ...opt, enabled: false } : opt))
    );
    setShowWinnerModal(false);
    setTimeout(() => {
      const spinBtn = document.getElementById('spin-lunch-button');
      if (spinBtn) {
        spinBtn.click();
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#2D3436] flex flex-col justify-between py-4 px-3 sm:px-6 selection:bg-[#FF6B6B]/20">
      {/* Top Section */}
      <div className="w-full flex flex-col items-center">
        <Header soundEnabled={soundEnabled} onToggleSound={handleToggleSound} />

        {/* Previous winner card from Geometric Balance design */}
        {latestWinner && !showWinnerModal && (
          <div
            id="latest-winner-banner"
            onClick={() => setShowWinnerModal(true)}
            className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl p-4 sm:p-5 border border-[#2D3436]/5 text-center shadow-sm my-2 cursor-pointer hover:bg-white hover:border-[#2D3436]/10 transition-all group"
          >
            <p className="text-[#7F8C8D] font-bold uppercase tracking-widest text-xs mb-1">
              Last result
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4D96FF] tracking-tight uppercase flex items-center justify-center gap-2">
              <span>{latestWinner.name}</span>
              <span>{latestWinner.emoji}</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#7F8C8D] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              Tap to view celebration
            </p>
          </div>
        )}

        {/* Main Spinning Wheel Centerpiece */}
        <main className="w-full mt-1 flex flex-col items-center">
          <SpinWheel
            options={options}
            isSpinning={isSpinning}
            onSpinStart={handleSpinStart}
            onSpinComplete={handleSpinComplete}
          />

          {/* Quick Option Manager drawer on same page */}
          <OptionManager
            options={options}
            onToggleOption={handleToggleOption}
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
            onApplyPreset={handleApplyPreset}
            onResetDefaults={handleResetDefaults}
            isSpinning={isSpinning}
          />
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center mt-8 pt-4 pb-3 border-t border-[#2D3436]/5 text-xs text-[#7F8C8D]">
        <div className="flex justify-between items-center w-full px-2">
          <span className="font-bold text-[10px] uppercase tracking-widest opacity-60">Lunch Roulette</span>
          <span className="font-bold text-[10px] uppercase tracking-widest opacity-60">Geometric Balance</span>
        </div>
      </footer>

      {/* Winner Celebration Modal */}
      {showWinnerModal && (
        <WinnerModal
          winner={latestWinner}
          onClose={() => setShowWinnerModal(false)}
          onSpinAgain={handleSpinAgainFromModal}
          onExcludeAndSpinAgain={handleExcludeAndSpinAgain}
        />
      )}
    </div>
  );
}
