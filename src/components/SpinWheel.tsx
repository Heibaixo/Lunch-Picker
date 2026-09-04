import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LunchOption } from '../types';
import { sound } from '../utils/audio';

interface SpinWheelProps {
  options: LunchOption[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinComplete: (winner: LunchOption) => void;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({
  options,
  isSpinning,
  onSpinStart,
  onSpinComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pointerWobble, setPointerWobble] = useState(0);

  // Wheel physics state
  const rotationRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastPegIndexRef = useRef<number>(-1);

  const activeOptions = options.filter((o) => o.enabled);

  // Draw the wheel onto canvas
  const drawWheel = useCallback((currentRotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = width / 2 - 14;

    ctx.clearRect(0, 0, width, height);

    if (activeOptions.length === 0) {
      // Empty state
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#E2E8F0';
      ctx.fill();
      ctx.fillStyle = '#64748B';
      ctx.font = '600 24px "Quicksand", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Please enable at least 1 option', centerX, centerY);
      ctx.restore();
      return;
    }

    const sliceAngle = (2 * Math.PI) / activeOptions.length;

    // Draw slices
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);

    activeOptions.forEach((option, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, outerRadius + 14, startAngle, endAngle);
      ctx.closePath();

      // Vibrant slice fill
      ctx.fillStyle = option.color;
      ctx.fill();

      // Clean divider line
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();

      // Draw bold uppercase text inside slice
      ctx.save();
      const midAngle = startAngle + sliceAngle / 2;
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const textRadius = outerRadius - 16;
      const fontSize = activeOptions.length > 8 ? 14 : activeOptions.length > 6 ? 17 : 20;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1;

      const label = option.name.toUpperCase();
      const displayLabel = label.length > 13 ? label.slice(0, 12) + '…' : label;
      const fullText = option.emoji ? `${option.emoji}  ${displayLabel}` : displayLabel;
      ctx.fillText(fullText, textRadius, 0);

      ctx.restore();
      ctx.restore();
    });

    ctx.restore(); // Restore translate(centerX, centerY)

    // Center geometric hub
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 36, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;
    ctx.fill();

    // Inner dark geometric dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 11, 0, 2 * Math.PI);
    ctx.fillStyle = '#2D3436';
    ctx.fill();
    ctx.restore();
  }, [activeOptions]);

  // Handle high-DPI scaling and drawing on mount / resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const updateCanvasResolution = () => {
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, 420);
      const dpr = window.devicePixelRatio || 1;

      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      drawWheel(rotationRef.current);
    };

    updateCanvasResolution();
    window.addEventListener('resize', updateCanvasResolution);
    return () => window.removeEventListener('resize', updateCanvasResolution);
  }, [drawWheel]);

  // Redraw when options change
  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Spin execution with realistic deceleration easing
  const spin = () => {
    if (isSpinning || activeOptions.length === 0) return;

    onSpinStart();

    const startRotation = rotationRef.current;
    // 5 to 8 full rotations + randomized target offset
    const randomSpins = 5 + Math.random() * 3;
    const totalAddedRadians = randomSpins * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const targetRotation = startRotation + totalAddedRadians;

    const duration = 4400; // ms
    const startTime = performance.now();
    lastPegIndexRef.current = -1;

    // Quintic ease-out function: fast launch, suspenseful slow crawl at the end
    const easeOutQuint = (t: number): number => {
      return 1 - Math.pow(1 - t, 5);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuint(progress);

      const currentAngle = startRotation + totalAddedRadians * easedProgress;
      rotationRef.current = currentAngle;
      drawWheel(currentAngle);

      // Check peg crossing for physical flapper tick
      const sliceAngle = (2 * Math.PI) / activeOptions.length;
      // Pointer is at the top: angle 3pi/2 (270 deg)
      // Local angle under the pointer:
      const pointerScreenAngle = (3 * Math.PI) / 2;
      const normalizedWheelAngle = ((pointerScreenAngle - currentAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const currentPegIndex = Math.floor(normalizedWheelAngle / sliceAngle);

      if (currentPegIndex !== lastPegIndexRef.current) {
        lastPegIndexRef.current = currentPegIndex;
        sound.playTick();

        // Flapper flick animation: flick downwards in spin direction
        const flickIntensity = Math.max(3, (1 - progress) * 16);
        setPointerWobble(flickIntensity);
        setTimeout(() => setPointerWobble(0), 70);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        animFrameRef.current = null;
        setPointerWobble(0);

        // Compute exact winner
        const finalNormalizedAngle = ((pointerScreenAngle - targetRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor(finalNormalizedAngle / sliceAngle);
        const winner = activeOptions[winningIndex % activeOptions.length];

        sound.playFanfare();
        onSpinComplete(winner);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Wheel Wrapper */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center my-3 select-none"
      >
        {/* Soft Floor Shadow */}
        <div className="absolute -bottom-3 sm:-bottom-4 w-[90%] sm:w-[420px] h-4 bg-black/5 blur-xl rounded-[100%] pointer-events-none" />

        {/* Top Pointer Indicator - Geometric Charcoal Triangle */}
        <div
          id="wheel-pointer-indicator"
          className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-transform duration-75"
          style={{
            transform: `translateX(-50%) rotate(${pointerWobble}deg)`,
            transformOrigin: 'top center',
          }}
        >
          <div className="w-0 h-0 border-l-[22px] sm:border-l-[28px] border-l-transparent border-r-[22px] sm:border-r-[28px] border-r-transparent border-t-[40px] sm:border-t-[48px] border-t-[#2D3436] filter drop-shadow-lg" />
        </div>

        {/* Canvas Element with White Rim and Deep Shadow */}
        <div className="relative rounded-full border-[12px] sm:border-[16px] border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden bg-white">
          <canvas
            id="lunch-wheel-canvas"
            ref={canvasRef}
            className="rounded-full cursor-pointer touch-none block"
            onClick={spin}
          />
        </div>
      </div>

      {/* Main Spin Action Button */}
      <div className="mt-5 sm:mt-6 w-full flex flex-col items-center px-4">
        <button
          id="spin-lunch-button"
          type="button"
          onClick={spin}
          disabled={isSpinning || activeOptions.length === 0}
          className={`
            w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white py-5 sm:py-6 rounded-[2rem]
            text-2xl sm:text-3xl font-black uppercase tracking-[0.2em]
            shadow-[0_12px_0_#D64545] transition-all transform active:translate-y-2 active:shadow-[0_4px_0_#D64545]
            flex items-center justify-center gap-3
            ${isSpinning 
              ? 'translate-y-2 shadow-[0_4px_0_#D64545] opacity-90 cursor-not-allowed' 
              : activeOptions.length === 0
                ? 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed'
                : 'hover:brightness-105 active:brightness-95 cursor-pointer'
            }
          `}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN!'}
        </button>

        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7F8C8D] mt-3">
          {isSpinning 
            ? 'Deciding your feast...' 
            : 'Tap button or wheel to spin'}
        </p>
      </div>
    </div>
  );
};
