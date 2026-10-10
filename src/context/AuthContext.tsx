import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, preferredCurrency?: any) => Promise<{ success: boolean; error?: string }>;
  loginWithSocial: (provider: 'google' | 'apple') => Promise<void>;
  loginDemoUser: () => void;
  logout: () => void;
  toggleFavorite: (phoneId: string) => void;
  isFavorite: (phoneId: string) => boolean;
  updateUserPreferences: (data: Partial<UserProfile>) => void;
}

const STORAGE_KEY = 'qarenly_user_session';
const FAVORITES_STORAGE_KEY = 'qarenly_anonymous_favorites';

const DEMO_USER: UserProfile = {
  id: 'usr_demo_88',
  name: 'عبدالله الشمري',
  email: 'abdullah.shopper@example.com',
  phone: '+966 55 123 4567',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  preferredCurrency: 'SAR',
  joinedDate: 'يناير 2025',
  emailNotifications: true,
  smsNotifications: false,
  favorites: ['iphone-16-pro-max', 'samsung-galaxy-s25-ultra'],
  alertIds: ['alert_1'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [guestFavorites, setGuestFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['iphone-16-pro-max'];
    } catch {
      return ['iphone-16-pro-max'];
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(guestFavorites));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [guestFavorites]);

  const login = async (email: string, _password: string) => {
    // Validate email format
    if (!email || !email.includes('@')) {
      return { success: false, error: 'يرجى إدخال بريد إلكتروني صحيح' };
    }
    
    // Simulate login
    const loggedUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0],
      email: email,
      preferredCurrency: 'SAR',
      joinedDate: 'اليوم',
      emailNotifications: true,
      smsNotifications: false,
      favorites: guestFavorites,
      alertIds: [],
    };
    setUser(loggedUser);
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    _password: string,
    preferredCurrency: UserProfile['preferredCurrency'] = 'SAR'
  ) => {
    if (!name.trim()) {
      return { success: false, error: 'يرجى إدخال الاسم بالكامل' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'يرجى إدخال بريد إلكتروني صالح' };
    }

    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      preferredCurrency,
      joinedDate: 'الآن',
      emailNotifications: true,
      smsNotifications: false,
      favorites: guestFavorites,
      alertIds: [],
    };
    setUser(newUser);
    return { success: true };
  };

  const loginWithSocial = async (provider: 'google' | 'apple') => {
    const isGoogle = provider === 'google';
    const socialUser: UserProfile = {
      id: `usr_${provider}_${Date.now()}`,
      name: isGoogle ? 'مستخدم Google التجريبي' : 'مستخدم Apple',
      email: isGoogle ? 'user.google@gmail.com' : 'user.apple@icloud.com',
      avatarUrl: isGoogle ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' : undefined,
      preferredCurrency: 'SAR',
      joinedDate: 'اليوم',
      emailNotifications: true,
      smsNotifications: false,
      favorites: guestFavorites.length > 0 ? guestFavorites : ['samsung-galaxy-s25-ultra'],
      alertIds: [],
    };
    setUser(socialUser);
  };

  const loginDemoUser = () => {
    setUser(DEMO_USER);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleFavorite = (phoneId: string) => {
    if (user) {
      const exists = user.favorites.includes(phoneId);
      const updatedFavorites = exists
        ? user.favorites.filter((id) => id !== phoneId)
        : [...user.favorites, phoneId];
      setUser({ ...user, favorites: updatedFavorites });
    } else {
      setGuestFavorites((prev) =>
        prev.includes(phoneId) ? prev.filter((id) => id !== phoneId) : [...prev, phoneId]
      );
    }
  };

  const isFavorite = (phoneId: string) => {
    if (user) {
      return user.favorites.includes(phoneId);
    }
    return guestFavorites.includes(phoneId);
  };

  const updateUserPreferences = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginWithSocial,
        loginDemoUser,
        logout,
        toggleFavorite,
        isFavorite,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
