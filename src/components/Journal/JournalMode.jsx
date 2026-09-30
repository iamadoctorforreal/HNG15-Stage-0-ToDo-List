import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Calendar, 
  Flame, 
  Heart, 
  Mic, 
  AlertCircle,
  Clock,
  Feather,
  BookPlus
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { NoteEditorModal } from './NoteEditorModal';
import { NewNotebookModal } from './NewNotebookModal';

export const JournalMode = ({
  notebooks = [],
  notes = [],
  loading = false,
  onCreateNotebook,
  onDeleteNotebook,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [selectedNotebookId, setSelectedNotebookId] = useState('all');
  const [search, setSearch] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Compute Last Written Time & Days Since Last Entry
  const { lastWrittenFormatted, hoursSinceLastWritten, streakDays, activityDays, totalWords } = useMemo(() => {
    if (!notes || notes.length === 0) {
      return {
        lastWrittenFormatted: 'No entries yet',
        hoursSinceLastWritten: 999,
        streakDays: 0,
        activityDays: [],
        totalWords: 0
      };
    }

    const sorted = [...notes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const mostRecentDate = new Date(sorted[0].created_at);
    const now = new Date();
    const diffHours = Math.floor((now - mostRecentDate) / (1000 * 60 * 60));

    let formatted = 'Just now';
    if (diffHours < 1) {
      formatted = 'Less than an hour ago';
    } else if (diffHours < 24) {
      formatted = `${diffHours} hours ago`;
    } else {
      const days = Math.floor(diffHours / 24);
      formatted = days === 1 ? 'Yesterday' : `${days} days ago`;
    }

    // Total words
    const words = notes.reduce((sum, n) => sum + (n.word_count || 0), 0);

    // Build last 14 days activity graph
    const daysArr = [];
    const dateCountMap = {};

    notes.forEach(n => {
      const d = new Date(n.created_at).toISOString().split('T')[0];
      dateCountMap[d] = (dateCountMap[d] || 0) + 1;
    });

    for (let i = 13; i >= 0; i--) {
      const target = new Date();
      target.setDate(target.getDate() - i);
      const isoKey = target.toISOString().split('T')[0];
      const count = dateCountMap[isoKey] || 0;
      daysArr.push({
        dateKey: isoKey,
        dayLabel: target.toLocaleDateString('en-US', { weekday: 'narrow' }),
        dateNum: target.getDate(),
        isToday: i === 0,
        count
      });
    }

    // Streak count
    let streak = 0;
    const checkDate = new Date();
    while (true) {
      const key = checkDate.toISOString().split('T')[0];
      if (dateCountMap[key]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      lastWrittenFormatted: formatted,
      hoursSinceLastWritten: diffHours,
      streakDays: streak,
      activityDays: daysArr,
      totalWords: words
    };
  }, [notes]);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      if (selectedNotebookId !== 'all' && n.notebook_id !== selectedNotebookId) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const inTitle = (n.title || '').toLowerCase().includes(q);
        const inContent = (n.content || '').toLowerCase().includes(q);
        return inTitle || inContent;
      }
      return true;
    });
  }, [notes, selectedNotebookId, search]);

  const activeNotebook = notebooks.find(nb => nb.id === selectedNotebookId);

  const openAddNoteModal = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const openEditNoteModal = (note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleNoteSubmit = (formData) => {
    if (editingNote) {
      onUpdateNote(editingNote.id, formData);
    } else {
      onCreateNote(formData);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 relative z-10 space-y-6">
      
      {/* 1. Gentle Sanctuary Alert (Monitors when last one wrote) */}
      {hoursSinceLastWritten >= 24 ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 dark:from-amber-950/40 dark:via-rose-950/40 dark:to-pink-950/40 border border-amber-200/80 dark:border-amber-800/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-xl shadow-xs">
              🌸
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center justify-center sm:justify-start gap-1.5">
                <span>Your sanctuary misses your reflections</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-800/60 text-amber-900 dark:text-amber-100">
                  Last written: {lastWrittenFormatted}
                </span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Take a gentle 5-minute pause. Speaking or jotting down your thoughts clears mental clutter and restores inner peace.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              sounds.playRustle();
              openAddNoteModal();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md shadow-pink-500/20 hover:brightness-105 transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Jot a Reflection</span>
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3.5 rounded-2xl bg-pink-50/70 dark:bg-purple-950/40 border border-pink-200/60 dark:border-purple-800/40 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2 text-pink-900 dark:text-pink-200 font-medium">
            <span>✨</span>
            <span>Your soul bloomed today! Last written: <strong className="font-semibold">{lastWrittenFormatted}</strong></span>
          </div>
          <span className="hidden sm:inline text-[11px] text-slate-400">Keep nurturing your quiet space 🌸</span>
        </motion.div>
      )}

      {/* 2. Writing Activity Graph & Summary Header */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-sm border border-pink-200/70 dark:border-purple-900/50 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📖</span>
              <h2 className="font-serif text-2xl font-bold text-slate-800 dark:text-pink-100">
                Sanctuary Journal & Notebooks
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              A peaceful haven to capture thoughts, ideas, voice notes, and daily gratitude
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-xl bg-pink-100/60 dark:bg-purple-950/60 border border-pink-200/50 dark:border-purple-800/40 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">Streak</span>
              <span className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                {streakDays} {streakDays === 1 ? 'day' : 'days'}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-pink-100/60 dark:bg-purple-950/60 border border-pink-200/50 dark:border-purple-800/40 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">Words</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {totalWords}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openAddNoteModal}
              className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md shadow-pink-500/20 flex items-center gap-1.5 hover:brightness-105 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Entry</span>
            </motion.button>
          </div>
        </div>

        {/* 14-Day Writing Activity Heatmap */}
        <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-pink-500" />
              <span>14-Day Writing Activity</span>
            </span>
            <span className="text-[10px] text-slate-400">
              Blossoms represent days you nurtured your journal
            </span>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
            {activityDays.map((d) => (
              <div
                key={d.dateKey}
                title={`${d.dateKey}: ${d.count} entries written`}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                  d.isToday 
                    ? 'ring-2 ring-pink-400 bg-pink-50/80 dark:bg-pink-950/60' 
                    : 'bg-white/40 dark:bg-slate-900/40'
                }`}
              >
                <span className="text-[9px] text-slate-400 font-semibold mb-1">{d.dayLabel}</span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                    d.count > 0
                      ? 'bg-gradient-to-tr from-pink-400 to-rose-400 text-white shadow-xs shadow-pink-500/40 scale-105'
                      : 'border border-dashed border-slate-300 dark:border-slate-700 text-slate-300'
                  }`}
                >
                  {d.count > 0 ? '🌸' : ''}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 font-mono">{d.dateNum}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Notebooks Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {/* All Notes Pill */}
          <button
            onClick={() => { sounds.playRustle(); setSelectedNotebookId('all'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedNotebookId === 'all'
                ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/25'
                : 'glass-panel text-slate-600 dark:text-slate-300 hover:bg-white/90'
            }`}
          >
            All Notes ({notes.length})
          </button>

          {/* User Notebooks Pills */}
          {notebooks.map(nb => (
            <div key={nb.id} className="relative group flex items-center">
              <button
                onClick={() => { sounds.playRustle(); setSelectedNotebookId(nb.id); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  selectedNotebookId === nb.id
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-500/25'
                    : 'glass-panel text-slate-600 dark:text-slate-300 hover:bg-white/90'
                }`}
              >
                <span>{nb.icon}</span>
                <span>{nb.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedNotebookId === nb.id ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                }`}>
                  {nb.note_count || 0}
                </span>
              </button>

              {/* Delete Notebook Option (if selected & not default demo) */}
              {notebooks.length > 1 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete notebook "${nb.title}" and its notes?`)) {
                      sounds.playPop();
                      onDeleteNotebook(nb.id);
                      if (selectedNotebookId === nb.id) setSelectedNotebookId('all');
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition ml-0.5"
                  title="Delete Notebook"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* + New Notebook Button */}
          <button
            onClick={() => { sounds.playClick(); setIsNotebookModalOpen(true); }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-panel text-pink-600 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-purple-950/60 border border-pink-200/50 dark:border-purple-800/40 flex items-center gap-1 whitespace-nowrap"
          >
            <BookPlus className="w-3.5 h-3.5" />
            <span>New Notebook</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reflections & notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-pink-200/50 dark:border-purple-900/40 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
      </div>

      {/* 4. Notes Grid */}
      <div className="space-y-3">
        {loading && (
          <div className="py-16 text-center">
            <span className="inline-block text-3xl animate-bounce">📖</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Gathering your sanctuary journal entries...
            </p>
          </div>
        )}

        {!loading && filteredNotes.length === 0 && (
          <div className="py-16 text-center glass-panel rounded-3xl p-8 shadow-sm">
            <span className="text-4xl">🕊️</span>
            <h4 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100 mt-2">
              {search ? 'No notes matched your search' : 'This notebook is peaceful & quiet'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1 mb-4">
              {search ? 'Try clearing your search query.' : 'Record your thoughts, gratitude, or use voice dictation to pour your ideas into Bloom.'}
            </p>
            <button
              onClick={openAddNoteModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-md hover:scale-105 transition flex items-center gap-1.5 mx-auto"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Plant First Journal Entry</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note) => {
              const createdDate = new Date(note.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              const notebook = notebooks.find(nb => nb.id === note.notebook_id);

              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  className="glass-card rounded-2xl p-5 shadow-sm border border-pink-100/90 dark:border-purple-900/50 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Header: Notebook Badge & Date */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">
                          {note.flower === 'rose' ? '🌸' : note.flower === 'lavender' ? '🪻' : '🌼'}
                        </span>
                        {notebook && (
                          <span className="text-[10px] font-semibold text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full bg-pink-50 dark:bg-purple-950/60">
                            {notebook.icon} {notebook.title}
                          </span>
                        )}
                        {note.mood && (
                          <span className="text-[10px] text-slate-400 capitalize">
                            • {note.mood}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {createdDate}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => openEditNoteModal(note)}
                      className="text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-pink-600 dark:hover:text-pink-300 cursor-pointer transition mb-2"
                    >
                      {note.title}
                    </h3>

                    {/* Excerpt */}
                    <p 
                      onClick={() => openEditNoteModal(note)}
                      className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed font-sans cursor-pointer"
                    >
                      {note.content || '(No note text yet. Tap to write...)'}
                    </p>
                  </div>

                  {/* Card Footer: Word Count & Actions */}
                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Feather className="w-3 h-3 text-pink-400" />
                      <span>{note.word_count || 0} words</span>
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => openEditNoteModal(note)}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 transition"
                        title="Edit Entry"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this journal entry?')) {
                            sounds.playPop();
                            onDeleteNote(note.id);
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 transition"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Note Editor Modal (Includes Voice-to-Text) */}
      <NoteEditorModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSubmit={handleNoteSubmit}
        initialNote={editingNote}
        notebooks={notebooks}
        activeNotebookId={selectedNotebookId !== 'all' ? selectedNotebookId : (notebooks[0]?.id || '')}
      />

      {/* New Notebook Modal */}
      <NewNotebookModal
        isOpen={isNotebookModalOpen}
        onClose={() => setIsNotebookModalOpen(false)}
        onSubmit={onCreateNotebook}
      />

    </div>
  );
};
