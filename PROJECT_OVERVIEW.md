# Trading Journal – Project Overview

## Table of Contents
- [Package Info](#package-info)
- [Next.js Configuration](#nextjs-configuration)
- [Core Pages](#core-pages)
  - [Dashboard Page](#dashboard-page)
  - [About Page](#about-page)
  - [Home Redirect](#home-redirect)
- [Components](#components)
  - [Providers](#providers)
  - [UI Components](#ui-components)
- [Utilities](#utilities)
- [Running the Development Server](#running-the-development-server)

---

## Package Info
```json
{
  "name": "trading-journal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@base-ui/react": "^1.4.1",
    "@hookform/resolvers": "^5.2.2",
    "@prisma/client": "^5.11.0",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@supabase/ssr": "^0.10.2",
    "@supabase/supabase-js": "^2.105.0",
    "axios": "^1.15.2",
    "bcryptjs": "^3.0.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "crypto-js": "^4.2.0",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.8.0",
    "next": "16.2.4",
    "papaparse": "^5.5.3",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.73.1",
    "recharts": "^3.8.1",
    "shadcn": "^4.4.0",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0",
    "ws": "^8.20.0",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/bcryptjs": "^2.4.6",
    "@types/crypto-js": "^4.2.2",
    "@types/node": "^20",
    "@types/papaparse": "^5.5.2",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.4",
    "prisma": "^5.11.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## Next.js Configuration
```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

---

## Core Pages
### Dashboard Page (`src/app/dashboard/page.tsx`)
```tsx
export const dynamic = "force-dynamic";
import { atjournal_db as prisma } from "@/lib/prisma";
import { Search, TrendingUp, Target, Zap, BarChart2, Activity, Moon, Shield } from "lucide-react";
import { computeCoreStats, computeDailyPnl, computeDirectionalStats, type RawTrade } from "@/lib/analytics";
import { DashboardCharts } from "./dashboard-charts";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import * as motion from "framer-motion/client";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default async function DashboardPage() {
  // Initialize Supabase client safely – if env vars are missing or the request fails, fallback to a login redirect.
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    console.error('Supabase initialization error:', e);
  }

  if (!user) {
    // If we can't determine the user, send them to login rather than hanging.
    redirect("/login");
  }

  // Fetch trades with defensive error handling to avoid hanging on DB issues.
  let rawTrades: any[] = [];
  try {
    rawTrades = await prisma.trade.findMany({
      where: { userId: user.id },
      orderBy: { entryTime: "asc" },
    });
  } catch (e) {
    console.error('Prisma fetch error:', e);
    // Continue with empty trade list to render the page.
    rawTrades = [];
  }

  const trades: RawTrade[] = rawTrades.map(t => ({
    ...t,
    entryPrice: Number(t.entryPrice),
    exitPrice: t.exitPrice ? Number(t.exitPrice) : null,
    grossPnl: Number(t.grossPnl),
    commission: Number(t.commission),
    netPnl: Number(t.netPnl),
    tags: JSON.stringify(t.tags ?? []),
    entryTime: new Date(t.entryTime),
    exitTime: t.exitTime ? new Date(t.exitTime) : null,
  }));

  const stats = computeCoreStats(trades);
  const dir = computeDirectionalStats(trades);
  const dailyPnl = computeDailyPnl(trades);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-full flex flex-col bg-transparent text-foreground font-sans selection:bg-primary/40 overflow-x-hidden">
      {/* ... UI omitted for brevity ... */}
    </motion.div>
  );
}
```

### About Page (`src/app/about/page.tsx`)
*(See the full source in the repository – it contains the premium UI with noise overlay, animated sections, and feature cards.)*

### Home Redirect (`src/app/page.tsx`)
```tsx
import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/about");
}
```

---

## Components
### Providers (`src/components/providers`)
- **`index.tsx`** – Wraps the app with `ThemeProvider`, `SettingsProvider`, splash screen, shooting stars, keyboard manager, and page transition logic.
- **`keyboard-manager.tsx`** – Shows a tiny overlay of the last key pressed (used for the “terminal” feel).
- **`page-transition.tsx`** – Framer‑Motion wrapper for smooth page fades.
- **`settings-provider.tsx`** – Toggles UI flags such as `showStars` and `showLines` stored in `localStorage`.
- **`theme-provider.tsx`** – Manages dark/light theme (not shown here but part of the UI stack).
- **`splash-screen.tsx`** – Intro animation shown once per session.

### UI Components (`src/components/ui`)
A collection of primitive UI elements (buttons, cards, dialogs, tables, etc.) used throughout the app. They are built with Tailwind and follow the “brutalist premium” aesthetic.

---

## Utilities
- **Supabase Server Helper (`src/lib/supabase/server.ts`)** – Creates a server‑side Supabase client using cookies.
- **Analytics (`src/lib/analytics`)** – Functions like `computeCoreStats`, `computeDailyPnl`, and `computeDirectionalStats` that power the dashboard charts.
- **Tailwind Utils (`src/lib/utils.ts`)** – Helper `cn` for conditional class names.

---

## Running the Development Server
```bash
npm run dev
```
The app starts on `http://localhost:3000`. If you see the “loading forever” issue, the recent defensive changes in `src/app/dashboard/page.tsx` should now redirect unauthenticated users to `/login` instead of hanging.

---

*This markdown file was generated to give a concise overview of the project structure and key files. Feel free to edit or expand it as needed.*
