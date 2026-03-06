<div align="center">

```
██╗███╗   ██╗██╗   ██╗ ██████╗ ██╗ ██████╗███████╗
██║████╗  ██║██║   ██║██╔═══██╗██║██╔════╝██╔════╝
██║██╔██╗ ██║██║   ██║██║   ██║██║██║     █████╗  
██║██║╚██╗██║╚██╗ ██╔╝██║   ██║██║██║     ██╔══╝  
██║██║ ╚████║ ╚████╔╝ ╚██████╔╝██║╚██████╗███████╗
╚═╝╚═╝  ╚═══╝  ╚═══╝   ╚═════╝ ╚═╝ ╚═════╝╚══════╝
```

# 🧾 Invoice & Billing Automation Tool

**Create. Send. Get Paid. — All in one place.**

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

<br/>

> A modern, full-stack Invoice & Billing Automation platform for **freelancers** and **small businesses**  
> to create professional invoices, track payments, and manage clients — all with a beautiful UI.

<br/>

---

</div>

<br/>

## 📸 Screenshots

<div align="center">

| Dashboard | Invoice Builder | Client Manager |
|-----------|----------------|----------------|
| ![Dashboard](https://placehold.co/380x220/0f172a/38bdf8?text=Dashboard+View&font=raleway) | ![Builder](https://placehold.co/380x220/0f172a/a78bfa?text=Invoice+Builder&font=raleway) | ![Clients](https://placehold.co/380x220/0f172a/34d399?text=Client+Manager&font=raleway) |

</div>

<br/>

---

## ✨ Features

<br/>

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   📊  Revenue Dashboard    →  Charts, stats, overview       │
│   🧾  Invoice Builder      →  Live preview, auto-calculate  │
│   📄  PDF Export           →  One-click professional PDF    │
│   👥  Client Manager       →  Full client history & details │
│   💰  Payment Tracking     →  Paid / Unpaid / Overdue       │
│   🔐  Auth & Security      →  Supabase Auth, row-level      │
│   🌙  Dark / Light Mode    →  System preference support     │
│   📱  Fully Responsive     →  Works on all screen sizes     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

<br/>

---

## 🛠️ Tech Stack

<br/>

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 🖼️ **Framework** | Next.js 14 (App Router) | Full-stack React framework |
| 🔷 **Language** | TypeScript | Type safety throughout |
| 🎨 **Styling** | Tailwind CSS + shadcn/ui | UI components & design system |
| 🗄️ **Database** | Supabase (PostgreSQL) | Data storage & real-time |
| 🔐 **Auth** | Supabase Auth | Email/password authentication |
| 📄 **PDF** | react-pdf / jsPDF | Invoice PDF generation |
| 📋 **Forms** | React Hook Form + Zod | Form handling & validation |
| 📊 **Charts** | Recharts | Dashboard data visualization |
| 🗃️ **State** | Zustand | Client-side state management |
| 🚀 **Deploy** | Vercel | Hosting & CI/CD |

<br/>

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← Sidebar + Navbar
│   │   ├── dashboard/page.tsx
│   │   ├── invoices/
│   │   │   ├── page.tsx        ← Invoice List
│   │   │   └── new/page.tsx    ← Invoice Builder
│   │   ├── clients/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx              ← Root layout
│   └── page.tsx                ← Redirect to login/dashboard
├── components/
│   ├── ui/                     ← shadcn components
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   └── RevenueChart.tsx
│   ├── invoices/
│   │   ├── InvoiceTable.tsx
│   │   ├── InvoiceBuilder.tsx
│   │   ├── LineItems.tsx
│   │   └── InvoicePreview.tsx
│   ├── clients/
│   │   ├── ClientTable.tsx
│   │   └── ClientForm.tsx
│   └── shared/
│       ├── Sidebar.tsx
│       ├── Navbar.tsx
│       └── ThemeToggle.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── store/
│   └── invoiceStore.ts
└── types/
    └── index.ts
```

<br/>

---

<div align="center">

  ⭐ **Star this repo if you found it helpful!** ⭐

</div>

