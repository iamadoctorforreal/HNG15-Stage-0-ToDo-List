import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles,
  BarChart3,
  Flame
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export const CalendarInsights = ({ todos, onToggleTodo, onOpenAddModal }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

  // Statistics calculation
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Breakdown by flowers
  const roseCount = todos.filter(t => (t.flower || 'rose') === 'rose').length;
  const lavenderCount = todos.filter(t => t.flower === 'lavender').length;
  const daffodilCount = todos.filter(t => t.flower === 'daffodil').length;

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    sounds.playSwipe();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    sounds.playSwipe();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map todos to dates (using created_at)
  const todosByDate = {};
  todos.forEach(t => {
    if (t.created_at) {
      const d = new Date(t.created_at).toDateString();
      if (!todosByDate[d]) todosByDate[d] = [];
      todosByDate[d].push(t);
    }
  });

  const selectedDayTodos = todosByDate[selectedDate] || [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 relative z-10 space-y-6">
      
      {/* Top Banner: Productivity Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Completion Ring */}
        <div className="glass-card rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Completion Rate
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-serif text-3xl font-bold text-slate-800 dark:text-slate-100">
                {percentage}%
              </span>
              <span className="text-xs text-slate-400">done</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {completed} of {total} tasks bloomed
            </p>
          </div>

          {/* SVG Progress Circle */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-pink-100 dark:text-purple-950/60"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-pink-500 dark:text-pink-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-lg">🌸</span>
          </div>
        </div>

        {/* Card 2: Active vs Completed Bar Graph */}
        <div className="glass-card rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Task Breakdown
            </span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>

          {/* Progress Bars */}
          <div className="space-y-2 mt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">Completed</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{completed}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-700 dark:text-amber-300 font-medium">In Progress</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{active}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                  style={{ width: `${total > 0 ? (active / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Flower Palette Distribution */}
        <div className="glass-card rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pretty Palette
            </span>
            <Sparkles className="w-4 h-4 text-pink-400" />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200/50 dark:border-pink-900/30">
              <span className="text-xl">🌸</span>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{roseCount}</p>
              <p className="text-[10px] text-slate-400">Roses</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-900/30">
              <span className="text-xl">🪻</span>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{lavenderCount}</p>
              <p className="text-[10px] text-slate-400">Lavender</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/30">
              <span className="text-xl">🌼</span>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{daffodilCount}</p>
              <p className="text-[10px] text-slate-400">Daffodils</p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Section: Calendar & Day Detail */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left (3 cols): Interactive Calendar */}
        <div className="md:col-span-3 glass-card rounded-3xl p-6 shadow-sm">
          
          {/* Month Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-pink-500" />
              <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-slate-100">
                {monthNames[month]} {year}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty prefix slots */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 rounded-xl" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateObj = new Date(year, month, day);
              const dateStr = dateObj.toDateString();
              const isToday = dateStr === new Date().toDateString();
              const isSelected = dateStr === selectedDate;
              const dayTodos = todosByDate[dateStr] || [];
              const hasTodos = dayTodos.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedDate(dateStr);
                  }}
                  className={`h-11 rounded-2xl flex flex-col items-center justify-center relative transition-all text-xs font-medium ${
                    isSelected
                      ? 'bg-gradient-to-tr from-pink-400 to-purple-400 text-white font-bold shadow-md shadow-pink-500/20 scale-105'
                      : isToday
                      ? 'border border-pink-400 text-pink-600 dark:text-pink-300 font-bold bg-pink-50/50 dark:bg-pink-950/30'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{day}</span>
                  {hasTodos && (
                    <span className="flex items-center gap-0.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-pink-500 dark:bg-pink-400'}`} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Right (2 cols): Selected Date's Tasks */}
        <div className="md:col-span-2 glass-card rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50 mb-3">
              <div>
                <h4 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100">
                  {selectedDate === new Date().toDateString() ? 'Today' : selectedDate}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedDayTodos.length} task{selectedDayTodos.length === 1 ? '' : 's'} recorded
                </p>
              </div>
            </div>

            {/* List for Selected Day */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {selectedDayTodos.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <span className="text-3xl block mb-2">🌱</span>
                  No tasks recorded for this date.
                </div>
              ) : (
                selectedDayTodos.map((todo) => (
                  <div
                    key={todo.id}
                    onClick={() => {
                      sounds.playClick();
                      onToggleTodo(todo.id);
                    }}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                      todo.completed
                        ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-950 dark:bg-emerald-950/20 text-slate-400 line-through'
                        : 'border-pink-100 dark:border-purple-900/30 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:border-pink-300'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${todo.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{todo.title}</p>
                      {todo.note && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{todo.note}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={onOpenAddModal}
            className="w-full mt-4 py-2.5 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 shadow-md hover:brightness-105 transition"
          >
            + Add Task for Today
          </button>
        </div>

      </div>

    </div>
  );
};
