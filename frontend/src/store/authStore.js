import { create } from 'zustand';

// Безопасно парсим пользователя из localStorage при старте
const savedUser = localStorage.getItem('user');
let initialUser = null;
try {
  initialUser = savedUser ? JSON.parse(savedUser) : null;
} catch (e) {
  initialUser = null;
}

export const useAuthStore = create((set) => ({
  user: initialUser,
  token: localStorage.getItem('token') || null,

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));