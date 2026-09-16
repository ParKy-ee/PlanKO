# PlanKO Agent Guide

เปิด `project-status.html` เพื่อดู feature map, diagram, git timeline และ checklist สำหรับ session ถัดไป

## ภาพรวมโปรเจกต์

PlanKO เป็นระบบฝึกแพลงก์/ออกกำลังกายที่ประกอบด้วย backend API, Flutter client และ mockup สำหรับเกมกดปุ่มตามจังหวะและเชื่อมต่อ sensor

```text
PlanKO/
├─ backend/          NestJS + TypeScript + TypeORM + PostgreSQL/Redis
├─ flutter_planko/   Flutter client + Riverpod + Dio/HTTP
├─ API/              Bruno request collection สำหรับทดสอบ API
├─ moc/              Static HTML/JavaScript mockup และ beatmap editor
├─ README.md         เอกสารระดับ root (มีข้อมูลน้อย/encoding อาจอ่านเพี้ยน)
├─ note              โน้ตการออกแบบและการทดลอง
└─ videoplayback.weba ไฟล์สื่อทดลองขนาดใหญ่
```

## Backend

- จุดเริ่มต้นคือ `backend/src/main.ts`; API ใช้ global prefix `api`, URI versioning `v1` และค่าเริ่มต้นพอร์ต `3001` ดังนั้น route ปกติคือ `/api/v1/...`
- `backend/src/app.module.ts` รวม config, database, throttler และ modules จาก `backend/src/modules/index.ts`
- แต่ละ feature ใช้โครงสร้าง NestJS: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `entities/` และไฟล์ทดสอบ `*.spec.ts`
- Feature หลัก: auth/user, program/program-plan, posture/posture-category, mission, plank-session/plank-by-session, quest/quest-category/user-quests, session-performance, home-dashboard และ sensor-socket
- ฐานข้อมูลเป็น PostgreSQL ผ่าน TypeORM; `database.module.ts` โหลด entity อัตโนมัติ ส่วน migration อยู่ที่ `backend/src/database/migrations/`
- `docker-compose.yaml` เตรียม PostgreSQL, Redis และ Adminer; Redis ยังไม่ควรถูกถือว่าเป็น dependency ที่ใช้งานจริงจนกว่าจะตรวจ module/config เพิ่ม
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

## Flutter client

- จุดเริ่มต้นคือ `flutter_planko/lib/main.dart`; แอปครอบด้วย `ProviderScope` และเริ่มที่ route `/login`
- `lib/UI/` เก็บ pages, widgets และ Riverpod providers
- `lib/data/` แบ่งเป็น models, remote/local data sources, repositories และ service API
- `lib/core/` เก็บ constants, `ApiService`, secure token storage และ utility
- หน้าผู้ใช้ปัจจุบันอยู่ใน `lib/UI/pages/user/`; หน้า admin มีอยู่บางส่วนแต่ route ใน `main.dart` ยัง comment ไว้
- API base URL อยู่ที่ `lib/core/constants/API-constant.dart` และ default เป็น `http://localhost:3001/api/v1/`; ก่อนทดสอบบน Android emulator/device ให้ตรวจ host และ network configuration

คำสั่งหลัก:

```powershell
cd flutter_planko
flutter pub get
flutter analyze
flutter test
flutter run
```

## Mockup และ API collection

- `moc/index.html` และ `moc/script.js` เป็น mockup แบบ static ไม่ใช่ source of truth ของ backend หรือ Flutter
- mockup มี Play Mode, Beatmap Editor, Web Audio scoring, keyboard mapping และการเชื่อม WebSocket sensor
- beatmap ใช้ข้อมูลลักษณะ `{ "time": number, "buttonId": string }`; หากแก้ format ต้องพิจารณา compatibility กับ Flutter และ sensor payload
- `API/` เป็น Bruno collection แยกตาม resource ใช้ตรวจสอบ request/response ของ backend

## แนวทางการแก้ไข

1. อ่าน module/controller/service/entity/DTO ที่เกี่ยวข้องก่อนแก้ และค้นหา consumer ใน Flutter, mockup และ `API/` ด้วย `rg`
2. รักษา boundary เดิม: controller รับ request, service ทำ business logic, entity/DTO จัดการ persistence และ validation, provider/repository เป็นชั้นเชื่อมของ Flutter
3. ทำตาม naming และรูปแบบเดิมของโฟลเดอร์ที่กำลังแก้ แม้ใน repo จะมีชื่อสะกดเดิม เช่น `seesion-perfomance`, `quest-by-uesr` และ `perfomance`; อย่ารีเนมกว้าง ๆ หากไม่ได้ขอ
4. เมื่อแก้ API ให้ตรวจทั้ง controller route, DTO, response wrapper, Flutter API path และไฟล์ Bruno ที่เกี่ยวข้อง
5. เพิ่มหรือแก้ test ใกล้กับ behavior ที่เปลี่ยน และรัน validation ที่เหมาะสมก่อนส่งมอบ
6. ใช้ Prettier/ESLint ของ backend และ Dart formatter/analyzer ของ Flutter; หลีกเลี่ยงการแก้ generated/platform files ถ้าไม่จำเป็น
7. ห้ามลบหรือ overwrite ไฟล์สื่อ/ข้อมูลทดลองโดยไม่ยืนยันขอบเขตให้ชัดเจน

## จุดที่ต้องตรวจเป็นพิเศษ

- Backend database module เปิด `synchronize: true` แต่ `data-source.ts` ใช้ `synchronize: false` และ migrations; อย่าเปลี่ยน strategy ฐานข้อมูลโดยไม่ตรวจ environment และผลกระทบ
- Backend auth อยู่ใต้ `/api/v1/auth/*` แต่ constant บางตัวใน Flutter ใช้ `${baseUrl}register` หรือ `${baseUrl}logout`; ตรวจ route จริงก่อนแก้ integration
- API constants บาง resource ต่อ path ด้วย slash เพิ่ม เช่น `${baseUrl}/quest`; ระวัง URL แบบ `v1//quest` และแก้ให้สอดคล้องทั้งระบบเมื่อแตะจุดนั้น
- ตรวจ `git status` ก่อนและหลังทำงานเสมอ งานเดิมของผู้ใช้ต้องไม่ถูกทับ; ณ เวลาสร้างเอกสารมีการแก้ค้างใน `backend/src/modules/sensor-socket/sensor-socket.gateway.ts` และมีไฟล์ `moc/`, `note`, `videoplayback.weba` ที่ยังไม่ tracked
- หากพบความไม่แน่ใจระหว่างเอกสารกับโค้ด ให้ยึดโค้ดและ test ปัจจุบันเป็นหลัก พร้อมแจ้งข้อสันนิษฐานในสรุปงาน
