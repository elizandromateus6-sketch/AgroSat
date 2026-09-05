import { User, UserRole } from '../types';
import { INITIAL_USER } from '../data/mockData';
import officialAvatar from '../assets/images/agrosat_official_avatar.svg';

const AUTH_STORAGE_KEY = 'agrosat_current_user';
const LOGGED_OUT_KEY = 'agrosat_logged_out';

export const authService = {
  getCurrentUser(): User | null {
    if (localStorage.getItem(LOGGED_OUT_KEY) === 'true') {
      return null;
    }

    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.email) {
          // If the cached avatar is an old unsplash avatar or missing, upgrade to officialAvatar
          if (!parsed.avatarUrl || parsed.avatarUrl.includes('unsplash.com') || parsed.avatarUrl.includes('avatar_green_min')) {
            parsed.avatarUrl = officialAvatar;
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
          }
          return parsed;
        }
      } catch (e) {
        console.error('Erro ao ler usuário salvo:', e);
      }
    }
    // Return null if not logged in / no registered account
    return null;
  },

  login(email: string, _password: string, role?: UserRole): User {
    localStorage.removeItem(LOGGED_OUT_KEY);
    const updatedUser: User = {
      id: 'usr_' + Date.now(),
      email,
      role: role || 'agricultor',
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      avatarUrl: officialAvatar,
      country: 'Angola',
      province: 'Huambo',
      createdAt: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  loginDemo(role: UserRole = 'agricultor'): User {
    localStorage.removeItem(LOGGED_OUT_KEY);
    const demoUser: User = {
      ...INITIAL_USER,
      role,
      avatarUrl: officialAvatar,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    return demoUser;
  },

  register(name: string, email: string, role: UserRole, province: string): User {
    localStorage.removeItem(LOGGED_OUT_KEY);
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      role,
      country: 'Angola',
      province: province || 'Huambo',
      createdAt: new Date().toISOString().split('T')[0],
      avatarUrl: officialAvatar,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout(): void {
    localStorage.setItem(LOGGED_OUT_KEY, 'true');
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  updateProfile(updates: Partial<User>): User {
    localStorage.removeItem(LOGGED_OUT_KEY);
    const current = this.getCurrentUser() || INITIAL_USER;
    const updated = { ...current, ...updates };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
