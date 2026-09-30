import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Sparkles, BookOpen, Volume2, Save, FileText } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { isSpeechRecognitionSupported, SpeechDictationSession } from '../../utils/speechToText';

const FLOWER_OPTIONS = [
  { id: 'rose', label: 'Rose', icon: '🌸', color: 'from-pink-100 to-rose-200 text-rose-800' },
  { id: 'lavender', label: 'Lavender', icon: '🪻', color: 'from-purple-100 to-indigo-200 text-purple-800' },
  { id: 'daffodil', label: 'Daffodil', icon: '🌼', color: 'from-amber-100 to-yellow-200 text-amber-800' },
];

const MOODS = [
  { id: 'calm', label: 'Serene & Calm', icon: '🍃' },
  { id: 'grateful', label: 'Deeply Grateful', icon: '✨' },
  { id: 'inspired', label: 'Inspired', icon: '💡' },
  { id: 'peaceful', label: 'Peaceful', icon: '🕊️' },
  { id: 'reflective', label: 'Reflective', icon: '🌙' },
];

export const NoteEditorModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialNote,
  notebooks,
  activeNotebookId
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notebookId, setNotebookId] = useState('');
  const [flower, setFlower] = useState('rose');
  const [mood, setMood] = useState('calm');
  const [isDictating, setIsDictating] = useState(false);
  const [dictationSupported, setDictationSupported] = useState(true);
  const [dictationNotice, setDictationNotice] = useState('');

  const dictationRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setDictationSupported(isSpeechRecognitionSupported());
  }, []);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setNotebookId(initialNote.notebook_id || (notebooks[0]?.id || ''));
      setFlower(initialNote.flower || 'rose');
      setMood(initialNote.mood || 'calm');
    } else {
      setTitle('');
      setContent('');
      setNotebookId(activeNotebookId || (notebooks[0]?.id || ''));
      setFlower('rose');
      setMood('calm');
    }
    setIsDictating(false);
    setDictationNotice('');
  }, [initialNote, isOpen, activeNotebookId, notebooks]);

  // Clean up dictation when modal closes
  useEffect(() => {
    return () => {
      if (dictationRef.current) {
        dictationRef.current.stop();
      }
    };
  }, []);

  const handleToggleDictation = () => {
    sounds.playRustle();

    if (!dictationSupported) {
      setDictationNotice('Voice dictation requires Google Chrome, Edge, Safari, or Opera.');
      setTimeout(() => setDictationNotice(''), 4000);
      return;
    }

    if (isDictating) {
      if (dictationRef.current) {
        dictationRef.current.stop();
      }
      setIsDictating(false);
      setDictationNotice('');
      sounds.playPop();
    } else {
      dictationRef.current = new SpeechDictationSession({
        onStart: () => {
          setIsDictating(true);
          setDictationNotice('Listening... speak softly & naturally');
        },
        onTranscript: ({ final, interim }) => {
          if (final) {
            setContent(prev => {
              const spacer = prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : '';
              return prev + spacer + final;
            });
          }
        },
        onError: (err) => {
          setIsDictating(false);
          setDictationNotice(`Microphone status: ${err}`);
          setTimeout(() => setDictationNotice(''), 4000);
        },
        onEnd: () => {
          setIsDictating(false);
        }
      });

      const started = dictationRef.current.start();
      if (!started) {
        setIsDictating(false);
        setDictationNotice('Could not access microphone. Please check browser permissions.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (dictationRef.current && isDictating) {
      dictationRef.current.stop();
    }

    sounds.playComplete();
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      notebook_id: notebookId || (notebooks[0]?.id || ''),
      flower,
      mood,
    });
    onClose();
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

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

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200/90 dark:border-purple-900/60 z-10 max-h-[90vh] flex flex-col justify-between overflow-hidden"
          >
            {/* Top Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 dark:from-pink-950 dark:via-purple-900 dark:to-amber-950 flex items-center justify-center text-xl shadow-inner">
                {flower === 'rose' ? '🌸' : flower === 'lavender' ? '🪻' : '🌼'}
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-pink-100">
                  {initialNote ? 'Edit Sanctuary Entry' : 'New Journal Entry'}
                </h3>
                <p className="text-xs text-slate-400">Pour your daily reflections into Bloom</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1">
              
              {/* Row 1: Notebook Selector + Mood */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Notebook
                  </label>
                  <select
                    value={notebookId}
                    onChange={(e) => setNotebookId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-pink-200/60 dark:border-purple-900/50 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    {notebooks.map(nb => (
                      <option key={nb.id} value={nb.id}>
                        {nb.icon} {nb.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Reflective Mood
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-pink-200/60 dark:border-purple-900/50 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    {MOODS.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.icon} {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Entry Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Morning walk & quiet intentions..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-pink-200/60 dark:border-purple-900/50 text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>

              {/* Flower Motif Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Floral Companion
                </label>
                <div className="flex gap-2">
                  {FLOWER_OPTIONS.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => { sounds.playRustle(); setFlower(f.id); }}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        flower === f.id
                          ? 'bg-gradient-to-r from-pink-200 to-rose-100 dark:from-pink-950 dark:to-purple-900 text-pink-900 dark:text-pink-100 shadow-sm ring-2 ring-pink-400/50'
                          : 'bg-white/50 dark:bg-slate-900/40 text-slate-500 hover:bg-white/80'
                      }`}
                    >
                      <span>{f.icon}</span>
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Content + Voice-to-Text Bar */}
              <div className="flex-1 flex flex-col min-h-[160px]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Reflections & Notes
                  </label>

                  {/* Native Voice Dictation Toggle Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleDictation}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs ${
                      isDictating
                        ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-300/50'
                        : 'bg-pink-100 dark:bg-purple-950/80 text-pink-700 dark:text-pink-300 hover:bg-pink-200'
                    }`}
                    title="Speak into your microphone to dictate notes"
                  >
                    {isDictating ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop Dictating</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                        <span>🎙️ Voice to Text</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Status Notice if Dictating */}
                {dictationNotice && (
                  <div className="mb-2 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800 text-[11px] text-pink-800 dark:text-pink-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                    <span>{dictationNotice}</span>
                  </div>
                )}

                <textarea
                  ref={textareaRef}
                  rows={6}
                  placeholder="Pour your heart, thoughts, ideas, or spoken voice here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full flex-1 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-pink-200/60 dark:border-purple-900/50 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none font-sans leading-relaxed"
                />

                {/* Word Count Indicator */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 px-1">
                  <span>{wordCount} words written</span>
                  <span>Lightweight voice transcription enabled</span>
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
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Journal Entry</span>
                </motion.button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
