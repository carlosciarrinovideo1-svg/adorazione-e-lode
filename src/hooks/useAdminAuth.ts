import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminAuthState {
  isAuthenticated: boolean;
  passwordHash: string;
  login: (password: string) => boolean;
  logout: () => void;
  setPassword: (newPassword: string) => void;
}

// Simple hash function for localStorage (NOT cryptographically secure, but sufficient for client-side admin)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

// Default password is "admin123" - should be changed on first login
const DEFAULT_PASSWORD_HASH = simpleHash("admin123");

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      passwordHash: DEFAULT_PASSWORD_HASH,
      login: (password: string) => {
        const inputHash = simpleHash(password);
        if (inputHash === get().passwordHash) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false });
      },
      setPassword: (newPassword: string) => {
        set({ passwordHash: simpleHash(newPassword) });
      },
    }),
    {
      name: 'luce-divina-admin-auth',
    }
  )
);
