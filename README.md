# Digital Asset Store
![Project Banner](https://github.com/user-attachments/assets/5c3932e6-86d8-4611-8980-4f8ea0eba7dc)
> **Web Application สำหรับซื้อขายสินค้าดิจิทัล** ช่วยให้คุณเข้าถึงสินค้าดิจิทัลที่ต้องการไม่ว่าจะเป็น E-Book, Source Code หรืออื่นๆ ได้อย่างสะดวกรวดเร็ว

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%234169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-%232D3748.svg?style=for-the-badge&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-%233ECF8E.svg?style=for-the-badge&logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-%236C47FF.svg?style=for-the-badge&logo=clerk&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233E67B1.svg?style=for-the-badge&logo=zod&logoColor=white)

🔗 **Live Demo:** -

---

## Features (คุณสมบัติเด่น)

### User
- View product
- Search & Filter product
- Manage cart
- Checkout
- Download file -after paid
- View order history

### Admin
- Admin Dashboard
- Manage Product (CRUD)
- Manage Product Category (CRUD)
- View orders & users

---

## Database Design (ER Diagram)
<img width="1413" height="1011" alt="Untitled" src="https://github.com/user-attachments/assets/55e2e75d-95ad-4b52-86a0-5c0c94c78c21" />

> Designed by Thanapat Malikaew based on real world.

---

## Installation & Setup
**สิ่งที่ต้องมีก่อนเริ่ม:**
1. Vs Code
2. Node.js
3. PostgreSQL
4. Ngrok
5. Stripe CLI

### การติดตั้ง
1. Clone โปรเจคลงเครื่อง Local

```bash
git clone https://github.com/Serista3/digital-asset-store.git

```

2. ติดตั้ง Dependencies ลงในโปรเจคทั้งหมด

```bash
npm install

```

### Config Environment
**หมายเหตุ:** 
เนื่องจากไม่สามารถเปิดเผยข้อมูลได้ทั้งหมด กรุณาติดต่อมาที่ email: stacla5282@gmail.com เพื่อขอเข้าร่วมการพัฒนาโปรเจคครับ 🙏

```bash
# NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
# NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
# NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
# NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# ข้อมูล Environment Variables อื่นๆ ที่จำเป็นต้องตั้งค่าเพิ่มเติม 
# กรุณาติดต่อตามอีเมลในหมายเหตุด้านบนครับ

```

### Prisma เบื้องต้น

1. อัปเดตคำสั่งใน @prisma/client ให้เป็นปัจจุบัน

```bash
npx prisma generate

```

2. Migrate ตารางขึ้นไปบน Supabase / Database

```bash
npx prisma db push

```

3. เปิดดูข้อมูลใน Database แบบ Realtime

```bash
npx prisma studio

```

### เปิด localhost:3000 เป็น Online ด้วย Ngrok

```bash
ngrok http 3000

```

### เชื่อมต่อ Stripe Webhook ไปยัง localhost:3000

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe

```


### Start Development Server

```bash
npm run dev

```

---

## ทดสอบกับ Docker

### Docker เบื้องต้น

1. Build Container หลายตัวพร้อมกัน โดยให้ทำงานอยู่บนพื้นหลัง

```bash
docker-compose up --build -d

```

2. หยุดและลบ Container ทั้งหมดที่กำลังทำงานอยู่

```bash
docker-compose down -v

```

**หมายเหตุ:** คำสั่ง -v จะทำการลบข้อมูลใน Volume ด้วย หากไม่ต้องการให้ข้อมูล Database หาย ให้ใช้แค่ docker-compose down

---

## ติดต่อผู้พัฒนา
หากมีคำถามเกี่ยวกับการพัฒนาโปรเจคหรือการใช้งาน สามารถติดต่อได้ที่:
- Email: stacla5282@gmail.com
