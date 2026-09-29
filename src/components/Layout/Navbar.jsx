import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Volume2, VolumeX, Sparkles, ListTodo, Calendar, Heart } from 'lucide-react';
import { useApp } from '../../context/ThemeContext';
import { sounds } from '../../utils/soundEffects';

export const Navbar = ({ isConnected }) => {
  const { theme, toggleTheme, mode, switchMode, soundOn, toggleSound } = useApp();

  return (
    <header className="sticky top-4 z-40 max-w-4xl mx-auto px-4 w-full">
      <div className="glass-panel rounded-2xl px-5 py-3 shadow-lg shadow-pink-900/5 dark:shadow-purple-950/20 flex flex-wrap items-center justify-between gap-3 transition-all duration-300">
        
        {/* Brand with HERSPEW creator badge */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 18, scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 dark:from-pink-950 dark:via-purple-900 dark:to-amber-950 flex items-center justify-center text-xl shadow-inner cursor-pointer"
            onClick={() => sounds.playRustle()}
          >
            🌸
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-800 dark:text-pink-100 leading-none">
                Bloom
              </h1>
              <span className="font-sans text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-900 dark:to-purple-900 text-pink-900 dark:text-pink-100 shadow-xs">
                by HERSPEW
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span>To-Dos & Notes</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Cloud DB
              </span>
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (Simple vs Magic vs Calendar) */}
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

          <button
            onClick={() => switchMode('calendar')}
            className={`relative z-10 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200 ${
              mode === 'calendar'
                ? 'text-pink-900 dark:text-pink-100'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            <span>Calendar</span>
          </button>
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
