# 🔥 StreakX: The Fitness Discipline Engine

StreakX is a high-performance, discipline-focused workout tracker designed as a Progressive Web App (PWA). Built for those who don't want to break their streak, it features a cyclical workout rotation system, a premium glassmorphism UI, and robust admin controls.

## ✨ Key Features

- **🔄 Cyclical Workout Rotation**: Automatically rotates through your custom workout plans (e.g., Push/Pull/Legs) based on a deterministic cycle locked to IST.
- **📅 Smart Recovery**: Automatically detects "Rest Days" within your cycle and displays dedicated recovery views.
- **🛡️ Admin Dashboard**:
  - **Sidebar Navigation**: Sleek, sliding side panel for desktop and mobile.
  - **User Management**: Add users with custom roles and default passwords.
  - **Plan Configuration**: Group exercises by day and order them for a seamless gym experience.
- **🔋 PWA Ready**: Install StreakX on your iOS or Android device. Optimized safe-area padding for a native-app feel.
- **💎 Glassmorphism UI**: A dark, premium aesthetic using 90% dark tokens, 8% glass blur, and 2% vibrant glow.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: Tailwind CSS with custom Glassmorphism utilities
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/samarrajx/StreakX.git
cd StreakX
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Database Schema
Run the following SQL in your Supabase SQL Editor:
```sql
-- Create workout_plans table
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS total_days INTEGER DEFAULT 7;

-- Create exercises table
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS day_number INTEGER DEFAULT 1;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_exercises_plan_day ON public.exercises(workout_plan_id, day_number, order_index);
```

### 5. Run the dev server
```bash
npm run dev
```

## 📱 PWA Support
StreakX is fully optimized for PWA. To install:
- **iOS**: Tap "Share" -> "Add to Home Screen"
- **Android**: Tap the menu (three dots) -> "Install App"

---
Built with 🔥 by [Samar Raj](https://github.com/samarrajx)
