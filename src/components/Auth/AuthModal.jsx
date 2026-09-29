import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, LogIn, UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleDemoLogin = () => {
    sounds.playComplete();
    const demoUser = {
      name: 'Rukayyah (Demo Evaluator)',
      email: 'demo@bloom.app',
      isDemo: true,
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sounds.playClick();
    const user = {
      name: name.trim() || email.split('@')[0] || 'Blooming Soul',
      email: email.trim(),
      isDemo: false,
    };
    onLoginSuccess(user);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 border border-pink-200/80 dark:border-purple-900/50"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 dark:from-pink-950 dark:via-purple-900 dark:to-amber-950 items-center justify-center text-2xl shadow-inner mb-3">
                🌸
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-slate-100">
                {isSignUp ? 'Create Your Bloom Account' : 'Welcome Back to Bloom'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your personal to-do sanctuary by HERSPEW
              </p>
            </div>

            {/* Quick Demo Access Box (Prominently Highlighted) */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-pink-100/80 via-purple-100/60 to-amber-100/60 dark:from-pink-950/60 dark:via-purple-950/60 dark:to-amber-950/40 border border-pink-200/80 dark:border-purple-800/50 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-pink-900 dark:text-pink-200 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Evaluator Demo</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
                No typing required! Tap below to jump straight in with demo credentials:
                <br />
                <span className="font-mono font-medium text-pink-700 dark:text-pink-300">demo@bloom.app • bloom123</span>
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 hover:brightness-105 transition"
              >
                <span>✨ One-Click Instant Demo Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center mb-5">
              <div className="flex-grow border-t border-slate-200/80 dark:border-slate-800/80"></div>
              <span className="flex-shrink mx-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Or sign in manually
              </span>
              <div className="flex-grow border-t border-slate-200/80 dark:border-slate-800/80"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g., Rukayyah"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-pink-200/60 dark:border-purple-900/50 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-pink-200/60 dark:border-purple-900/50 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-pink-200/60 dark:border-purple-900/50 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800 border border-pink-200/80 dark:border-purple-800 hover:bg-pink-50 dark:hover:bg-slate-700/60 transition shadow-sm mt-2"
              >
                {isSignUp ? 'Create My Account' : 'Sign In'}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsSignUp(!isSignUp);
                }}
                className="font-semibold text-pink-600 dark:text-pink-400 hover:underline ml-1"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
