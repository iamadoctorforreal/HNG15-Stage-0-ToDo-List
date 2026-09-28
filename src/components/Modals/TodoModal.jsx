import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

const FLOWER_OPTIONS = [
  { id: 'rose', name: 'Rose', icon: '🌸', color: 'border-pink-300 bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800' },
  { id: 'lavender', name: 'Lavender', icon: '🪻', color: 'border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' },
  { id: 'daffodil', name: 'Daffodil', icon: '🌼', color: 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
];

export const TodoModal = ({ isOpen, onClose, onSubmit, initialTodo = null }) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [flower, setFlower] = useState('rose');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTodo) {
      setTitle(initialTodo.title || '');
      setNote(initialTodo.note || '');
      setFlower(initialTodo.flower || 'rose');
      setPriority(initialTodo.priority || 'medium');
    } else {
      setTitle('');
      setNote('');
      setFlower('rose');
      setPriority('medium');
    }
  }, [initialTodo, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    sounds.playClick();
    try {
      await onSubmit({
        title: title.trim(),
        note: note.trim(),
        flower,
        priority,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
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
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="relative w-full max-w-lg glass-card rounded-3xl p-6 shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌱</span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-slate-100">
                    {initialTodo ? 'Edit Task & Note' : 'Plant a New Task'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nurture your day with gentle intentions
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  To-Do Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g., Morning walk among blooming lilacs..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200/80 dark:border-purple-900/50 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 text-sm transition"
                />
              </div>

              {/* Note / Journal Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Botanical Note (optional details)
                </label>
                <textarea
                  rows={3}
                  placeholder="Add thoughts, checklist steps, reflections, or links..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200/80 dark:border-purple-900/50 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 text-sm transition resize-none"
                />
              </div>

              {/* Flower Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Botanical Motif
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FLOWER_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        sounds.playRustle();
                        setFlower(f.id);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                        flower === f.id
                          ? `${f.color} ring-2 ring-pink-400/50 shadow-sm font-semibold scale-102`
                          : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100/60'
                      }`}
                    >
                      <span className="text-base">{f.icon}</span>
                      <span>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Priority
                </label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`capitalize px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        priority === p
                          ? 'border-purple-400 bg-purple-100/70 text-purple-900 dark:bg-purple-950/60 dark:text-purple-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100/50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !title.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 dark:from-pink-600 dark:to-purple-700 hover:brightness-105 shadow-md shadow-pink-500/20 disabled:opacity-50 flex items-center gap-1.5 transition"
                >
                  {submitting ? (
                    <span className="animate-spin">🌸</span>
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{initialTodo ? 'Save Changes' : 'Add to Bloom'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
