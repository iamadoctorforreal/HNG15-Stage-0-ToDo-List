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
import { api, setApiUserId } from './utils/api';
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

  const getEffectiveUserId = (user) => {
    if (!user || user.isDemo || user.email === 'demo@bloom.app') {
      return 'demo';
    }
    return user.email.trim().toLowerCase();
  };

  // Load todos from FastAPI / Firebase with per-user isolation
  const loadTodos = async (userToLoad = currentUser) => {
    if (!userToLoad) return;
    const uid = getEffectiveUserId(userToLoad);
    setApiUserId(uid);
    try {
      setLoading(true);
      const data = await api.getTodos(uid);
      setTodos(Array.isArray(data) ? data : []);
      setIsConnected(true);
    } catch (err) {
      console.error("Error loading todos:", err);
      // Fallback offline state if backend cannot be reached
      if (uid === 'demo') {
        setTodos([
          {
            id: 'fallback-demo-1',
            title: "Buy from Temu",
            note: "I just need to order already",
            flower: "rose",
            priority: "high",
            completed: false,
          },
          {
            id: 'fallback-demo-2',
            title: "Review HNG 15 Stage 0 submission criteria 🌸",
            note: "Verify live Vercel URL, GitHub repository, clean Apple aesthetics, and responsive layout.",
            flower: "rose",
            priority: "high",
            completed: true,
          },
          {
            id: 'fallback-demo-3',
            title: "Pick fresh lavender from the morning garden 🪻",
            note: "Place a small bundle on the nightstand for soothing lavender aroma and peaceful focus.",
            flower: "lavender",
            priority: "medium",
            completed: false,
          },
          {
            id: 'fallback-demo-4',
            title: "Hydrate and stretch in the warm sunlight 🌼",
            note: "Step away from the screen for 10 minutes of deep breathing and sunshine.",
            flower: "daffodil",
            priority: "low",
            completed: true,
          }
        ]);
      } else {
        // Any newly created profile has exactly ONE sample task
        setTodos([
          {
            id: 'fallback-new-user-1',
            title: "Welcome to your personal sanctuary 🌸",
            note: "Tap here to view notes or mark as done. Switch between Simple and Magic modes above to experience Bloom!",
            flower: "rose",
            priority: "medium",
            completed: false,
          }
        ]);
      }
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadTodos(currentUser);
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloom_current_user', JSON.stringify(user));
    }
    loadTodos(user);
  };

  const handleLogout = () => {
    sounds.playPop();
    setCurrentUser(null);
    setTodos([]);
    setApiUserId('demo');
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

  // Handle Add / Edit submit with resilient state
  const handleModalSubmit = async (formData) => {
    if (editingTodo) {
      setTodos(prev => prev.map(t => t.id === editingTodo.id ? { ...t, ...formData } : t));
      if (!String(editingTodo.id).startsWith('fallback-')) {
        try {
          const updated = await api.updateTodo(editingTodo.id, formData);
          setTodos(prev => prev.map(t => t.id === editingTodo.id ? updated : t));
        } catch (e) {
          console.warn("Could not sync edit to cloud immediately, kept local:", e);
        }
      }
    } else {
      const tempId = `local-${Date.now()}`;
      const optimisticTodo = { 
        id: tempId, 
        ...formData, 
        completed: false, 
        created_at: new Date().toISOString() 
      };
      setTodos(prev => [optimisticTodo, ...prev]);
      try {
        const created = await api.createTodo(formData);
        setTodos(prev => prev.map(t => t.id === tempId ? created : t));
      } catch (e) {
        console.warn("Could not sync new todo to cloud immediately, kept local:", e);
      }
    }
  };

  // Toggle completion: resilient and never reverts on transient network error
  const handleToggleTodo = async (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    
    // If it's a client fallback id, maintain local state
    if (typeof id === 'string' && id.startsWith('fallback-')) {
      return;
    }

    try {
      const updated = await api.toggleTodo(id);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.warn("Cloud sync pending, keeping your toggle state active:", err);
      // DO NOT revert the toggle; keep user's completed state intact!
    }
  };

  // Delete todo: resilient local removal
  const handleDeleteTodo = async (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    if (typeof id === 'string' && id.startsWith('fallback-')) {
      return;
    }
    try {
      await api.deleteTodo(id);
    } catch (err) {
      console.warn("Cloud delete pending, keeping item removed locally:", err);
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
