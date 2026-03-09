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

## 🚀 Progress Overview

![Progress](https://img.shields.io/badge/Progress-26%25-orange)
![Done](https://img.shields.io/badge/Done-6%2F23-green)
![Remaining](https://img.shields.io/badge/Remaining-17%2F23-red)

---

## 🎨 Frontend

### Pages & Views
| # | Feature | Branch | Status | Date |
|---|---------|--------|--------|------|
| 1 | Login + Signup | `feature/auth` | ✅ Done | Mar 6 |
| 2 | Sidebar + Navbar + Dashboard UI | `feature/layout` | ✅ Done | Mar 7 |
| 3 | Client Manager Page | `feature/clients` | ⬜ Todo | - |
| 4 | Invoice List Page | `feature/invoices` | ⬜ Todo | - |
| 5 | Invoice Builder + Live Preview | `feature/invoice-builder` | ⬜ Todo | - |
| 6 | Settings Page | `feature/settings` | ⬜ Todo | - |

### UI Features
| # | Feature | Branch | Status | Date |
|---|---------|--------|--------|------|
| 7 | PDF Export | `feature/pdf` | ⬜ Todo | - |
| 8 | Dark/Light Mode | `feature/theme` | ⬜ Todo | - |
| 9 | Responsive Design | `feature/responsive` | ⬜ Todo | - |

### State Management
| # | Feature | Status | Date |
|---|---------|--------|------|
| 10 | Zustand — Invoice Store | ✅ Done | Mar 6 |
| 11 | React Hook Form + Zod — Invoice Builder | ⬜ Todo | - |
| 12 | React Hook Form + Zod — Client Form | ⬜ Todo | - |

---

## ⚙️ Backend

### API Routes
| # | Endpoint | Method | Branch | Status | Date |
|---|----------|--------|--------|--------|------|
| 13 | `/api/invoices` | GET | `feature/api` | ⬜ Todo | - |
| 14 | `/api/invoices` | POST | `feature/api` | ⬜ Todo | - |
| 15 | `/api/invoices/:id` | PATCH | `feature/api` | ⬜ Todo | - |
| 16 | `/api/invoices/:id` | DELETE | `feature/api` | ⬜ Todo | - |
| 17 | `/api/clients` | GET | `feature/api` | ⬜ Todo | - |
| 18 | `/api/clients` | POST | `feature/api` | ⬜ Todo | - |

### Auth
| # | Feature | Status | Date |
|---|---------|--------|------|
| 19 | Supabase Auth — Email/Password | ✅ Done | Mar 6 |

---

## 🗄️ Database

| # | Table | Status | Date |
|---|-------|--------|------|
| 20 | `users` (Supabase Auth) | ✅ Done | Mar 6 |
| 21 | `clients` | ✅ Done | Mar 6 |
| 22 | `invoices` | ✅ Done | Mar 6 |
| 23 | `invoice_items` | ✅ Done | Mar 6 |
| 24 | RLS Policies | ✅ Done | Mar 6 |

---

## 🌿 Branch Strategy
```
main          → Production
develop       → Staging
feature/*     → Individual features
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Next.js API Routes |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| PDF | jsPDF |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| State | Zustand |

---

<div align="center">

  ⭐ **Star this repo if you found it helpful!** ⭐

</div>

