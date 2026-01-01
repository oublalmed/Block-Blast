import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Vibrate, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSoundSettings, setSoundEnabled, setSoundVolume } from '../../utils/soundManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  soundEnabled: boolean;
  soundVolume: number;
  hapticsEnabled: boolean;
  theme: 'dark' | 'light';
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    soundVolume: 0.7,
    hapticsEnabled: true,
    theme: 'dark',
  });

  useEffect(() => {
    // Load settings
    const soundSettings = getSoundSettings();
    const saved = localStorage.getItem('game-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings({
        soundEnabled: soundSettings.enabled,
        soundVolume: soundSettings.volume,
        hapticsEnabled: parsed.hapticsEnabled ?? true,
        theme: parsed.theme ?? 'dark',
      });
    }
  }, [isOpen]);

  const saveSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    // Save to localStorage
    localStorage.setItem('game-settings', JSON.stringify(updated));

    // Apply sound settings
    if (newSettings.soundEnabled !== undefined) {
      setSoundEnabled(newSettings.soundEnabled);
    }
    if (newSettings.soundVolume !== undefined) {
      setSoundVolume(newSettings.soundVolume);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="
              bg-gradient-to-br from-slate-800 to-slate-900
              rounded-3xl
              p-6
              max-w-md w-full
              shadow-2xl
              border-2 border-white/10
            "
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-2xl">Settings</h2>
              <button
                onClick={onClose}
                className="
                  w-10 h-10
                  bg-slate-700/50
                  rounded-xl
                  flex items-center justify-center
                  text-white
                  hover:bg-slate-600/50
                  active:scale-95
                  transition-all
                "
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <div className="text-white font-semibold">Sound Effects</div>
                    <div className="text-sm text-white/60">
                      {settings.soundEnabled ? 'On' : 'Off'}
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => saveSettings({ soundEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Volume Slider */}
              {settings.soundEnabled && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Volume</span>
                    <span className="text-white/60">
                      {Math.round(settings.soundVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.soundVolume}
                    onChange={(e) =>
                      saveSettings({ soundVolume: parseFloat(e.target.value) })
                    }
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}

              {/* Haptic Feedback */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Vibrate className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-semibold">Haptic Feedback</div>
                    <div className="text-sm text-white/60">
                      {settings.hapticsEnabled ? 'On' : 'Off'}
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.hapticsEnabled}
                    onChange={(e) => saveSettings({ hapticsEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  )}
                  <div>
                    <div className="text-white font-semibold">Theme</div>
                    <div className="text-sm text-white/60">
                      {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    saveSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
                  }
                  className="
                    px-4 py-2
                    bg-slate-700/50
                    rounded-xl
                    text-white
                    hover:bg-slate-600/50
                    active:scale-95
                    transition-all
                    font-semibold
                  "
                >
                  {settings.theme === 'dark' ? 'Dark' : 'Light'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-center text-sm text-white/40">
                Block Blast v1.0.0
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Custom slider styles
const sliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4ade80;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.5);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4ade80;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.5);
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = sliderStyles;
  document.head.appendChild(style);
}
