import { Posture, Program } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  UserDetail: undefined;
  MissionPlan: undefined;
  MainTabs: { screen?: keyof MainTabParamList };
  PostureList: undefined;
  PostureDetail: { posture: Posture };
  CustomWorkout: undefined;
  WorkoutHistory: undefined;
  Settings: undefined;
  ReadyToPlay?: {
    mode?: 'planned' | 'custom';
    program?: Program;
    durationPerPosture?: number;
    restTime?: number;
    levelIndex?: number;
    posture?: Posture;
  };
  PlankWorkout: {
    mode: 'planned' | 'custom';
    program?: Program;
    durationPerPosture?: number;
    restTime?: number;
    levelIndex?: number;
    trackTitle?: string;
    difficulty?: 'Easy' | 'Normal' | 'Hard';
    bpm?: number;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Activity: undefined;
  Calendar: undefined;
  Profile: undefined;
};
