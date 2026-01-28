import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const TOKEN_KEY = 'notely_token';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isOfflineMode: false,

      loginSuccess: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, token);
        }
        set({ user, token, isOfflineMode: false });
      },

      continueOffline: () => {
        set({ isOfflineMode: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
        }
        set({ user: null, token: null, isOfflineMode: false });
      },
    }),
    {
      name: 'notely-auth',
    }
  )
);

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export default useAuthStore;

