import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, NotificationItem } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  selectedPlanId: string | null;
  setSelectedPlanId: (planId: string | null) => void;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  notifications: NotificationItem[];
  activePopup: NotificationItem | null;
  dismissPopup: (notifId: string) => Promise<void>;
  markNotificationRead: (notifId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('rad_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlanId, setSelectedPlanIdState] = useState<string | null>(() => localStorage.getItem('rad_selected_plan'));
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activePopup, setActivePopup] = useState<NotificationItem | null>(null);

  const setSelectedPlanId = (planId: string | null) => {
    setSelectedPlanIdState(planId);
    if (planId) {
      localStorage.setItem('rad_selected_plan', planId);
    } else {
      localStorage.removeItem('rad_selected_plan');
    }
  };

  // Check existing session
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('rad_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/session', {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('rad_token');
            setToken(null);
            setUser(null);
          }
        } else {
          localStorage.removeItem('rad_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session verify failed', err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const refreshNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setActivePopup(data.activePopup || null);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (user && token) {
      refreshNotifications();
      const interval = setInterval(refreshNotifications, 15000); // 15s poll
      return () => clearInterval(interval);
    }
  }, [user, token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('rad_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Logout error', err);
      }
    }
    localStorage.removeItem('rad_token');
    setToken(null);
    setUser(null);
    setNotifications([]);
    setActivePopup(null);
  };

  const dismissPopup = async (notifId: string) => {
    setActivePopup(null);
    if (!token) return;
    try {
      await fetch(`/api/notifications/${notifId}/dismiss`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshNotifications();
    } catch (err) {
      console.error('Dismiss popup error', err);
    }
  };

  const markNotificationRead = async (notifId: string) => {
    if (!token) return;
    try {
      await fetch(`/api/notifications/${notifId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshNotifications();
    } catch (err) {
      console.error('Mark read error', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        selectedPlanId,
        setSelectedPlanId,
        login,
        logout,
        notifications,
        activePopup,
        dismissPopup,
        markNotificationRead,
        refreshNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
