import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { FloatingBotanicals } from './components/Flowers/FloatingBotanicals';
import { SimpleMode } from './components/Simple/SimpleMode';
import { MagicMode } from './components/Magic/MagicMode';
import { CalendarInsights } from './components/Calendar/CalendarInsights';
import { JournalMode } from './components/Journal/JournalMode';
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

  // Sanctuary Journal state
  const [notebooks, setNotebooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [journalLoading, setJournalLoading] = useState(false);

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

  // Load journal notebooks & notes
  const loadJournal = async (userToLoad = currentUser) => {
    if (!userToLoad) return;
    const uid = getEffectiveUserId(userToLoad);
    try {
      setJournalLoading(true);
      const [nbs, nts] = await Promise.all([
        api.getNotebooks(uid),
        api.getNotes(null, uid)
      ]);
      setNotebooks(Array.isArray(nbs) ? nbs : []);
      setNotes(Array.isArray(nts) ? nts : []);
    } catch (err) {
      console.warn("Could not load journal from cloud, using initial state:", err);
      if (uid === 'demo') {
        const demoNbs = [
          { id: 'demo-nb-1', title: 'Morning Reflections', icon: '🌸', flower: 'rose', description: 'Peaceful morning intentions & gratitude', note_count: 1 },
          { id: 'demo-nb-2', title: 'Daily Gratitude & Calm', icon: '🪻', flower: 'lavender', description: 'Tracking daily joys & serenity', note_count: 1 },
          { id: 'demo-nb-3', title: 'Creative Seeds & Ideas', icon: '🌼', flower: 'daffodil', description: 'Brainstorms & gentle thoughts', note_count: 1 },
        ];
        const demoNotes = [
          {
            id: 'demo-note-1',
            notebook_id: 'demo-nb-1',
            title: 'Sunrise & Stillness in the Sanctuary',
            content: 'Today the dawn light crept through the window in soft amber hues. Drinking warm herbal tea while listening to the birds in the garden. Today\'s intention is simple: move with calm focus, finish HNG Stage 0 with excellence, and nourish the spirit without rushing.',
            flower: 'rose',
            mood: 'calm',
            word_count: 48,
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-note-2',
            notebook_id: 'demo-nb-2',
            title: 'Three Little Joys of the Day',
            content: '1. The sweet fragrance of blooming lavender after dawn rain.\n2. The crisp tactile feeling of smooth card swipes in Magic Mode.\n3. Making steady progress and finding joy in deliberate, thoughtful craftsmanship.',
            flower: 'lavender',
            mood: 'grateful',
            word_count: 36,
            created_at: new Date(Date.now() - 3600000 * 24).toISOString()
          },
          {
            id: 'demo-note-3',
            notebook_id: 'demo-nb-3',
            title: 'Voice Journaling & Peaceful Software',
            content: 'What if our digital tools felt like walking through a sunlit conservatory instead of a stressful inbox? Adding voice dictation lets thoughts flow without the tension of a keyboard.',
            flower: 'daffodil',
            mood: 'inspired',
            word_count: 30,
            created_at: new Date(Date.now() - 3600000 * 48).toISOString()
          }
        ];
        setNotebooks(demoNbs);
        setNotes(demoNotes);
      } else {
        const starterNb = [
          { id: 'starter-nb-1', title: 'My Sanctuary Journal', icon: '🌸', flower: 'rose', description: 'Your personal haven for notes & reflections', note_count: 1 }
        ];
        const starterNote = [
          {
            id: 'starter-note-1',
            notebook_id: 'starter-nb-1',
            title: 'Welcome to your Journal 🌸',
            content: 'Welcome to your sacred writing space. You can organize your thoughts across notebooks, check your writing streak in the activity graph above, or tap the microphone button to dictate thoughts effortlessly using browser voice-to-text. Breathe deeply and bloom.',
            flower: 'rose',
            mood: 'calm',
            word_count: 42,
            created_at: new Date().toISOString()
          }
        ];
        setNotebooks(starterNb);
        setNotes(starterNote);
      }
    } finally {
      setJournalLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadTodos(currentUser);
      loadJournal(currentUser);
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloom_current_user', JSON.stringify(user));
    }
    loadTodos(user);
    loadJournal(user);
  };

  const handleLogout = () => {
    sounds.playPop();
    setCurrentUser(null);
    setTodos([]);
    setNotebooks([]);
    setNotes([]);
    setApiUserId('demo');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bloom_current_user');
    }
  };

  // Journal Handlers
  const handleCreateNotebook = async (data) => {
    const tempId = `nb-${Date.now()}`;
    const optimisticNb = { id: tempId, note_count: 0, created_at: new Date().toISOString(), ...data };
    setNotebooks(prev => [...prev, optimisticNb]);
    try {
      const created = await api.createNotebook(data);
      setNotebooks(prev => prev.map(nb => nb.id === tempId ? created : nb));
    } catch (e) {
      console.warn("Could not sync notebook to cloud, kept local:", e);
    }
  };

  const handleDeleteNotebook = async (id) => {
    setNotebooks(prev => prev.filter(nb => nb.id !== id));
    setNotes(prev => prev.filter(n => n.notebook_id !== id));
    try {
      await api.deleteNotebook(id);
    } catch (e) {
      console.warn("Could not delete notebook in cloud, kept local:", e);
    }
  };

  const handleCreateNote = async (data) => {
    const tempId = `note-${Date.now()}`;
    const wordCount = data.content ? data.content.trim().split(/\s+/).length : 0;
    const optimisticNote = {
      id: tempId,
      ...data,
      word_count: wordCount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setNotes(prev => [optimisticNote, ...prev]);
    // increment notebook count
    setNotebooks(prev => prev.map(nb => nb.id === data.notebook_id ? { ...nb, note_count: (nb.note_count || 0) + 1 } : nb));

    try {
      const created = await api.createNote(data);
      setNotes(prev => prev.map(n => n.id === tempId ? created : n));
    } catch (e) {
      console.warn("Could not sync note to cloud, kept local:", e);
    }
  };

  const handleUpdateNote = async (id, updates) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n));
    try {
      const updated = await api.updateNote(id, updates);
      setNotes(prev => prev.map(n => n.id === id ? updated : n));
    } catch (e) {
      console.warn("Could not sync note update to cloud, kept local:", e);
    }
  };

  const handleDeleteNote = async (id) => {
    const target = notes.find(n => n.id === id);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (target) {
      setNotebooks(prev => prev.map(nb => nb.id === target.notebook_id ? { ...nb, note_count: Math.max(0, (nb.note_count || 1) - 1) } : nb));
    }
    try {
      await api.deleteNote(id);
    } catch (e) {
      console.warn("Could not sync note deletion to cloud, kept local:", e);
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

            {mode === 'journal' && (
              <JournalMode
                notebooks={notebooks}
                notes={notes}
                loading={journalLoading}
                onCreateNotebook={handleCreateNotebook}
                onDeleteNotebook={handleDeleteNotebook}
                onCreateNote={handleCreateNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
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
