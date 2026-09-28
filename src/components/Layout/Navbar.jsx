import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Volume2, VolumeX, Sparkles, ListTodo, CloudCheck, CloudOff } from 'lucide-react';
import { useApp } from '../../context/ThemeContext';
import { sounds } from '../../utils/soundEffects';

export const Navbar = ({ isConnected }) => {
  const { theme, toggleTheme, mode, switchMode, soundOn, toggleSound } = useApp();

  return (
    <header className="sticky top-4 z-40 max-w-4xl mx-auto px-4 w-full">
      <div className="glass-panel rounded-2xl px-5 py-3 shadow-lg shadow-pink-900/5 dark:shadow-purple-950/20 flex items-center justify-between transition-all duration-300">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 18, scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-200 via-purple-100 to-amber-100 dark:from-pink-950 dark:via-purple-900 dark:to-amber-950 flex items-center justify-center text-xl shadow-inner cursor-pointer"
            onClick={() => sounds.playRustle()}
          >
            🌸
          </motion.div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-800 dark:text-pink-100 flex items-center gap-1.5 leading-none">
              Bloom
              <span className="font-sans text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                Botanical
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <span>To-Dos & Notes</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Firestore DB
              </span>
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (Simple vs Magic) */}
        <div className="relative bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl flex items-center shadow-inner">
          <button
            onClick={() => switchMode('simple')}
            className={`relative z-10 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200 ${
              mode === 'simple'
                ? 'text-pink-900 dark:text-pink-100'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Simple</span>
          </button>

          <button
            onClick={() => switchMode('magic')}
            className={`relative z-10 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200 ${
              mode === 'magic'
                ? 'text-pink-900 dark:text-pink-100'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Magic</span>
          </button>

          {/* Animated active sliding pill */}
          <motion.div
            layoutId="mode-pill"
            className="absolute top-1 bottom-1 rounded-lg bg-white dark:bg-purple-950 shadow-sm"
            style={{
              left: mode === 'simple' ? '4px' : 'calc(50% + 1px)',
              right: mode === 'simple' ? 'calc(50% + 1px)' : '4px',
            }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          />
        </div>

        {/* Right Controls: Sound & Theme */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleSound}
            aria-label="Toggle Sound"
            title={soundOn ? 'Sound On' : 'Sound Muted'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-pink-100/50 dark:hover:bg-purple-900/40 transition-colors"
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-pink-100/50 dark:hover:bg-purple-900/40 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-purple-700" />
            )}
          </motion.button>
        </div>

      </div>
    </header>
  );
};
