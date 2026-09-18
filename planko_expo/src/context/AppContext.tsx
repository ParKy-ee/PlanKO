import React, { createContext, useContext, useState, ReactNode } from 'react';
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

interface AppContextType {
  user: User;
  isAuthenticated: boolean;
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

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(initialMockUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default true for instant interactive preview
  const [mission, setMission] = useState<Mission | null>(initialMockMission);
  const [programs] = useState<Program[]>(mockPrograms);
  const [postures] = useState<Posture[]>(mockPostures);
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [history, setHistory] = useState<SessionPerformance[]>(mockHistory);

  // Calculate total calories burned
  const totalCalories = history.reduce((sum, item) => sum + (item.kcal || 0), 0);

  const login = (email: string, pass: string) => {
    if (email && pass) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, pass: string) => {
    if (name && email && pass) {
      setUser((prev) => ({ ...prev, name, email }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
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
      ...sessionData,
      id: Date.now(),
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => [newSession, ...prev]);

    // Also update mission progress if active
    if (mission) {
      setMission((prev) => {
        if (!prev) return prev;
        const newCurrent = Math.min(prev.current + 1, prev.target);
        return {
          ...prev,
          current: newCurrent,
          status: newCurrent >= prev.target ? 'COMPLETED' : 'ACTIVE',
        };
      });
    }

    // Update daily quests
    setQuests((prev) =>
      prev.map((q) => {
        if (q.categoryName === 'เวลา') {
          return {
            ...q,
            currentValue: Math.min(q.targetValue, q.currentValue + sessionData.duration),
          };
        }
        if (q.categoryName === 'แคลอรี่') {
          return {
            ...q,
            currentValue: Math.min(q.targetValue, q.currentValue + sessionData.kcal),
          };
        }
        if (q.categoryName === 'เกม') {
          return {
            ...q,
            currentValue: Math.max(q.currentValue, sessionData.maxCombo),
          };
        }
        return q;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
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
