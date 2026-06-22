# 🚀 Project+ Exam Simulator — ระบบฝึกทำข้อสอบเสมือนจริง (CompTIA Project+)

[Live Demo (GitHub Pages)](https://sleepingsong.github.io/exam_test_projectplus/)  
![Live](https://img.shields.io/badge/Live-GitHub%20Pages-blue)

สวัสดี! นี่คือเว็บแอปจำลองข้อสอบสำหรับเตรียมสอบ **CompTIA Project+** — ถูกออกแบบให้เล่นได้ทันทีในเบราว์เซอร์ โดยเน้นประสบการณ์ที่ลื่นไหล สวยงาม และใช้งานจริงเหมือนการสอบจริง

A lightweight, browser-based exam simulator for CompTIA Project+ — fast, modern UI, and packed with practical features to sharpen your exam skills.

---

## ✨ ทำไมโปรเจกต์นี้ถึง "ว้าว"

- ดีไซน์สไตล์ Glassmorphism ที่สวยล้ำ ให้ความรู้สึกพรีเมียมโดยไม่ต้องพึ่งเฟรมเวิร์กใหญ่ ๆ
- ฟีเจอร์ครบ: สุ่มข้อและตัวเลือก, โหมดมืด/สว่าง, เวลาในการทำข้อ, คำอธิบายคำตอบ และสรุปผลหลังทำข้อสอบ
- ทำงานแบบ Offline ได้ด้วยไฟล์สำรอง (fallback) — เปิด `index.html` โดยตรงก็ใช้งานได้
- เบามาก (Vanilla JS + CSS) — เหมาะสำหรับฝึกซ้อมทันทีหรือปรับแต่งต่อได้

---

## 🌟 ฟีเจอร์เด่น

- Premium Glassmorphism UI — โทนสีสวย เรียบหรู และอ่านง่าย
- Bilingual Font Stack — รองรับภาษาไทย (Sarabun) และอังกฤษ (Inter)
- Dark / Light Mode — สลับธีมได้ทันทีด้วยปุ่มลอย
- Flexible Exam Lengths — เลือกชุดข้อหรือทำทั้งชุดได้ตามต้องการ
- Shuffle Mode — สับคำถามและตัวเลือกให้เหมือนการสุ่มจริง
- Real-time Feedback & Explanations — ตรวจคำตอบและดูคำอธิบายได้ทันที
- Timer & Metrics — จับเวลาและสรุปคะแนนเมื่อทำเสร็จ
- CORS Fallback — มีไฟล์ `question-data.js` เป็น fallback หากไม่สามารถ fetch `question.json`

---

## 🧭 เทคโนโลยีที่ใช้

- HTML5 (Semantic)
- CSS3 (Vanilla + CSS Variables) — Glassmorphism, theme variables
- JavaScript (ES6) — Logic ของข้อสอบ, timer, scoring
- Google Fonts: Inter (EN), Sarabun (TH)
- FontAwesome (v6.4.0)

---

## 📂 โครงสร้างไฟล์ (ย่อ)

```text
├── index.html          # หน้าเว็บหลัก
├── style.css           # สไตล์ทั้งหมด (Glassmorphism, ธีม)
├── app.js              # ตรรกะของแอป (Timer, Theme, Questions)
├── question-data.js    # ข้อมูลสำรอง (fallback) เป็นตัวแปร JS
├── question.json       # ข้อมูลข้อสอบจริง (JSON) สำหรับ fetch
└── README.md           # คำอธิบายโปรเจกต์ (ไฟล์นี้)
```

---

## 🚀 เริ่มใช้งาน (Quick Start)

วิธีที่ 1 — เปิดผ่าน GitHub Pages (แนะนำ):

ไปที่: https://sleepingsong.github.io/exam_test_projectplus/

วิธีที่ 2 — รันแบบ Local (ง่ายสุด):

1. ดาวน์โหลดหรือ clone โปรเจกต์
2. เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ (ดับเบิ้ลคลิก) — ถ้าเจอปัญหา CORS ให้ใช้วิธีถัดไป

วิธีที่ 3 — รันผ่าน HTTP server (แนะนำเมื่อทดสอบการ fetch):

- ด้วย Python:

```bash
python -m http.server 8000
# แล้วเปิด http://localhost:8000
```

- หรือด้วย Node (http-server):

```bash
npx http-server -p 8000
```

---

## 🛠️ การปรับแต่ง / พัฒนา

- เพิ่ม/แก้ไขชุดคำถาม: แก้ `question.json` หรือ `question-data.js` (fallback)
- ปรับธีม: แก้ตัวแปร CSS ใน `style.css`
- ฟีเจอร์ใหม่: โค้ดทั้งหมดเป็น Vanilla JS จึงเข้าใจและแก้ไขง่าย

---

## 🙌 ร่วมพัฒนา

ต้องการเสนอไอเดียหรือส่ง PR มั้ย? ยินดีต้อนรับทุกการมีส่วนร่วม — เปิด Issue หรือ Pull Request พร้อมคำอธิบายสิ่งที่ต้องการเปลี่ยนแปลง

---

## ℹ️ ผู้พัฒนา

Sleepingsong — ดูตัวอย่างและทดลองใช้งานจาก GitHub Pages: https://sleepingsong.github.io/exam_test_projectplus/

---

หากอยากให้ README ดูเท่มากขึ้น (เช่น เพิ่ม GIF ตัวอย่างการใช้งาน, ใส่ screenshot, หรือ badge เพิ่มเติม) บอกมาได้เลย — ผมช่วยเพิ่มให้ทันที!