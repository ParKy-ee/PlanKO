export interface User {
  id: number;
  name: string;
  email: string;
  weight: number;
  height: number;
  age: number;
  gender: string; // 'ผู้ชาย' | 'ผู้หญิง' | 'อื่นๆ' | 'male' | 'female' | 'other'
  avatarUrl?: string;
}

export interface PostureCategory {
  id: number;
  name: string;
}

export interface Posture {
  id: number;
  name: string;
  description: string;
  benefit: string;
  difficulty: 'easy' | 'medium' | 'hard';
  postureCategory?: PostureCategory;
  iconName: string;
  imageUrl?: string;
  targetDurationSeconds?: number;
}

export interface Program {
  id: number;
  programName: string;
  programType: string;
  period: number; // e.g., 7, 14, 30 days
  workDays: number[]; // 1 = จันทร์, ..., 7 = อาทิตย์
  restDays: number[];
  description: string;
  level: 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง';
  posturesCount: number;
}

export interface Mission {
  id: number;
  userId: number;
  programId: number;
  programName: string;
  startAt: string;
  endAt: string;
  target: number; // total days target
  current: number; // completed days
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  program?: Program;
}

export interface Quest {
  id: number;
  questName: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  categoryName: string;
}

export interface SessionPerformance {
  id: number;
  userId: number;
  planName: string;
  score: number;
  duration: number; // in seconds
  kcal: number;
  accuracy: number; // in percentage e.g. 95
  maxCombo: number;
  avgBpm: number;
  postureHits: number;
  createdAt: string; // ISO date string
}

export interface BeatmapNote {
  id: number;
  time: number; // seconds into song
  buttonId: string; // 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'
  hit?: boolean;
}

export interface BiofeedbackState {
  isSafe: boolean;
  statusText: string;
  statusType: 'normal' | 'warning' | 'alert' | 'success';
  leftPressure: number; // 0 - 100%
  rightPressure: number; // 0 - 100%
  copOffset: number; // -1.0 (far left) to +1.0 (far right), 0 = balanced
  currentBpm: number;
  currentSpO2: number;
  activePads: string[]; // e.g. ['L2', 'L3', 'R2', 'R3']
}
