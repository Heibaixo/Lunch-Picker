import confetti from 'canvas-confetti';

export function fireCelebrationConfetti(colors: string[] = ['#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D', '#A06CD5']) {
  // Center burst
  confetti({
    particleCount: 90,
    spread: 80,
    origin: { y: 0.6 },
    colors,
    ticks: 250,
    gravity: 0.9,
    scalar: 1.1,
  });

  // Left cannon burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
  }, 180);

  // Right cannon burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 320);

  // Star shapes burst
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.5 },
      shapes: ['star'],
      colors: ['#FFD93D', '#FFA447', '#FF6B6B'],
      scalar: 1.3,
    });
  }, 480);
}
