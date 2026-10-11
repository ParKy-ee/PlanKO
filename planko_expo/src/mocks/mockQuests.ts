import { Quest } from '../types';

export const mockQuests: Quest[] = [
  {
    id: 1,
    questName: 'Accumulate Plank Time',
    targetValue: 300,
    currentValue: 180,
    unit: 'sec',
    categoryName: 'Time',
  },
  {
    id: 2,
    questName: 'Weekly Calorie Burn',
    targetValue: 500,
    currentValue: 340,
    unit: 'kcal',
    categoryName: 'Calories',
  },
  {
    id: 3,
    questName: 'Posture Accuracy',
    targetValue: 100,
    currentValue: 85,
    unit: '%',
    categoryName: 'Posture',
  },
  {
    id: 4,
    questName: 'Rhythm DDR Combo',
    targetValue: 50,
    currentValue: 32,
    unit: 'combos',
    categoryName: 'Game',
  },
  {
    id: 5,
    questName: 'Workout Streak',
    targetValue: 7,
    currentValue: 5,
    unit: 'days',
    categoryName: 'Consistency',
  },
  {
    id: 6,
    questName: 'Side Plank Challenge',
    targetValue: 120,
    currentValue: 120,
    unit: 'sec',
    categoryName: 'Time',
  },
  {
    id: 7,
    questName: 'Master All Basic Poses',
    targetValue: 6,
    currentValue: 4,
    unit: 'poses',
    categoryName: 'Posture',
  },
];

