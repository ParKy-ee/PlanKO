import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Mission,
  Program,
  Posture,
  Quest,
  SessionPerformance,
} from '../types';
import { initialMockUser } from '../mocks/mockUser';
import { mockPrograms, initialMockMission } from '../mocks/mockPrograms';
import { mockPostures } from '../mocks/mockPostures';
import { mockQuests } from '../mocks/mockQuests';
import { mockHistory } from '../mocks/mockHistory';

// In-file Storage helper with safe fallbacks
let AsyncStorageModule: any = null;
try {
  AsyncStorageModule = require('@react-native-async-storage/async-storage').default || require('@react-native-async-storage/async-storage');
} catch (e) {
  AsyncStorageModule = null;
}

const memoryStore: Record<string, string> = {};

const LocalStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (AsyncStorageModule && typeof AsyncStorageModule.getItem === 'function') {
        return await AsyncStorageModule.getItem(key);
      }
    } catch (e) {}
    return memoryStore[key] || null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      memoryStore[key] = value;
      if (AsyncStorageModule && typeof AsyncStorageModule.setItem === 'function') {
        await AsyncStorageModule.setItem(key, value);
      }
    } catch (e) {}
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      delete memoryStore[key];
      if (AsyncStorageModule && typeof AsyncStorageModule.removeItem === 'function') {
        await AsyncStorageModule.removeItem(key);
      }
    } catch (e) {}
  },
};

interface AppContextType {
  user: User;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  mission: Mission | null;
  programs: Program[];
  postures: Posture[];
  quests: Quest[];
  history: SessionPerformance[];
  totalCalories: number;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  startMission: (programId: number, period: number) => void;
  addSessionPerformance: (session: Omit<SessionPerformance, 'id' | 'createdAt' | 'userId'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@planko_is_authenticated';
const USER_STORAGE_KEY = '@planko_user';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(initialMockUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [mission, setMission] = useState<Mission | null>(initialMockMission);
  const [programs] = useState<Program[]>(mockPrograms);
  const [postures] = useState<Posture[]>(mockPostures);
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [history, setHistory] = useState<SessionPerformance[]>(mockHistory);

  // Load saved persistent login session on startup
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedAuth = await LocalStorage.getItem(AUTH_STORAGE_KEY);
        const storedUser = await LocalStorage.getItem(USER_STORAGE_KEY);
        if (storedAuth === 'true') {
          setIsAuthenticated(true);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.log('Error loading auth session from storage:', err);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Calculate total calories burned
  const totalCalories = history.reduce((sum, item) => sum + (item.kcal || 0), 0);

  const login = (email: string, pass: string) => {
    if (email && pass) {
      setIsAuthenticated(true);
      LocalStorage.setItem(AUTH_STORAGE_KEY, 'true').catch(() => {});
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, pass: string) => {
    if (name && email && pass) {
      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      setIsAuthenticated(true);
      LocalStorage.setItem(AUTH_STORAGE_KEY, 'true').catch(() => {});
      LocalStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser)).catch(() => {});
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    LocalStorage.removeItem(AUTH_STORAGE_KEY).catch(() => {});
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updatedData };
      LocalStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser)).catch(() => {});
      return updatedUser;
    });
  };

  const startMission = (programId: number, period: number) => {
    const selectedProg = programs.find((p) => p.id === programId) || programs[0];
    const newMission: Mission = {
      id: Date.now(),
      userId: user.id,
      programId: selectedProg.id,
      programName: selectedProg.programName,
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + period * 24 * 60 * 60 * 1000).toISOString(),
      target: period,
      current: 1,
      status: 'ACTIVE',
      program: selectedProg,
    };
    setMission(newMission);
  };

  const addSessionPerformance = (
    sessionData: Omit<SessionPerformance, 'id' | 'createdAt' | 'userId'>
  ) => {
    const newSession: SessionPerformance = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      userId: user.id,
      ...sessionData,
    };

    setHistory((prev) => [newSession, ...prev]);

    // Update quest progress
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (q.id === 1) {
          const updated = q.current + 1;
          return { ...q, current: updated, isCompleted: updated >= q.target };
        }
        if (q.id === 2 && sessionData.duration) {
          const addedMin = Math.round(sessionData.duration / 60);
          const updated = q.current + addedMin;
          return { ...q, current: updated, isCompleted: updated >= q.target };
        }
        if (q.id === 3 && sessionData.kcal) {
          const updated = q.current + sessionData.kcal;
          return { ...q, current: updated, isCompleted: updated >= q.target };
        }
        return q;
      })
    );

    // Update user stats
    setUser((prev) => ({
      ...prev,
      totalWorkoutCount: prev.totalWorkoutCount + 1,
      totalMinutes: prev.totalMinutes + Math.round(sessionData.duration / 60),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        mission,
        programs,
        postures,
        quests,
        history,
        totalCalories,
        login,
        register,
        logout,
        updateUser,
        startMission,
        addSessionPerformance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
