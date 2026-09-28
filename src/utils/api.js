// API client for Bloom backend
const API_BASE = '/api';

export const api = {
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

  // Get all todos
  async getTodos() {
    const res = await fetch(`${API_BASE}/todos`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch todos');
    }
    return await res.json();
  },

  // Create a new todo
  async createTodo(todoData) {
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create todo');
    }
    return await res.json();
  },

  // Update a todo
  async updateTodo(id, updates) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update todo');
    }
    return await res.json();
  },

  // Toggle todo completion
  async toggleTodo(id) {
    const res = await fetch(`${API_BASE}/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to toggle todo');
    }
    return await res.json();
  },

  // Delete a todo
  async deleteTodo(id) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to delete todo');
    }
    return await res.json();
  },
};
