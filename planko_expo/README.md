# PlanKO Mobile (React Native + Expo Demo)

แอปพลิเคชันฝึกแพลงก์อัจฉริยะและระบบเกมจังหวะ Closed-Loop Biofeedback พัฒนาด้วย **React Native + Expo** พร้อมระบบ **Mock Data** และ **Interactive Demo** สมบูรณ์แบบ 100%

---

## 📱 วิธีการรันโปรเจกต์ (How to Run)

เข้าสู่โฟลเดอร์โปรเจกต์:
```bash
cd planko_expo
```

### 1. รันบน Web Browser (แนะนำสำหรับการทดสอบอย่างรวดเร็ว)
```bash
npm run web
# หรือ
npx expo start --web
```

### 2. รันบนโทรศัพท์มือถือผ่าน Expo Go (iOS / Android)
```bash
npm start
# หรือ
npx expo start
```
- สแกน QR Code ด้วยแอป **Expo Go** (Android) หรือ Camera App (iOS)

---

## 🌟 ฟีเจอร์และหน้าจอทั้งหมดในระบบ (Features Overview)

| โมดูล | หน้าจอ / Feature | รายละเอียด UX/UI และการทำงาน |
| :--- | :--- | :--- |
| **Authentication** | `LoginScreen`, `RegisterScreen` | ฟอร์มโทนสีฟ้าสดใส (`#0084FF`) ซ่อน/แสดงรหัสผ่าน พร้อมปุ่ม Guest Mode เข้าสู่ระบบทันที |
| **Onboarding** | `UserDetailScreen`, `MissionPlanScreen` | - กรอกสัดส่วนร่างกาย (น้ำหนัก, ส่วนสูง, อายุ, เพศ)<br>- เลือกโปรแกรมภารกิจการฝึก พร้อม Pop-up Dialog ดูรายละเอียดวันฝึก/วันพัก |
| **โฮม (Home)** | `HomeScreen` | - การ์ดแคลอรี่รวมพร้อม Circular Progress Ring<br>- วงแหวนความคืบหน้ารายเควสต์ (Quest Carousel)<br>- หมวดหมู่และรายการท่าฝึกแบบ Pill Filters |
| **กิจกรรม (Activity)** | `ActivityScreen`, `CustomWorkoutScreen` | - การ์ด "ตามแผนการ" และ "กำหนดเอง"<br>- ตัวปรับระดับความยาก (Step Slider), เวลาต่อท่า, เวลาพัก, และเปิด/ปิดพรีวิวท่า |
| **ปฏิทิน (Calendar)** | `CalendarScreen` | ปฏิทิน พ.ศ. (+543) ไฮไลท์วันสำเร็จ (สีฟ้า) / วันที่มีตารางฝึก (สีเทา) และการ์ดเริ่มเซสชันประจำวัน |
| **คลังท่าฝึก (Postures)** | `PostureListScreen`, `PostureDetailScreen` | รายการท่าฝึกแพลงก์ กรองตามระดับความยาก (ง่าย/ปานกลาง/ยาก), รายละเอียดกล้ามเนื้อ และประโยชน์ |
| **โปรไฟล์ (Profile)** | `ProfileScreen` | ข้อมูลผู้ใช้, การ์ดความคืบหน้าภารกิจ, สถิติร่างกาย 4 ช่องพร้อม Modal แก้ไขน้ำหนักได้จริง, และประวัติการฝึกย้อนหลัง |
| **Interactive Workout (Closed-Loop Demo)** | `PlankWorkoutScreen` | - ตัวจับเวลานับถอยหลังพร้อมสลับช่วงพักกล้ามเนื้อ<br>- **Smart Mat 16-Point Interactive Grid (L1-L8, R1-R8)**<br>- **CoP Weight Balance Gauge (ซ้าย-ขวา %)**<br>- **Wearable Live Biometrics (BPM / SpO2)**<br>- **Real-time Biofeedback Alerts (แจ้งเตือนหลังแอ่น / น้ำหนักเอียง)**<br>- **DDR Rhythm Hits & Combo Tracker (Perfect / Good)**<br>- **Workout Result Summary Modal** (บันทึกลงประวัติและเพิ่มแคลอรี่สะสมในหน้าโฮมแบบเรียลไทม์) |
