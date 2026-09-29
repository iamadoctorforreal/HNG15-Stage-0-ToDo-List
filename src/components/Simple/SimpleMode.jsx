import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Search, 
  Calendar,
  Sparkles,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';

// Trigger floral petal celebration
const triggerPetalCelebration = () => {
  confetti({
    particleCount: 35,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#E8A0BF', '#B4A7D6', '#F6D55C', '#A8C5A0', '#FFF2F5'],
    shapes: ['circle'],
    scalar: 1.2,
    ticks: 180,
  });
};

const FLOWER_META = {
  rose: { icon: '🌸', label: 'Rose', border: 'border-pink-300 dark:border-pink-900', badge: 'bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300' },
  lavender: { icon: '🪻', label: 'Lavender', border: 'border-purple-300 dark:border-purple-900', badge: 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300' },
  daffodil: { icon: '🌼', label: 'Daffodil', border: 'border-amber-300 dark:border-amber-900', badge: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300' },
};

export const SimpleMode = ({
  todos,
  loading,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onOpenAddModal
}) => {
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [flowerFilter, setFlowerFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedNotes, setExpandedNotes] = useState({});

  const toggleNoteExpand = (id) => {
    sounds.playRustle();
    setExpandedNotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggle = (id, currentlyCompleted) => {
    if (!currentlyCompleted) {
      sounds.playComplete();
      triggerPetalCelebration();
    } else {
      sounds.playClick();
    }
    onToggleTodo(id);
  };

  const handleDelete = (id) => {
    sounds.playPop();
    onDeleteTodo(id);
  };

  // Filter & Search logic
  const filteredTodos = todos.filter(todo => {
    // Status filter
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;

    // Flower type filter
    if (flowerFilter !== 'all' && (todo.flower || 'rose') !== flowerFilter) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const inTitle = (todo.title || '').toLowerCase().includes(q);
      const inNote = (todo.note || '').toLowerCase().includes(q);
      return inTitle || inNote;
    }

    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 relative z-10">
      
      {/* Control Bar: Search + Filter Tabs */}
      <div className="glass-panel rounded-2xl p-3 shadow-md mb-6 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-pink-200/50 dark:border-purple-900/40 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
          {/* Status Tabs */}
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: `All (${todos.length})` },
              { id: 'active', label: `Active (${activeCount})` },
              { id: 'completed', label: `Done (${completedCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setFilter(tab.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  filter === tab.id
                    ? 'bg-pink-100 dark:bg-pink-950/80 text-pink-800 dark:text-pink-200 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Flower Motif Filter */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setFlowerFilter('all')}
              className={`px-2 py-0.5 rounded-md ${flowerFilter === 'all' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-400'}`}
            >
              All Flowers
            </button>
            <button
              onClick={() => { sounds.playRustle(); setFlowerFilter('rose'); }}
              title="Filter Roses"
              className={`p-1 rounded-md ${flowerFilter === 'rose' ? 'bg-pink-100 dark:bg-pink-950 scale-110' : 'opacity-60'}`}
            >
              🌸
            </button>
            <button
              onClick={() => { sounds.playRustle(); setFlowerFilter('lavender'); }}
              title="Filter Lavender"
              className={`p-1 rounded-md ${flowerFilter === 'lavender' ? 'bg-purple-100 dark:bg-purple-950 scale-110' : 'opacity-60'}`}
            >
              🪻
            </button>
            <button
              onClick={() => { sounds.playRustle(); setFlowerFilter('daffodil'); }}
              title="Filter Daffodils"
              className={`p-1 rounded-md ${flowerFilter === 'daffodil' ? 'bg-amber-100 dark:bg-amber-950 scale-110' : 'opacity-60'}`}
            >
              🌼
            </button>
          </div>
        </div>
      </div>

      {/* Todo Items List */}
      <div className="space-y-3">
        {loading && (
          <div className="py-16 text-center">
            <span className="inline-block text-3xl animate-bounce">🌸</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Gathering your floral notes from Firestore...
            </p>
          </div>
        )}

        {!loading && filteredTodos.length === 0 && (
          <div className="py-16 text-center glass-panel rounded-3xl p-8 shadow-sm">
            <span className="text-4xl">🌱</span>
            <h4 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100 mt-2">
              {search ? 'No blooming thoughts match your search' : 'Your garden is serene & clear'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1 mb-4">
              {search ? 'Try clearing your search keyword or filters.' : 'Plant a new to-do or thought to nurture your productive day.'}
            </p>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-600 dark:to-purple-700 shadow-md hover:scale-105 transition"
            >
              + Plant First Task
            </button>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {filteredTodos.map((todo) => {
            const flower = FLOWER_META[todo.flower] || FLOWER_META.rose;
            const isExpanded = !!expandedNotes[todo.id];

            return (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className={`glass-card rounded-2xl p-4 shadow-sm border transition-all duration-300 group ${
                  todo.completed
                    ? 'opacity-60 saturate-50 bg-slate-100/50 dark:bg-slate-900/40 border-dashed border-slate-300/60 dark:border-slate-800/60'
                    : 'hover:shadow-md'
                }`}
              >
                {/* Main Row */}
                <div className="flex items-start gap-3">
                  
                  {/* Botanical Checkbox */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleToggle(todo.id, todo.completed)}
                    className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                        : 'border-pink-300 dark:border-purple-800 bg-white/70 dark:bg-slate-900/60 hover:border-pink-500'
                    }`}
                  >
                    {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </motion.button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        onClick={() => handleToggle(todo.id, todo.completed)}
                        className={`text-sm font-semibold cursor-pointer select-none transition-all ${
                          todo.completed
                            ? 'line-through decoration-pink-500/80 dark:decoration-purple-400 decoration-2 text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100 hover:text-pink-600 dark:hover:text-pink-300'
                        }`}
                      >
                        {todo.title}
                      </span>

                      {/* Flower Motif Tag */}
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${flower.badge}`}>
                        <span>{flower.icon}</span>
                        <span>{flower.label}</span>
                      </span>

                      {/* Priority Tag */}
                      {todo.priority && todo.priority !== 'medium' && (
                        <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                          todo.priority === 'high'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                        }`}>
                          {todo.priority}
                        </span>
                      )}
                    </div>

                    {/* Note Preview or Toggle */}
                    {todo.note && (
                      <div className="mt-1.5">
                        <button
                          onClick={() => toggleNoteExpand(todo.id)}
                          className="text-xs text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1 hover:underline"
                        >
                          <span>{isExpanded ? 'Hide Note' : 'View Note'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {/* Expandable Full Note */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-pink-50/50 dark:bg-purple-950/30 border border-pink-100 dark:border-purple-900/30 whitespace-pre-wrap font-sans"
                            >
                              {todo.note}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTodo(todo)}
                      title="Edit task"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      title="Delete task"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
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

      {/* Floating Add Task Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenAddModal}
          className="px-5 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 shadow-xl shadow-pink-500/30 flex items-center gap-2 hover:brightness-105 transition"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span className="text-sm">New Task</span>
        </motion.button>
      </div>

    </div>
  );
};
