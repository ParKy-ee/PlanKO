# PlanKO Agent Guide

เปิด `project-status.html` เพื่อดู feature map, diagram, git timeline และ checklist สำหรับ session ถัดไป

## ภาพรวมโปรเจกต์

PlanKO เป็นระบบฝึกแพลงก์และออกกำลังกายอัจฉริยะ (Closed-Loop Biofeedback Plank Training System) ที่ประกอบด้วย backend API, React Native + Expo client, Flutter client และ mockup สำหรับเกมกดปุ่มตามจังหวะและเชื่อมต่อ sensor

```text
PlanKO/
├─ planko_expo/      React Native + Expo client (TypeScript, Mock Data Demo, Closed-Loop Game)
├─ flutter_planko/   Flutter client + Riverpod + Dio/HTTP
├─ backend/          NestJS + TypeScript + TypeORM + PostgreSQL/Redis + Socket.IO
├─ API/              Bruno request collection สำหรับทดสอบ API
├─ moc/              Static HTML/JavaScript mockup และ beatmap editor
├─ INSTRUCTION.md    คู่มือคำแนะนำการรันและการพัฒนาโปรเจกต์
├─ .instructure      คู่มือคำแนะนำสำหรับ Agent/Developer
├─ README.md         เอกสารระดับ root
├─ note              โน้ตการออกแบบและการทดลอง
└─ videoplayback.weba ไฟล์สื่อทดลองขนาดใหญ่
```

## React Native + Expo Client (`planko_expo/`)

- แอปพลิเคชัน React Native + Expo สำหรับการนำเสนอ UI/UX และ Interactive Demo โดยไม่ต้องต่อ API จริง (Mock Data Reactive Store)
- จุดเริ่มต้นอยู่ที่ `planko_expo/App.tsx` ครอบด้วย `SafeAreaProvider` และ `AppProvider` และใช้ `RootNavigator`
- `src/theme/colors.ts` จัดการ Color Palette ให้ตรงตามต้นฉบับ (`#0084FF`, `#007AFF`, `#DFF8FF`, `#EEEDFE`)
- `src/context/AppContext.tsx` จัดการ Mock State แบบ Reactive:
  - แก้ไขน้ำหนัก/ส่วนสูงแล้วอัปเดตทันที
  - เริ่มต้นภารกิจ (Mission Selection)
  - คำนวณแคลอรี่สะสมรวม
  - บันทึกประวัติการออกกำลังกายหลังจากจบเซสชัน
- `src/screens/activity/PlankWorkoutScreen.tsx` เป็นระบบ Closed-Loop Plank Workout Game:
  - ตัวจับเวลานับถอยหลังและช่วงพักกล้ามเนื้อ
  - Smart Mat 16-Point Interactive Grid (L1–L8, R1–R8)
  - เกจวัดสมดุลน้ำหนัก Center of Pressure (CoP) ซ้าย-ขวา
  - Wearable Biometrics HUD (BPM, SpO2)
  - Real-time Biofeedback Alerts (แจ้งเตือนหลังแอ่น / น้ำหนักเอียง)
  - DDR Rhythm Hits & Combo Tracker
  - Workout Result Summary Modal
- ทุกหน้าจอใช้ `SafeAreaView` จาก `react-native-safe-area-context` เพื่อป้องกันปัญหาขอบจอ Status Bar/Notch

คำสั่งหลัก:

```powershell
cd planko_expo
npm run web       # รันบนเบราว์เซอร์
npm start         # รัน QR Code สำหรับ Expo Go
npm run android   # รันบน Android Emulator
npx tsc --noEmit  # Typecheck
```

## Backend (`backend/`)

- จุดเริ่มต้นคือ `backend/src/main.ts`; API ใช้ global prefix `api`, URI versioning `v1` และค่าเริ่มต้นพอร์ต `3001` ดังนั้น route ปกติคือ `/api/v1/...`
- `backend/src/app.module.ts` รวม config, database, throttler และ modules จาก `backend/src/modules/index.ts`
- แต่ละ feature ใช้โครงสร้าง NestJS: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `entities/` และไฟล์ทดสอบ `*.spec.ts`
- Feature หลัก: auth/user, program/program-plan, posture/posture-category, mission, plank-session/plank-by-session, quest/quest-category/user-quests, session-performance, home-dashboard และ sensor-socket
- ฐานข้อมูลเป็น PostgreSQL ผ่าน TypeORM; `database.module.ts` โหลด entity อัตโนมัติ ส่วน migration อยู่ที่ `backend/src/database/migrations/`
- `docker-compose.yaml` เตรียม PostgreSQL, Redis และ Adminer
- `sensor-socket` ใช้ Socket.IO events `sensor:data` และ `data:body-sensor` และ broadcast `sensor:updated` / `body-sensor:updated`
- Global behavior ที่ต้องรักษา: `ValidationPipe`, `TransformInterceptor`, `HttpExceptionFilter`, cookie parser, CORS และ throttling

คำสั่งหลัก:

```powershell
cd backend
npm install
npm run start:dev
npm run build
npm test
npm run test:e2e
npm run migration:run
npm run seed
```

ใช้ `.env.example` เป็นตัวตั้งต้น และห้าม commit `backend/.env`, secret, token หรือข้อมูลจริง

## Flutter Client (`flutter_planko/`)

- จุดเริ่มต้นคือ `flutter_planko/lib/main.dart`; แอปครอบด้วย `ProviderScope` และเริ่มที่ route `/login`
- `lib/UI/` เก็บ pages, widgets และ Riverpod providers
- `lib/data/` แบ่งเป็น models, remote/local data sources, repositories และ service API
- `lib/core/` เก็บ constants, `ApiService`, secure token storage และ utility
- หน้าผู้ใช้ปัจจุบันอยู่ใน `lib/UI/pages/user/`; หน้า admin มีอยู่บางส่วนแต่ route ใน `main.dart` ยัง comment ไว้
- API base URL อยู่ที่ `lib/core/constants/API-constant.dart` และ default เป็น `http://localhost:3001/api/v1/`

คำสั่งหลัก:

```powershell
cd flutter_planko
flutter pub get
flutter analyze
flutter test
flutter run
```

## Mockup และ API Collection

- `moc/index.html` และ `moc/script.js` เป็น mockup แบบ static ไม่ใช่ source of truth ของ backend หรือ Flutter
- mockup มี Play Mode, Beatmap Editor, Web Audio scoring, keyboard mapping และการเชื่อม WebSocket sensor
- beatmap ใช้ข้อมูลลักษณะ `{ "time": number, "buttonId": string }`
- `API/` เป็น Bruno collection แยกตาม resource ใช้ตรวจสอบ request/response ของ backend

## แนวทางการแก้ไขสำหรับ Agent

1. อ่าน module/controller/service/entity/DTO ที่เกี่ยวข้องก่อนแก้ และค้นหา consumer ใน React Native, Flutter, mockup และ `API/` ด้วย `grep_search`
2. รักษา boundary เดิม: controller รับ request, service ทำ business logic, entity/DTO จัดการ persistence และ validation
3. ใน `planko_expo` ให้ใช้ `SafeAreaView` จาก `react-native-safe-area-context` เสมอ และปุ่มย้อนกลับให้มี fallback `canGoBack()`
4. ตรวจสอบ `git status` ก่อนและหลังทำงานเสมอ งานเดิมของผู้ใช้ต้องไม่ถูกทับ
5. ใช้ Prettier/ESLint ของ backend, TypeScript checker ของ `planko_expo`, และ Dart analyzer ของ Flutter
