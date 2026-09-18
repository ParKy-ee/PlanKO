import { Program, Mission } from '../types';

export const mockPrograms: Program[] = [
  {
    id: 1,
    programName: 'สร้างแกนกลาง 7 วัน',
    programType: 'ระดับเริ่มต้น (Beginner Plan)',
    period: 7,
    workDays: [1, 2, 3, 4, 5], // จันทร์ - ศุกร์
    restDays: [6, 7],          // เสาร์ - อาทิตย์
    description: 'โปรแกรมฝึกแพลงก์พื้นฐานเพื่อปลุกกล้ามเนื้อหน้าท้องและปรับสมดุลแนวกระดูกสันหลัง',
    level: 'เริ่มต้น',
    posturesCount: 4,
  },
  {
    id: 2,
    programName: 'เผาผลาญ Core Burning 14 วัน',
    programType: 'ระดับปานกลาง (Intermediate Core Burn)',
    period: 14,
    workDays: [1, 2, 4, 5, 6], // จันทร์, อังคาร, พฤหัส, ศุกร์, เสาร์
    restDays: [3, 7],          // พุธ, อาทิตย์
    description: 'เน้นท่าแพลงก์แบบ Dynamic ผสานจังหวะ DDR เพื่อเพิ่มการเผาผลาญแคลอรี่และสร้างกล้ามเนื้อ',
    level: 'ปานกลาง',
    posturesCount: 6,
  },
  {
    id: 3,
    programName: '30 วัน Plank Master Challenge',
    programType: 'ระดับขั้นสูง (Advanced Endurance)',
    period: 30,
    workDays: [1, 2, 3, 5, 6],
    restDays: [4, 7],
    description: 'ท้าทายขีดจำกัดด้วยแพลงก์ขั้นสูง พร้อมการตรวจสอบความแม่นยำของท่าแบบ Closed-Loop',
    level: 'ขั้นสูง',
    posturesCount: 8,
  },
  {
    id: 4,
    programName: 'ดูแลสุขภาพ Office Syndrome',
    programType: 'เน้นแก้อาการปวดหลัง (Daily Relief)',
    period: 21,
    workDays: [1, 3, 5],
    restDays: [2, 4, 6, 7],
    description: 'เหมาะสำหรับคนนั่งทำงานนาน ช่วยลดอาการปวดหลังส่วนล่างและเสริมกล้ามเนื้อแกนกลาง',
    level: 'เริ่มต้น',
    posturesCount: 4,
  },
];

export const initialMockMission: Mission = {
  id: 101,
  userId: 1,
  programId: 1,
  programName: 'สร้างแกนกลาง 7 วัน',
  startAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  endAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  target: 7,
  current: 3,
  status: 'ACTIVE',
  program: mockPrograms[0],
};
