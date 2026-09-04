import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Utensils, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { LunchOption, PresetMenu } from '../types';
import { PRESETS, VIBRANT_PALETTE } from '../data/defaults';

interface OptionManagerProps {
  options: LunchOption[];
  onToggleOption: (id: string) => void;
  onAddOption: (name: string, emoji: string) => void;
  onRemoveOption: (id: string) => void;
  onApplyPreset: (preset: PresetMenu) => void;
  onResetDefaults: () => void;
  isSpinning: boolean;
}

const QUICK_EMOJIS = ['🍜', '🍗', '🥗', '🍱', '🍔', '🍕', '🥪', '🍣', '🌶️', '🥑', '🥟', '🍲'];

export const OptionManager: React.FC<OptionManagerProps> = ({
  options,
  onToggleOption,
  onAddOption,
  onRemoveOption,
  onApplyPreset,
  onResetDefaults,
  isSpinning,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🍱');

  const activeCount = options.filter((o) => o.enabled).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newOptionName.trim();
    if (!trimmed) return;
    onAddOption(trimmed, selectedEmoji);
    setNewOptionName('');
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#2D3436]/5 shadow-sm p-4 sm:p-5 transition-all">
      {/* Header Toggle */}
      <button
        id="toggle-options-manager"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center text-[#FF6B6B]">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-sm uppercase tracking-wider text-[#2D3436] group-hover:text-[#FF6B6B] transition-colors">
              Lunch Options
            </span>
            <span className="ml-2 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B]">
              {activeCount} of {options.length} on wheel
            </span>
          </div>
        </div>
        <div className="text-[#7F8C8D] group-hover:text-[#2D3436]">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-[#2D3436]/5 flex flex-col gap-4">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7F8C8D] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF6B6B]" />
                Quick Presets
              </span>
              <button
                id="reset-options-button"
                type="button"
                onClick={onResetDefaults}
                disabled={isSpinning}
                className="text-[10px] font-bold uppercase tracking-wider text-[#7F8C8D] hover:text-[#FF6B6B] flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset to default choices"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`preset-${preset.id}`}
                  type="button"
                  disabled={isSpinning}
                  onClick={() => onApplyPreset(preset)}
                  className="px-3 py-2.5 text-left rounded-2xl border border-[#2D3436]/10 hover:border-[#FF6B6B] bg-white hover:bg-[#FF6B6B]/5 transition-all text-xs font-bold text-[#2D3436] flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-base">{preset.icon}</span>
                  <span className="truncate">{preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Item */}
          <form onSubmit={handleAdd} className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7F8C8D]">
              Add Custom Choice
            </span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={selectedEmoji}
                  onChange={(e) => setSelectedEmoji(e.target.value)}
                  className="w-12 h-11 text-lg bg-white rounded-xl border border-[#2D3436]/10 text-center cursor-pointer appearance-none pl-2.5 pr-1 focus:ring-2 focus:ring-[#FF6B6B]/30 focus:outline-none"
                  aria-label="Pick food emoji"
                >
                  {QUICK_EMOJIS.map((emoji) => (
                    <option key={emoji} value={emoji}>
                      {emoji}
                    </option>
                  ))}
                </select>
              </div>

              <input
                id="new-option-input"
                type="text"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                placeholder="e.g., Thai Green Curry"
                maxLength={25}
                disabled={isSpinning}
                className="flex-1 h-11 px-3.5 text-sm bg-white rounded-xl border border-[#2D3436]/10 focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 focus:outline-none transition-all placeholder:text-[#7F8C8D]/60"
              />

              <button
                id="add-option-button"
                type="submit"
                disabled={!newOptionName.trim() || isSpinning}
                className="h-11 px-4 bg-[#FF6B6B] hover:bg-[#FF5252] disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl text-sm font-black transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                title="Add option"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Current Options List */}
          <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7F8C8D] mb-1">
              Active Wheel Items ({activeCount})
            </span>

            {options.map((option) => (
              <div
                key={option.id}
                id={`option-row-${option.id}`}
                className={`
                  flex items-center justify-between p-2.5 rounded-2xl border transition-all text-sm
                  ${option.enabled 
                    ? 'bg-white border-[#2D3436]/5 text-[#2D3436] shadow-xs' 
                    : 'bg-slate-100/50 border-dashed border-slate-200 text-[#7F8C8D] opacity-60'
                  }
                `}
              >
                <label className="flex items-center gap-2.5 cursor-pointer select-none flex-1 truncate">
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={() => onToggleOption(option.id)}
                    disabled={isSpinning}
                    className="w-4 h-4 rounded text-[#FF6B6B] focus:ring-[#FF6B6B] border-slate-300 cursor-pointer accent-[#FF6B6B]"
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-base">{option.emoji}</span>
                  <span className={`truncate ${option.enabled ? 'font-black uppercase tracking-tight' : 'line-through'}`}>
                    {option.name}
                  </span>
                </label>

                {options.length > 2 && (
                  <button
                    id={`delete-option-${option.id}`}
                    type="button"
                    onClick={() => onRemoveOption(option.id)}
                    disabled={isSpinning}
                    className="p-1.5 text-slate-300 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors ml-2 cursor-pointer"
                    title={`Remove ${option.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
