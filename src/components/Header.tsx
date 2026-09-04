import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({ soundEnabled, onToggleSound }) => {
  return (
    <header className="relative w-full max-w-xl mx-auto flex flex-col items-center text-center pt-6 sm:pt-10 pb-4 px-4">
      {/* Sound toggle button anchored top-right */}
      <div className="absolute top-4 right-2 sm:right-0">
        <button
          id="toggle-sound-btn"
          type="button"
          onClick={onToggleSound}
          className={`
            w-9 h-9 rounded-full border border-[#2D3436]/10 flex items-center justify-center transition-all shadow-xs
            ${soundEnabled 
              ? 'bg-white text-[#2D3436] hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B]' 
              : 'bg-white/60 text-[#7F8C8D] hover:bg-white'
            }
          `}
          title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Pill Badge */}
      <div className="inline-block px-4 py-1 bg-[#FF6B6B]/10 rounded-full mb-3">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B6B]">
          Lunch Roulette v1.0
        </p>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-[#2D3436] leading-none mb-2.5">
        LUNCH PICKER
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm md:text-base font-medium text-[#7F8C8D] uppercase tracking-[0.25em]">
        What are we eating today?
      </p>
    </header>
  );
};
