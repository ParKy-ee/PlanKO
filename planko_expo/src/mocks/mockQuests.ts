import { Quest } from '../types';

export const mockQuests: Quest[] = [
  {
    id: 1,
    questName: 'Plank สะสมเวลา',
    targetValue: 300,
    currentValue: 180,
    unit: 'วินาที',
    categoryName: 'เวลา',
  },
  {
    id: 2,
    questName: 'เผาผลาญประจำสัปดาห์',
    targetValue: 500,
    currentValue: 340,
    unit: 'แคลอรี่',
    categoryName: 'แคลอรี่',
  },
  {
    id: 3,
    questName: 'ความแม่นยำของท่า (Accuracy)',
    targetValue: 100,
    currentValue: 85,
    unit: '%',
    categoryName: 'ท่าทาง',
  },
  {
    id: 4,
    questName: 'เล่นโหมดจังหวะ (DDR Combo)',
    targetValue: 50,
    currentValue: 32,
    unit: 'คอมโบ',
    categoryName: 'เกม',
  },
  {
    id: 5,
    questName: 'ออกกำลังกายต่อเนื่อง (Streak)',
    targetValue: 7,
    currentValue: 5,
    unit: 'วัน',
    categoryName: 'สม่ำเสมอ',
  },
  {
    id: 6,
    questName: 'ฝึก Side Plank ท้าทาย',
    targetValue: 120,
    currentValue: 120,
    unit: 'วินาที',
    categoryName: 'เวลา',
  },
  {
    id: 7,
    questName: 'ทำสำเร็จครบทุกท่าพื้นฐาน',
    targetValue: 6,
    currentValue: 4,
    unit: 'ท่า',
    categoryName: 'ท่าทาง',
  },
];

