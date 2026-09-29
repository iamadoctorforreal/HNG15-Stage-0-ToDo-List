import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { FloatingBotanicals } from './components/Flowers/FloatingBotanicals';
import { SimpleMode } from './components/Simple/SimpleMode';
import { MagicMode } from './components/Magic/MagicMode';
import { CalendarInsights } from './components/Calendar/CalendarInsights';
import { LandingPage } from './components/Landing/LandingPage';
import { AuthModal } from './components/Auth/AuthModal';
import { TodoModal } from './components/Modals/TodoModal';
import { useApp } from './context/ThemeContext';
import { api } from './utils/api';
import { sounds } from './utils/soundEffects';

export function App() {
  const { mode } = useApp();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloom_current_user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Load todos from FastAPI / Firebase
  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await api.getTodos();
      
      // If Firestore is brand new and empty, plant 3 lovely sample items!
      if (!data || data.length === 0) {
        const seedItems = [
          {
            title: "Pick fresh lavender from the morning garden 🪻",
            note: "Place a small bundle on the nightstand for soothing lavender aroma and peaceful focus.",
            flower: "lavender",
            priority: "medium",
            completed: false,
          },
          {
            title: "Review HNG 15 Stage 0 submission criteria 🌸",
            note: "Verify live Vercel URL, GitHub repository, clean Apple aesthetics, and responsive layout.",
            flower: "rose",
            priority: "high",
            completed: false,
          },
          {
            title: "Hydrate and stretch in the warm sunlight 🌼",
            note: "Step away from the screen for 10 minutes of deep breathing and sunshine.",
            flower: "daffodil",
            priority: "low",
            completed: true,
          }
        ];

        // Seed to Firestore
        const createdList = [];
        for (const item of seedItems) {
          try {
            const created = await api.createTodo(item);
            createdList.push(created);
          } catch (e) {
            console.error("Seed error:", e);
          }
        }
        setTodos(createdList.length > 0 ? createdList : []);
      } else {
        setTodos(data);
      }
      setIsConnected(true);
    } catch (err) {
      console.error("Error loading todos:", err);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadTodos();
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloom_current_user', JSON.stringify(user));
    }
    loadTodos();
  };

  const handleLogout = () => {
    sounds.playPop();
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bloom_current_user');
    }
  };

  const handleInstantDemo = () => {
    handleLoginSuccess({
      name: 'Rukayyah (Demo Evaluator)',
      email: 'demo@bloom.app',
      isDemo: true,
    });
  };

  // Handle Add / Edit submit
  const handleModalSubmit = async (formData) => {
    if (editingTodo) {
      setTodos(prev => prev.map(t => t.id === editingTodo.id ? { ...t, ...formData } : t));
      const updated = await api.updateTodo(editingTodo.id, formData);
      setTodos(prev => prev.map(t => t.id === editingTodo.id ? updated : t));
    } else {
      const created = await api.createTodo(formData);
      setTodos(prev => [created, ...prev]);
    }
  };

  // Toggle completion
  const handleToggleTodo = async (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      const updated = await api.toggleTodo(id);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error(err);
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    const backup = [...todos];
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await api.deleteTodo(id);
    } catch (err) {
      console.error(err);
      setTodos(backup);
    }
  };

  const openAddModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-pink-300 selection:text-pink-900 pb-8">
      
      {/* Living Floating Flowers (Fluid SVG Lavender, Rose, Daffodils with ripple & rustle on hover/click) */}
      <FloatingBotanicals />

      {/* When NOT logged in: Show the Landing Page */}
      {!currentUser ? (
        <LandingPage
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onInstantDemo={handleInstantDemo}
        />
      ) : (
        /* When Logged in: Show Full Sanctuary App */
        <div className="flex-1 flex flex-col justify-between">
          {/* Main Top Navigation */}
          <div className="pt-4">
            <Navbar 
              isConnected={isConnected} 
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Content: Switches smoothly between Simple, Magic, and Calendar Modes */}
          <main className="flex-1 flex flex-col justify-start">
            {mode === 'simple' && (
              <SimpleMode
                todos={todos}
                loading={loading}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onEditTodo={openEditModal}
                onOpenAddModal={openAddModal}
              />
            )}
            
            {mode === 'magic' && (
              <MagicMode
                todos={todos}
                loading={loading}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onEditTodo={openEditModal}
                onOpenAddModal={openAddModal}
              />
            )}

            {mode === 'calendar' && (
              <CalendarInsights
                todos={todos}
                onToggleTodo={handleToggleTodo}
                onOpenAddModal={openAddModal}
              />
            )}
          </main>

          {/* Add / Edit Task Modal */}
          <TodoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            initialTodo={editingTodo}
          />

          {/* Footer with HERSPEW credit */}
          <footer className="w-full text-center py-4 text-xs text-slate-400 dark:text-slate-500 relative z-10 pointer-events-none">
            Crafted with 🌸 by <span className="font-semibold text-pink-600 dark:text-pink-400">HERSPEW</span> • Bloom To-Dos & Notes
          </footer>
        </div>
      )}

      {/* Login & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default App;
