import { Program, Mission } from '../types';

export const mockPrograms: Program[] = [
  {
    id: 1,
    programName: '7-Day Core Foundation',
    programType: 'Beginner Plan',
    period: 7,
    workDays: [1, 2, 3, 4, 5], // Monday - Friday
    restDays: [6, 7],          // Saturday - Sunday
    description: 'Fundamental plank routine to awaken your abdominal muscles and align spinal posture.',
    level: 'Beginner',
    posturesCount: 4,
  },
  {
    id: 2,
    programName: '14-Day Core Burning',
    programType: 'Intermediate Core Burn',
    period: 14,
    workDays: [1, 2, 4, 5, 6], // Mon, Tue, Thu, Fri, Sat
    restDays: [3, 7],          // Wed, Sun
    description: 'Dynamic plank movements combined with DDR rhythms to boost calorie burn and tone core muscles.',
    level: 'Intermediate',
    posturesCount: 6,
  },
  {
    id: 3,
    programName: '30-Day Plank Master Challenge',
    programType: 'Advanced Endurance',
    period: 30,
    workDays: [1, 2, 3, 5, 6],
    restDays: [4, 7],
    description: 'Push your limits with advanced planks featuring real-time Closed-Loop biofeedback alignment.',
    level: 'Advanced',
    posturesCount: 8,
  },
  {
    id: 4,
    programName: 'Office Syndrome Relief',
    programType: 'Daily Relief',
    period: 21,
    workDays: [1, 3, 5],
    restDays: [2, 4, 6, 7],
    description: 'Ideal for desk workers. Alleviates lower back pain and strengthens core stabilizing muscles.',
    level: 'Beginner',
    posturesCount: 4,
  },
];

export const initialMockMission: Mission = {
  id: 101,
  userId: 1,
  programId: 1,
  programName: '7-Day Core Foundation',
  startAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  endAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  target: 7,
  current: 3,
  status: 'ACTIVE',
  program: mockPrograms[0],
};
