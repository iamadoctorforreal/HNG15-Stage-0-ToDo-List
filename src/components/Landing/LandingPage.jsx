import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Volume2, 
  Cloud, 
  Heart,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/ThemeContext';
import { sounds } from '../../utils/soundEffects';

export const LandingPage = ({ onOpenAuth, onInstantDemo }) => {
  const { theme, toggleTheme, soundOn, toggleSound } = useApp();

  return (
    <div className="min-h-screen relative z-10 flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => sounds.playRustle()} 
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 dark:from-pink-950 dark:via-purple-900 dark:to-amber-950 flex items-center justify-center text-xl shadow-inner cursor-pointer"
          >
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-800 dark:text-pink-100">
                Bloom
              </span>
              <span className="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-900 dark:to-purple-900 text-pink-900 dark:text-pink-100">
                by HERSPEW
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">To-Dos & Notes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 transition"
            title="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 transition"
            title={soundOn ? 'Sound On' : 'Sound Muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-pink-500" /> : <span className="text-xs">🔇</span>}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenAuth();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-white/90 dark:hover:bg-slate-800 transition"
          >
            Sign In
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              sounds.playComplete();
              onInstantDemo();
            }}
            className="hidden sm:flex px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-md shadow-pink-500/25 items-center gap-1.5 hover:brightness-105 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Demo</span>
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Callouts */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100/80 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200 text-xs font-semibold">
              <span>🌸</span>
              <span>Crafted for pretty, productive minds</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 dark:text-pink-50 tracking-tight leading-[1.15]">
              Where your daily thoughts <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                bloom into calm.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              A serene to-do and personal reflections sanctuary designed by <strong className="text-slate-800 dark:text-white font-semibold">HERSPEW</strong>. 
              Featuring Apple-clean aesthetics, living floating flowers with natural rustling sounds, 3D swipeable magic cards, and real-time cloud persistence.
            </p>

            {/* Hero Demo Credentials & Quick Test Box */}
            <div className="p-5 rounded-3xl glass-card border border-pink-200/80 dark:border-purple-900/60 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-pink-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  Instant Evaluator Access
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-100 dark:bg-purple-950 text-pink-800 dark:text-pink-200">
                  Ready to test
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white/60 dark:bg-slate-900/60 p-3 rounded-2xl border border-pink-100 dark:border-purple-900/40">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Demo Email</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">demo@bloom.app</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Password</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">bloom123</span>
                </div>
              </div>

              {/* Instant Launch Button */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.playComplete();
                    onInstantDemo();
                  }}
                  className="flex-1 py-3 px-5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-md shadow-pink-500/30 flex items-center justify-center gap-2 hover:brightness-105 transition"
                >
                  <span>✨ Enter Bloom With Demo Account</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenAuth();
                  }}
                  className="py-3 px-5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-white/80 dark:hover:bg-slate-800 transition"
                >
                  Create Own Account
                </button>
              </div>
            </div>

            {/* Mini Trust Highlights */}
            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Google Firestore Cloud DB</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-purple-500" />
                <span>Audio Rustle & Chimes</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-pink-500" />
                <span>Swipeable Mobile Cards</span>
              </span>
            </div>

          </div>

          {/* Right Column: Interactive Live App Mockup / Card Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-sm glass-card rounded-3xl p-6 shadow-2xl border border-pink-200/90 dark:border-purple-900/60 relative overflow-hidden"
            >
              {/* Card Header Preview */}
              <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-purple-900/40">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪻</span>
                  <span className="font-serif font-bold text-sm text-slate-800 dark:text-slate-100">
                    Live Sanctuary Preview
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/60">
                  Interactive
                </span>
              </div>

              {/* Your Exact Live Tasks Preview */}
              <div className="space-y-2.5 py-4 max-h-[320px] overflow-y-auto pr-1">
                {/* Task 1: Buy from Temu */}
                <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-pink-200 dark:border-purple-800 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full border-2 border-pink-400 dark:border-purple-500"></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>Buy from Temu</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">High</span>
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        "I just need to order already"
                      </p>
                    </div>
                  </div>
                  <span className="text-xs">🌸</span>
                </div>

                {/* Task 2: Review HNG Stage 0 */}
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-pink-100 dark:border-purple-900/40 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center text-white text-[10px]">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 line-through">
                        Review HNG 15 Stage 0 🌸
                      </p>
                      <p className="text-[10px] text-slate-400">Verified live Vercel URL & GitHub</p>
                    </div>
                  </div>
                  <span className="text-xs">🌸</span>
                </div>

                {/* Task 3: Pick Fresh Lavender */}
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-pink-100 dark:border-purple-900/40 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full border-2 border-purple-300 dark:border-purple-700"></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Pick fresh lavender 🪻
                      </p>
                      <p className="text-[10px] text-slate-400">Place bundle on nightstand</p>
                    </div>
                  </div>
                  <span className="text-xs">🪻</span>
                </div>

                {/* Task 4: Hydrate and stretch */}
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-pink-100 dark:border-purple-900/40 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center text-white text-[10px]">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 line-through">
                        Hydrate in warm sunlight 🌼
                      </p>
                      <p className="text-[10px] text-slate-400">10 mins deep breathing done</p>
                    </div>
                  </div>
                  <span className="text-xs">🌼</span>
                </div>
              </div>

              {/* Mode Switcher Preview in Mockup */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    sounds.playComplete();
                    onInstantDemo();
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-pink-700 dark:text-pink-300 bg-pink-100/80 dark:bg-purple-950/80 hover:bg-pink-200 transition flex items-center justify-center gap-1.5"
                >
                  <span>Click to Explore Entire App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          </div>

        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <div className="glass-card rounded-3xl p-6 shadow-sm border border-pink-100 dark:border-purple-950">
            <span className="text-3xl block mb-3">📋</span>
            <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100">
              Simple Checklist Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Apple-clean checklist with expandable notes, real-time search, filters for rose, lavender, and daffodils, and joyful petal celebrations.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 shadow-sm border border-pink-100 dark:border-purple-950">
            <span className="text-3xl block mb-3">✨</span>
            <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100">
              Magic 3D Card Deck
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Swipe left or right to glide between tasks with whoosh sounds. Swipe up to mark complete with harmonic chimes.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 shadow-sm border border-pink-100 dark:border-purple-950">
            <span className="text-3xl block mb-3">📅</span>
            <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100">
              Calendar & Analytics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Visual completion rate rings, completed vs active bar charts, and an interactive monthly calendar with task markers.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 w-full text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/40 dark:border-slate-800/40">
        Crafted with 🌸 by <span className="font-bold text-pink-600 dark:text-pink-400">HERSPEW</span> • Bloom To-Do & Notes
      </footer>

    </div>
  );
};
