let _ac = null;

function getCtx() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  return _ac;
}

// Call synchronously inside a user-gesture handler to unlock WebKit audio.
export function unlockAudio() {
  try {
    const ac = getCtx();
    if (ac.state === 'suspended') ac.resume();
  } catch {}
}

export function playAchievementSound() {
  try {
    const ac = getCtx();
    if (ac.state === 'suspended') ac.resume();
    // Three-note ascending arpeggio: C5 → E5 → G5
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc  = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const start = ac.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.38);

      osc.start(start);
      osc.stop(start + 0.4);
    });
  } catch {}
}
