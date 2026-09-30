import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookPlus, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

const ICONS = ['🌸', '🪻', '🌼', '🌿', '📖', '✨', '☕', '🌙'];

const FLOWERS = [
  { id: 'rose', label: 'Rose', icon: '🌸' },
  { id: 'lavender', label: 'Lavender', icon: '🪻' },
  { id: 'daffodil', label: 'Daffodil', icon: '🌼' },
];

export const NewNotebookModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🌸');
  const [flower, setFlower] = useState('rose');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playComplete();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      icon,
      flower,
    });

    setTitle('');
    setDescription('');
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
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200/90 dark:border-purple-900/60 z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-200 to-rose-200 dark:from-pink-950 dark:to-purple-900 flex items-center justify-center text-xl shadow-inner">
                {icon}
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-pink-100">
                  Create Sanctuary Notebook
                </h3>
                <p className="text-xs text-slate-400">A themed sanctuary for your reflections</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Notebook Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Morning Musings, Gratitude Diary..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-pink-200/60 dark:border-purple-900/50 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Description / Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g., Daily thoughts, gentle morning intentions"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-pink-200/60 dark:border-purple-900/50 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Notebook Motif Icon
                </label>
                <div className="flex gap-2 flex-wrap">
                  {ICONS.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => { sounds.playRustle(); setIcon(ic); }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                        icon === ic
                          ? 'bg-pink-200 dark:bg-pink-900 scale-110 shadow-sm ring-2 ring-pink-400'
                          : 'bg-white/50 dark:bg-slate-900/40 hover:bg-white/80'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flower Theme */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Floral Accent
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FLOWERS.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => { sounds.playRustle(); setFlower(f.id); }}
                      className={`py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        flower === f.id
                          ? 'bg-pink-100 dark:bg-purple-950 text-pink-900 dark:text-pink-100 ring-2 ring-pink-400/50'
                          : 'bg-white/50 dark:bg-slate-900/40 text-slate-500'
                      }`}
                    >
                      <span>{f.icon}</span>
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-md shadow-pink-500/25 flex items-center gap-1.5 hover:brightness-105 transition"
                >
                  <BookPlus className="w-3.5 h-3.5" />
                  <span>Create Notebook</span>
                </motion.button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
