import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles,
  ArrowUp,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LavenderFlower, RoseFlower, DaffodilFlower } from '../Flowers/BotanicalSVGs';
import { sounds } from '../../utils/soundEffects';

const triggerPetalCelebration = () => {
  confetti({
    particleCount: 45,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#E8A0BF', '#B4A7D6', '#F6D55C', '#A8C5A0', '#FFF2F5'],
    shapes: ['circle'],
    scalar: 1.3,
  });
};

export const MagicMode = ({
  todos,
  loading,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onOpenAddModal
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // If todos change or delete makes index out of bounds
  const validIndex = todos.length > 0 ? Math.min(currentIndex, todos.length - 1) : 0;
  const currentTodo = todos[validIndex];

  const handleNext = () => {
    if (currentIndex < todos.length - 1) {
      sounds.playSwipe();
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      sounds.playSwipe();
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleDragEnd = (e, info) => {
    const swipeThreshold = 60;
    const swipeYThreshold = -70;

    // Swipe up to toggle complete
    if (info.offset.y < swipeYThreshold) {
      if (currentTodo) {
        if (!currentTodo.completed) {
          sounds.playComplete();
          triggerPetalCelebration();
        } else {
          sounds.playClick();
        }
        onToggleTodo(currentTodo.id);
      }
      return;
    }

    // Horizontal swipe navigation
    if (info.offset.x < -swipeThreshold && currentIndex < todos.length - 1) {
      handleNext();
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      handlePrev();
    }
  };

  const handleCompleteCurrent = () => {
    if (currentTodo) {
      if (!currentTodo.completed) {
        sounds.playComplete();
        triggerPetalCelebration();
      } else {
        sounds.playClick();
      }
      onToggleTodo(currentTodo.id);
    }
  };

  const handleDeleteCurrent = () => {
    if (currentTodo) {
      sounds.playPop();
      onDeleteTodo(currentTodo.id);
      if (currentIndex > 0 && currentIndex >= todos.length - 1) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <span className="inline-block text-4xl animate-bounce">🪻</span>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
          Awakening magic cards...
        </p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center z-10 relative">
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-pink-200/50 dark:border-purple-900/40">
          <span className="text-5xl">🌸</span>
          <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">
            Magic Garden is Empty
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
            Create your first task card to experience swipeable botanical focus.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 shadow-lg shadow-pink-500/25 hover:scale-105 transition"
          >
            + Create Magic Card
          </button>
        </div>
      </div>
    );
  }

  // Botanical Illustration per card
  const FlowerIllustration =
    currentTodo.flower === 'rose'
      ? RoseFlower
      : currentTodo.flower === 'daffodil'
      ? DaffodilFlower
      : LavenderFlower;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 relative z-10 flex flex-col items-center">
      
      {/* Deck Indicator Header */}
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="font-serif text-sm font-semibold text-slate-700 dark:text-slate-300">
            Card {validIndex + 1} of {todos.length}
          </span>
        </div>

        {/* Swipe Hint */}
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          Swipe ⟵ ⟶ or ⮝
        </span>
      </div>

      {/* Swipeable Card Container */}
      <div className="relative w-full h-[470px] flex items-center justify-center">
        
        {/* Deep Stack Card (3rd in line) */}
        {validIndex + 2 < todos.length && (() => {
          const thirdTodo = todos[validIndex + 2];
          return (
            <div 
              key={`third-${thirdTodo.id}`}
              className="absolute w-[86%] h-[420px] rounded-3xl p-6 glass-card border border-pink-200/40 dark:border-purple-900/30 translate-y-7 scale-90 blur-[0.6px] opacity-40 pointer-events-none select-none transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{thirdTodo.flower === 'rose' ? '🌸' : thirdTodo.flower === 'daffodil' ? '🌼' : '🪻'}</span>
                <span className="text-xs font-serif font-semibold text-slate-400 truncate">{thirdTodo.title}</span>
              </div>
            </div>
          );
        })()}

        {/* Immediate Next Card (2nd in line - peeking directly underneath!) */}
        {validIndex + 1 < todos.length && (() => {
          const nextTodo = todos[validIndex + 1];
          return (
            <div 
              key={`next-${nextTodo.id}`}
              className="absolute w-[93%] h-[445px] rounded-3xl p-7 glass-card border border-pink-300/70 dark:border-purple-800/50 translate-y-3.5 scale-95 opacity-85 shadow-lg pointer-events-none select-none transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Peek Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{nextTodo.flower === 'rose' ? '🌸' : nextTodo.flower === 'daffodil' ? '🌼' : '🪻'}</span>
                  <span className="font-serif text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">
                    {nextTodo.flower || 'rose'} Sanctuary
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-100/70 dark:bg-purple-950/60 text-pink-700 dark:text-pink-300">
                  Up next
                </span>
              </div>

              {/* Peek Title & Note */}
              <div className="my-auto py-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-700/80 dark:text-pink-200/80 line-clamp-2">
                  {nextTodo.title}
                </h3>
                {nextTodo.note && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-sans leading-relaxed">{nextTodo.note}</p>
                )}
              </div>

              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                <span>Swipe left to reveal</span>
                <span>{nextTodo.priority ? `${nextTodo.priority} priority` : ''}</span>
              </div>
            </div>
          );
        })()}

        {/* Active Draggable Card */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentTodo.id}
            custom={direction}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.9, x: direction * 150 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.88, x: -direction * 150 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={`relative w-full h-full glass-card rounded-3xl p-7 shadow-2xl flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing border ${
              currentTodo.completed
                ? 'border-emerald-300/80 dark:border-emerald-700/60 bg-white/90 dark:bg-slate-900/80'
                : 'border-pink-200/80 dark:border-purple-900/60'
            }`}
          >
            {/* Background Botanical Silhouette / Watermark */}
            <div className="absolute -bottom-8 -right-8 opacity-20 dark:opacity-15 pointer-events-none scale-125 transform">
              <FlowerIllustration className="w-56 h-72" />
            </div>

            {/* Top Bar of Card */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Category / Motif Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {currentTodo.flower === 'rose' ? '🌸' : currentTodo.flower === 'daffodil' ? '🌼' : '🪻'}
                </span>
                <span className="font-serif capitalize text-xs tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  {currentTodo.flower || 'rose'} Sanctuary
                </span>
              </div>

              {/* Status Stamp / Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCompleteCurrent}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                  currentTodo.completed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-pink-100 dark:bg-purple-950 text-pink-700 dark:text-pink-300 hover:bg-emerald-100 hover:text-emerald-700'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{currentTodo.completed ? 'Completed' : 'Mark Done'}</span>
              </motion.button>
            </div>

            {/* Middle: Title & Note */}
            <div className="relative z-10 my-auto py-4">
              <h2 className={`font-serif text-2xl md:text-3xl font-bold leading-snug transition-colors ${
                currentTodo.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-pink-100'
              }`}>
                {currentTodo.title}
              </h2>

              {currentTodo.note ? (
                <div className="mt-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-950/40 border border-pink-100/60 dark:border-purple-900/30 text-xs md:text-sm text-slate-600 dark:text-slate-300 max-h-40 overflow-y-auto leading-relaxed whitespace-pre-wrap font-sans">
                  {currentTodo.note}
                </div>
              ) : (
                <p className="mt-3 text-xs italic text-slate-400">
                  No extended botanical note. Tap edit to add reflections.
                </p>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="relative z-10 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
                {new Date(currentTodo.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditTodo(currentTodo)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/50 transition"
                  title="Edit Card"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteCurrent}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Delete Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation & Action Controls */}
      <div className="flex items-center justify-between w-full max-w-sm mt-6">
        {/* Prev Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={currentIndex === 0}
          onClick={handlePrev}
          className="p-3 rounded-2xl glass-card text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:pointer-events-none shadow-md hover:bg-pink-100/40 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Page Dots */}
        <div className="flex items-center gap-1.5 max-w-[140px] overflow-hidden">
          {todos.slice(0, 10).map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                sounds.playSwipe();
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`transition-all rounded-full ${
                idx === validIndex
                  ? 'w-6 h-2 bg-pink-500 dark:bg-pink-400'
                  : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-pink-300'
              }`}
            />
          ))}
          {todos.length > 10 && (
            <span className="text-[10px] text-slate-400">+</span>
          )}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={currentIndex >= todos.length - 1}
          onClick={handleNext}
          className="p-3 rounded-2xl glass-card text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:pointer-events-none shadow-md hover:bg-pink-100/40 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Floating Add Card Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenAddModal}
          className="px-5 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 shadow-xl shadow-pink-500/30 flex items-center gap-2 hover:brightness-105 transition"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span className="text-sm">New Card</span>
        </motion.button>
      </div>

    </div>
  );
};
