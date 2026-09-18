# PlanKO Instructions & Development Guide

เอกสารคู่มือแนวทางการพัฒนา การรัน และสถาปัตยกรรมระบบ PlanKO สำหรับนักพัฒนาและ AI Agent

---

## 1. ภาพรวมโครงสร้างโปรเจกต์ (Project Structure)

```text
PlanKO/
├── planko_expo/         # Mobile App: React Native + Expo (TypeScript + Mock Data Demo)
├── flutter_planko/      # Mobile App: Flutter client เดิม (Riverpod + Dio)
├── backend/             # Backend API: NestJS + TypeORM + PostgreSQL/Redis + Socket.IO
├── moc/                 # Static Mockup: DDR Beatmap Editor & Web Audio prototype
├── API/                 # Bruno API request collections
├── agent.md             # Agent Guide & System Context
├── INSTRUCTION.md       # Developer & Setup Instructions
├── run-web.bat          # 1-Click launcher สำหรับ Web
├── run-expo.bat         # 1-Click launcher สำหรับ Expo Go (Mobile QR Code)
└── run-android.bat      # 1-Click launcher สำหรับ Android Emulator
```

---

## 2. การทำงานของ `planko_expo` (React Native + Expo)

แอปพลิเคชัน React Native + Expo ถูกพัฒนาขึ้นเพื่อจำลอง UX/UI และฟีเจอร์ของระบบฝึกแพลงก์อัจฉริยะ (Closed-Loop Training) โดยเน้นการ Demo ที่สมบูรณ์แบบโดยไม่ต้องต่อ API/WS จริง

### โครงสร้างภายใน `planko_expo/src/`:
- **`theme/colors.ts`**: กำหนดชุดสีหลัก (`#0084FF`, `#007AFF`, `#DFF8FF`, `#EEEDFE`) ให้ตรงกับต้นฉบับ
- **`types/index.ts`**: นิยามข้อมูล `User`, `Posture`, `Program`, `Mission`, `Quest`, `SessionPerformance`, `BeatmapNote`, `BiofeedbackState`
- **`mocks/`**: ชุดข้อมูลจำลองภาษาไทย (User, Programs, Postures, Quests, History, Beatmap)
- **`context/AppContext.tsx`**: State Store สำหรับการจำลองข้อมูลแบบ Reactive (แก้ไขน้ำหนัก, บันทึกการฝึก, เพิ่มแคลอรี่สะสม)
- **`navigation/`**:
  - `RootNavigator.tsx`: สลับระหว่าง Auth flow และ MainTabs
  - `TabNavigator.tsx`: 4 แท็บหลักด้านล่าง (โฮม, กิจกรรม, ปฏิทิน, โปรไฟล์)
- **`screens/`**:
  - `auth/`: `LoginScreen`, `RegisterScreen` (มีปุ่ม Guest Mode สำหรับข้ามไปดู Demo ทันที)
  - `onboarding/`: `UserDetailScreen` (กรอกสัดส่วนร่างกาย), `MissionPlanScreen` (เลือกโปรแกรมฝึก)
  - `home/`: `HomeScreen` (แคลอรี่สะสม + Progress Ring, เควสต์พัฒนาการ, คลังท่าฝึก)
  - `activity/`: `ActivityScreen`, `CustomWorkoutScreen`, `PlankWorkoutScreen` (เกมฝึกแพลงก์ Closed-loop)
  - `calendar/`: `CalendarScreen` (ปฏิทิน พ.ศ. + ไฮไลท์วันฝึกและวันสำเร็จ)
  - `posture/`: `PostureListScreen`, `PostureDetailScreen` (คลังท่าฝึกและระดับความยาก)
  - `profile/`: `ProfileScreen` (สถิติร่างกาย + Modal แก้ไขน้ำหนัก + ประวัติการฝึกย้อนหลัง)

---

## 3. คำสั่งการรันและการทดสอบ (Run Commands)

### A. รันแอป `planko_expo`
```powershell
cd planko_expo

# รันบน Web Browser
npm run web

# รันสำหรับสแกนผ่านแอป Expo Go บนมือถือ
npm start

# รันบน Android Emulator
npm run android

# ตรวจสอบ TypeScript Typecheck
npx tsc --noEmit
```

### B. รัน Backend (`backend/`)
```powershell
cd backend
npm install
npm run start:dev
npm run build
npm test
```

### C. รัน Flutter Client (`flutter_planko/`)
```powershell
cd flutter_planko
flutter pub get
flutter run
```

---

## 4. กฎและแนวทางการพัฒนาสำหรับ Agent / Developer

1. **SafeArea & Insets**: ใน `planko_expo` ต้องนำเข้า `SafeAreaView` จาก `react-native-safe-area-context` เสมอ เพื่อป้องกันการทับซ้อนกับ Status Bar และ Notch บน Android / Web / iOS
2. **Navigation Back Handling**: เมื่อสร้างปุ่มย้อนกลับ ให้ใช้ `handleBack` พร้อมตรวจสอบ `navigation.canGoBack()` และใส่ `hitSlop` เพื่อความแม่นยำในการสัมผัส
3. **Mock Data Isolation**: เมื่อเพิ่มฟีเจอร์ใหม่ ให้จัดการ State ผ่าน `AppContext.tsx` เพื่อให้ทุกหน้าจอซิงค์ข้อมูลกันได้แบบเรียลไทม์
4. **Preserve Working Changes**: ตรวจสอบ `git status` เสมอ และหลีกเลี่ยงการทับไฟล์ที่ยังไม่ได้ commit ของผู้ใช้
