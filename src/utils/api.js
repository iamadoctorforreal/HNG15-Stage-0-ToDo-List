// API client for Bloom backend with Multi-User Data Isolation
// Supports both unified deployments (/api) and separate Vercel deployments (VITE_API_URL)
const API_BASE = (import.meta.env?.VITE_API_URL || '/api').replace(/\/$/, '');

let activeUserId = 'demo';

export const setApiUserId = (userId) => {
  activeUserId = (userId || 'demo').trim().toLowerCase();
};

export const getApiUserId = () => activeUserId;

const getHeaders = (extra = {}) => ({
  'Content-Type': 'application/json',
  'X-User-Id': activeUserId,
  ...extra,
});

export const api = {
  setUserId(userId) {
    setApiUserId(userId);
  },

  // Check health and firebase connectivity
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      console.warn("Backend not reached yet, using fallback state:", e);
      return { status: "offline", error: e.message };
    }
  },

  // Get all todos for current user
  async getTodos(userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/todos?user_id=${encodeURIComponent(uid)}`, {
      headers: { 'X-User-Id': uid }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch todos');
    }
    return await res.json();
  },

  // Create a new todo
  async createTodo(todoData, userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/todos?user_id=${encodeURIComponent(uid)}`, {
      method: 'POST',
      headers: getHeaders({ 'X-User-Id': uid }),
      body: JSON.stringify(todoData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create todo');
    }
    return await res.json();
  },

  // Update a todo
  async updateTodo(id, updates, userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/todos/${id}?user_id=${encodeURIComponent(uid)}`, {
      method: 'PUT',
      headers: getHeaders({ 'X-User-Id': uid }),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update todo');
    }
    return await res.json();
  },

  // Toggle todo completion
  async toggleTodo(id, userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/todos/${id}/toggle?user_id=${encodeURIComponent(uid)}`, {
      method: 'PATCH',
      headers: { 'X-User-Id': uid }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to toggle todo');
    }
    return await res.json();
  },

  // Delete a todo
  async deleteTodo(id, userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/todos/${id}?user_id=${encodeURIComponent(uid)}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': uid }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to delete todo');
    }
    return await res.json();
  },

  // ==========================
  // NOTEBOOKS API
  // ==========================
  async getNotebooks(userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/notebooks?user_id=${encodeURIComponent(uid)}`, {
      headers: { 'X-User-Id': uid }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch notebooks');
    }
    return await res.json();
  },

  async createNotebook(data, userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/notebooks?user_id=${encodeURIComponent(uid)}`, {
      method: 'POST',
      headers: getHeaders({ 'X-User-Id': uid }),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create notebook');
    }
    return await res.json();
  },

  async deleteNotebook(id, userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/notebooks/${id}?user_id=${encodeURIComponent(uid)}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': uid }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to delete notebook');
    }
    return await res.json();
  },

  // ==========================
  // NOTES (JOURNAL) API
  // ==========================
  async getNotes(notebookId, userId) {
    const uid = userId || activeUserId;
    let url = `${API_BASE}/notes?user_id=${encodeURIComponent(uid)}`;
    if (notebookId) {
      url += `&notebook_id=${encodeURIComponent(notebookId)}`;
    }
    const res = await fetch(url, {
      headers: { 'X-User-Id': uid }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch notes');
    }
    return await res.json();
  },

  async createNote(data, userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/notes?user_id=${encodeURIComponent(uid)}`, {
      method: 'POST',
      headers: getHeaders({ 'X-User-Id': uid }),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create note');
    }
    return await res.json();
  },

  async updateNote(id, updates, userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/notes/${id}?user_id=${encodeURIComponent(uid)}`, {
      method: 'PUT',
      headers: getHeaders({ 'X-User-Id': uid }),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update note');
    }
    return await res.json();
  },

  async deleteNote(id, userId) {
    const uid = userId || activeUserId;
    const res = await fetch(`${API_BASE}/notes/${id}?user_id=${encodeURIComponent(uid)}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': uid }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to delete note');
    }
    return await res.json();
  },
};


