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
  PlankWorkout: {
    mode: 'planned' | 'custom';
    program?: Program;
    durationPerPosture?: number;
    restTime?: number;
    levelIndex?: number;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Activity: undefined;
  Calendar: undefined;
  Profile: undefined;
};
