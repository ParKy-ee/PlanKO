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
import { SENSOR_WS_URL } from '../config/sensor';
import { dataStorage } from '../services/dataStorage';
import type {
  ApiRequestOptions,
  StoredWebSocketEvent,
  WebSocketStatus,
} from '../services/dataStorage';

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
  sensorConnection: WebSocketStatus | 'off';
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  startMission: (programId: number, period: number) => void;
  addSessionPerformance: (session: Omit<SessionPerformance, 'id' | 'createdAt' | 'userId'>) => void;
  requestApi: <T>(cacheKey: string, request: () => Promise<T>, options?: ApiRequestOptions) => Promise<T>;
  requestJson: <T>(cacheKey: string, url: string, init?: RequestInit, options?: ApiRequestOptions) => Promise<T>;
  getCachedApiData: <T>(cacheKey: string) => Promise<T | null>;
  subscribeToWebSocketEvents: (listener: (event: StoredWebSocketEvent) => void) => () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@planko_is_authenticated';
const USER_STORAGE_KEY = '@planko_user';
const MISSION_STORAGE_KEY = '@planko_mission';
const QUESTS_STORAGE_KEY = '@planko_quests';
const HISTORY_STORAGE_KEY = '@planko_history';

const persist = <T,>(key: string, value: T) => {
  dataStorage.setItem(key, value).catch((error) => {
    console.warn(`[PlanKO Data] Could not save ${key}:`, error);
  });
};

const requestApi = <T,>(cacheKey: string, request: () => Promise<T>, options?: ApiRequestOptions) =>
  dataStorage.requestApi(cacheKey, request, options);

const requestJson = <T,>(cacheKey: string, url: string, init?: RequestInit, options?: ApiRequestOptions) =>
  dataStorage.requestJson<T>(cacheKey, url, init, options);

const getCachedApiData = <T,>(cacheKey: string) => dataStorage.getApiCache<T>(cacheKey);
const subscribeToWebSocketEvents = (listener: (event: StoredWebSocketEvent) => void) =>
  dataStorage.subscribeToWebSocketEvents(listener);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(initialMockUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [sensorConnection, setSensorConnection] = useState<WebSocketStatus | 'off'>(
    SENSOR_WS_URL ? 'connecting' : 'off',
  );
  const [mission, setMission] = useState<Mission | null>(initialMockMission);
  const [programs] = useState<Program[]>(mockPrograms);
  const [postures] = useState<Posture[]>(mockPostures);
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [history, setHistory] = useState<SessionPerformance[]>(mockHistory);

  // Load saved persistent login session on startup
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [storedAuth, storedUser, storedMission, storedQuests, storedHistory] = await Promise.all([
          dataStorage.getItem<boolean>(AUTH_STORAGE_KEY),
          dataStorage.getItem<User>(USER_STORAGE_KEY),
          dataStorage.getItem<Mission>(MISSION_STORAGE_KEY),
          dataStorage.getItem<Quest[]>(QUESTS_STORAGE_KEY),
          dataStorage.getItem<SessionPerformance[]>(HISTORY_STORAGE_KEY),
        ]);
        setIsAuthenticated(storedAuth === true);
        if (storedUser) setUser(storedUser);
        if (storedMission) setMission(storedMission);
        if (storedQuests) setQuests(storedQuests);
        if (storedHistory) setHistory(storedHistory);
      } catch (err) {
        console.log('Error loading auth session from storage:', err);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Keep the sensor stream alive across all app screens.
  useEffect(() => {
    if (!SENSOR_WS_URL) return;

    return dataStorage.connectWebSocket(SENSOR_WS_URL, {
      onStatusChange: setSensorConnection,
      onError: (error) => console.warn('[PlanKO-WS] WebSocket error:', error),
    });
  }, []);

  // Calculate total calories burned
  const totalCalories = history.reduce((sum, item) => sum + (item.kcal || 0), 0);

  const login = (email: string, pass: string) => {
    if (email && pass) {
      setIsAuthenticated(true);
      persist(AUTH_STORAGE_KEY, true);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, pass: string) => {
    if (name && email && pass) {
      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      setIsAuthenticated(true);
      persist(AUTH_STORAGE_KEY, true);
      persist(USER_STORAGE_KEY, updatedUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    dataStorage.removeItem(AUTH_STORAGE_KEY).catch((error) => {
      console.warn('[PlanKO Data] Could not clear authentication state:', error);
    });
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updatedData };
      persist(USER_STORAGE_KEY, updatedUser);
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
    persist(MISSION_STORAGE_KEY, newMission);
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

    setHistory((prev) => {
      const updatedHistory = [newSession, ...prev];
      persist(HISTORY_STORAGE_KEY, updatedHistory);
      return updatedHistory;
    });

    // Update quest progress
    setQuests((prevQuests) => {
      const updatedQuests = prevQuests.map((q) => {
        if (q.id === 1) {
          const updated = q.currentValue + 1;
          return { ...q, currentValue: updated };
        }
        if (q.id === 2 && sessionData.duration) {
          const addedMin = Math.round(sessionData.duration / 60);
          const updated = q.currentValue + addedMin;
          return { ...q, currentValue: updated };
        }
        if (q.id === 3 && sessionData.kcal) {
          const updated = q.currentValue + sessionData.kcal;
          return { ...q, currentValue: updated };
        }
        return q;
      });
      persist(QUESTS_STORAGE_KEY, updatedQuests);
      return updatedQuests;
    });

    // Update user stats
    setUser((prev) => {
      const updatedUser = {
        ...prev,
        totalWorkoutCount: (prev.totalWorkoutCount ?? 0) + 1,
        totalMinutes: (prev.totalMinutes ?? 0) + Math.round(sessionData.duration / 60),
      };
      persist(USER_STORAGE_KEY, updatedUser);
      return updatedUser;
    });
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
        sensorConnection,
        login,
        register,
        logout,
        updateUser,
        startMission,
        addSessionPerformance,
        requestApi,
        requestJson,
        getCachedApiData,
        subscribeToWebSocketEvents,
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
