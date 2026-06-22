# Project+ Exam Simulator (ระบบฝึกทำข้อสอบเสมือนจริง)

**Webpage / หน้าเว็บไซต์:** [https://sleepingsong.github.io/exam_test_projectplus/](https://sleepingsong.github.io/exam_test_projectplus/)

ระบบฝึกทำข้อสอบเสมือนจริงสำหรับใบรับรอง **CompTIA Project+** ออกแบบมาเพื่อให้ผู้ใช้สามารถจำลองการทำข้อสอบได้จริงผ่านหน้าเว็บเบราว์เซอร์ พร้อมระบบสุ่มคำถาม/คำตอบ, เฉลยคำอธิบายอย่างละเอียด และระบบจับเวลาเพื่อเตรียมพร้อมสำหรับการสอบจริง

A web-based exam simulator for the **CompTIA Project+** certification, designed to let users practice mock exams directly in the browser with features like shuffling, explanations, a timer, and performance stats.

---

## 🌟 Features (ฟีเจอร์เด่น)

*   **Premium Glassmorphism UI:** ดีไซน์หน้าเว็บสไตล์กระจกเงา (Glassmorphism) สวยงาม ทันสมัย สะบายตา และรองรับหน้าจอทุกขนาด (Responsive Design)
*   **Bilingual Font Stack:** ระบบการจัดลำดับฟอนต์แบบพิเศษ (Font Stack) โดยแสดงผลภาษาอังกฤษด้วยฟอนต์ **Inter** และภาษาไทยด้วยฟอนต์ **Sarabun** เพื่อความสวยงามและการอ่านที่สมบูรณ์แบบ
*   **Dark Mode & Light Mode:** รองรับการสลับโหมดมืด (Dark Mode) และโหมดสว่าง (Light Mode) ด้วยปุ่มกดลอยตัวที่ตอบสนองอย่างรวดเร็ว (Micro-interactions) พร้อมบันทึกสถานะลงในตัวเบราว์เซอร์ (`localStorage`) โดยอัตโนมัติ
*   **Flexible Exam Lengths:** สามารถเลือกทำข้อสอบเป็นชุดๆ (ชุดละ 40 ข้อ) หรือทำข้อสอบทั้งหมดพร้อมกันได้
*   **Shuffle Mode:** มีตัวเลือกสำหรับสุ่มลำดับข้อสอบและสุ่มลำดับตัวเลือกตอบ (A-D) เพื่อป้องกันการจดจำตำแหน่งคำตอบ
*   **Real-time Feedback & Explanations:** ตรวจคำตอบได้ทันทีในแต่ละข้อ พร้อมมีบอร์ดเปิดเผยคำอธิบายอย่างละเอียด ทั้งเหตุผลที่ตอบถูก และเหตุผลที่ตัวเลือกอื่นผิด
*   **Timer & Metrics:** ระบบจับเวลาใช้งานจริง พร้อมสรุปคะแนนเมื่อทำเสร็จ รวมถึงสถิติจำนวนข้อที่ตอบถูก/ตอบผิด และเวลาที่ใช้ทั้งหมดอย่างละเอียด
*   **CORS Fallback Capability:** รองรับการเปิดใช้งานแบบ Local (ดับเบิ้ลคลิกไฟล์ `index.html` ตรงๆ) ได้โดยไม่ต้องรันเซิร์ฟเวอร์ โดยระบบจะดึงข้อมูลสำรองจากไฟล์ `question-data.js` แทนหากมีข้อจำกัดด้านความปลอดภัยของเบราว์เซอร์ (CORS)

---

## 🛠️ Technology Stack (เทคโนโลยีที่ใช้)

*   **HTML5:** โครงสร้างเว็บแบบ Semantic HTML รองรับการเข้าถึงได้ดี
*   **CSS3:** การจัดสไตล์แบบ Vanilla CSS ที่ยืดหยุ่นสูง ใช้ตัวแปร CSS Variables ในการบริหารจัดการธีมสี พร้อมแอนิเมชันลื่นไหล
*   **JavaScript (ES6):** ควบคุมตรรกะการทำข้อสอบ, การนับเวลา, การคำนวณคะแนน และการจัดการธีมสีแบบไม่ขึ้นกับไลบรารีภายนอก (Vanilla JS)
*   **Google Fonts:** ฟอนต์ `Inter` (อังกฤษ) และ `Sarabun` (ไทย)
*   **FontAwesome (v6.4.0):** ไอคอนประกอบหน้าเว็บ

---

## 📂 File Structure (โครงสร้างไฟล์)

```text
├── index.html          # โครงสร้างหน้าเว็บหลักของโปรแกรมจำลองข้อสอบ
├── style.css           # สไตล์ชีททั้งหมด (การจัดเลย์เอาต์, Glassmorphism, ธีมสี, และสไตล์เฉพาะใน Light Mode)
├── app.js              # ตรรกะควบคุมเกมและสถานะของแอป (Timer, Theme logic, Question logic)
├── question-data.js    # ข้อมูลข้อสอบแบบสำรอง (Fallback) ในรูปแบบตัวแปร JavaScript
├── question.json       # ข้อมูลข้อสอบจริง (JSON format) สำหรับใช้ดึงผ่าน API fetch
└── README.md           # คำอธิบายรายละเอียดโปรเจกต์
```

---

## 🚀 How to Run (วิธีการใช้งาน)

### วิธีที่ 1: เล่นผ่าน GitHub Pages (แนะนำ)
เข้าสู่ลิงก์หน้าเว็บไซต์โดยตรงที่: [https://sleepingsong.github.io/exam_test_projectplus/](https://sleepingsong.github.io/exam_test_projectplus/)

### วิธีที่ 2: รันในเครื่องของตนเอง (Local Run)
1. ดาวน์โหลดหรือ Clone โฟลเดอร์โปรเจกต์นี้ลงบนคอมพิวเตอร์ของคุณ
2. ดับเบิ้ลคลิกเปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ที่คุณต้องการได้ทันที (ระบบจะสลับไปดึงข้อมูลคำถามจำลองจาก `question-data.js` โดยอัตโนมัติหากเว็บเซิร์ฟเวอร์ไม่ได้เปิดใช้งาน)
