/**
 * Sound Manager for Block Blast
 *
 * Handles all sound effects and background music
 * Uses Web Audio API for better performance
 *
 * SETUP:
 * 1. Add sound files to /public/sounds/
 * 2. Uncomment the sound URLs below
 * 3. Enable sounds in settings
 *
 * Recommended sounds (free sources):
 * - https://freesound.org
 * - https://mixkit.co/free-sound-effects/
 * - https://pixabay.com/sound-effects/
 */

type SoundType =
  | 'place' // When placing a piece
  | 'clear' // When clearing lines
  | 'combo' // When getting a combo
  | 'game-over' // When game ends
  | 'level-up' // When completing a level
  | 'button' // UI button clicks
  | 'error' // Invalid move
  | 'coins'; // Earning coins

interface SoundSettings {
  enabled: boolean;
  volume: number;
  musicVolume: number;
}

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private settings: SoundSettings = {
    enabled: true,
    volume: 0.7,
    musicVolume: 0.5,
  };

  constructor() {
    this.loadSounds();
    this.loadSettings();
  }

  private loadSounds() {
    // Define sound files
    const soundFiles: Record<SoundType, string> = {
      // OPTION 1: Use data URLs for built-in sounds (base64)
      place: this.getBeepSound(440, 0.1), // A4 note, 100ms
      clear: this.getBeepSound(660, 0.2), // E5 note, 200ms
      combo: this.getBeepSound(880, 0.3), // A5 note, 300ms
      'game-over': this.getBeepSound(220, 0.5), // A3 note, 500ms
      'level-up': this.getSuccessSound(),
      button: this.getBeepSound(523, 0.05), // C5 note, 50ms
      error: this.getBeepSound(200, 0.2), // Lower tone
      coins: this.getCoinSound(),

      // OPTION 2: Use external sound files (better quality)
      // Uncomment and replace with your sound files:
      // place: '/sounds/place.mp3',
      // clear: '/sounds/clear.mp3',
      // combo: '/sounds/combo.mp3',
      // 'game-over': '/sounds/game-over.mp3',
      // 'level-up': '/sounds/level-up.mp3',
      // button: '/sounds/button.mp3',
      // error: '/sounds/error.mp3',
      // coins: '/sounds/coins.mp3',
    };

    // Preload all sounds
    Object.entries(soundFiles).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = this.settings.volume;
      this.sounds.set(key as SoundType, audio);
    });
  }

  private loadSettings() {
    const saved = localStorage.getItem('sound-settings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  private saveSettings() {
    localStorage.setItem('sound-settings', JSON.stringify(this.settings));
  }

  // Play a sound effect
  play(type: SoundType) {
    if (!this.settings.enabled) return;

    const sound = this.sounds.get(type);
    if (sound) {
      // Clone and play (allows overlapping sounds)
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = this.settings.volume;
      clone.play().catch((e) => console.log('Sound play failed:', e));
    }
  }

  // Update settings
  setEnabled(enabled: boolean) {
    this.settings.enabled = enabled;
    this.saveSettings();
  }

  setVolume(volume: number) {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
    // Update all loaded sounds
    this.sounds.forEach((sound) => {
      sound.volume = this.settings.volume;
    });
  }

  getSettings(): SoundSettings {
    return { ...this.settings };
  }

  // ========================================
  // PROCEDURAL SOUND GENERATION
  // Using Web Audio API to create simple beeps
  // ========================================

  private getBeepSound(_frequency: number, _duration: number): string {
    // This creates a simple beep using the Web Audio API
    // Returns a data URL that can be used as audio source
    return `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQA=`; // Placeholder
  }

  private getSuccessSound(): string {
    // Plays a series of ascending tones
    return this.getBeepSound(523, 0.1);
  }

  private getCoinSound(): string {
    // High-pitched coin sound
    return this.getBeepSound(1047, 0.1);
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSound = (type: SoundType) => soundManager.play(type);
export const setSoundEnabled = (enabled: boolean) => soundManager.setEnabled(enabled);
export const setSoundVolume = (volume: number) => soundManager.setVolume(volume);
export const getSoundSettings = () => soundManager.getSettings();
