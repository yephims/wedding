# Весільне запрошення — Рулік & Зоря

Next.js 15 SPA, готовий до деплою на Vercel.

## Деплой на Vercel

1. Завантажте папку `wedding-app` на GitHub (або GitLab)
2. Зайдіть на [vercel.com](https://vercel.com) → New Project → виберіть репозиторій
3. Framework: **Next.js** (визначиться автоматично)
4. Натисніть **Deploy** — все 🎉

## Локальний запуск

```bash
npm install
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000)

## Форма RSVP

Відповіді логуються в `/api/rsvp`.  
Щоб отримувати їх на email — підключіть [Resend](https://resend.com) або [Nodemailer] в `src/app/api/rsvp/route.ts`.
