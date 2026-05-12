# MikiJapan MenuSync

หน้า LIFF สำหรับอัปเดต Rich Menu ของลูกค้าให้ตรงกับสถานะจริงในระบบ

## การทำงาน

เมื่อเปิดผ่าน LINE LIFF หน้านี้จะ:

1. ดึง `lineUserId` และ `lineIdToken` จาก LIFF
2. เรียก API `POST /auth/rich-menu/sync`
3. API ตรวจสถานะใน database แล้ว link Rich Menu ที่ถูกต้อง
4. แสดงผลว่าเมนูถูกอัปเดตแล้ว
5. ปิดหน้าต่าง LIFF อัตโนมัติเมื่ออัปเดตสำเร็จ

## สถานะ Rich Menu

- มี member แล้ว -> Member Rich Menu
- รอตรวจสอบ -> Verify Rich Menu
- ไม่ผ่านเกณฑ์ -> Rejected Rich Menu
- ยังไม่มีข้อมูล -> Register Rich Menu

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS ผ่าน `@tailwindcss/vite`
- LINE LIFF SDK

## Environment

```bash
VITE_API_BASE_URL=https://mikijapan-api-production-7e32.up.railway.app/api
VITE_LIFF_ID=<menusync-liff-id>
```

## Run

Use Node.js 24.x.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
