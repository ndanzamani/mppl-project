# 🛡️ GuildHall RPG v1.0 — Medieval Employee & Adventurer Realm

> A boot.dev-inspired gamified employee management workspace featuring interactive Discord-style channels, a 3D wooden Voice Tavern, Trello-style Missions Board, RPG Quest Log, Hierarchy of Honor org chart, and Experience & Leveling system.

---

## 🚀 Tech Stack Overview

- **Backend Framework**: Laravel 11 (PHP 8.2+)
- **Frontend SPA**: React 18 + Inertia.js (Vite 8)
- **Styling & Themes**: TailwindCSS + CSS Custom Variables (5 Themes: `Light Realm`, `Dark Realm`, `Midnight Cyber`, `Forest Tavern`, `Sunset Realm`)
- **Animations & Sound**: Framer Motion, `@hello-pangea/dnd`, WebAudio API sound synthesizer
- **Authorization & Hierarchy**: Spatie Laravel-Permission (`Spatie\Permission\Models\Role`)
- **Database**: MySQL 8.0 with composite performance indexes & Redis cache layer

---

## 📜 Key Features & RPG Terminology

| Component | RPG Name | Description |
| :--- | :--- | :--- |
| **Guild Hall** | `/dashboard` | Realm center with activity banners and quick action cards |
| **Character Sheet** | `/dashboard/profile/{id}` | RPG attributes (**Strength ⚔️**, **Wisdom 📜**, **Charisma ✨**, **Endurance 🛡️**), Class Titles, Experience Progress, and Equipped Roles |
| **Missions Board** | `/dashboard/board` | 5-column Kanban board with **Submit Mission Scroll (+20 XP)**, wax seals, and council voting |
| **Quest Log** | `/dashboard/quests` | Bounty board for posting and claiming help requests with automated XP distribution |
| **Voice Tavern** | `/dashboard/channels` | 3D wooden carved table, food & drink props (🍺, 🍞, 🧀), animated fireplace hearth, and **"🍺 Raise Tankard"** action |
| **Text Halls** | `#general-hall` | Discord-style real-time text chat with emoji pickers and virtual scrolling |
| **Party Members** | `/dashboard/team` | Interactive roster grid with real-time status aura rings and member cards |
| **Hierarchy of Honor** | `/dashboard/hierarchy` | Visual organization chart with interactive permission side panels |

---

## 🛠️ Local Installation & Development

### 1. Requirements
- PHP >= 8.2
- Node.js >= 18
- MySQL Server (running on `127.0.0.1:3306`)
- Composer & NPM

### 2. Environment Setup
```bash
# Clone and enter project directory
cd "d:\project\mppl reborn v3.0"

# Install PHP dependencies
composer install

# Install NPM dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Migration & Seeding
```bash
# Run migrations and seed default Guild Master user and initial channels
php artisan migrate:fresh --seed
```

### 4. Running Local Servers
```bash
# Terminal 1: Launch Laravel Local Development Server
php artisan serve --port=8000

# Terminal 2: Launch Vite Frontend Compiler
npm run dev
```

Visit `http://localhost:8000/login` in your browser. Default login credentials:
- **Email**: `admin@guildhall.io`
- **Password**: `password`

---

## 🐳 Docker Deployment Setup

Run containerized production services via Docker Compose:
```bash
docker-compose up -d --build
```
Services spun up:
- `guildhall_app`: Laravel 11 + PHP-FPM + Nginx (`http://localhost:8000`)
- `guildhall_db`: MySQL 8.0 (`3306`)
- `guildhall_redis`: Redis 7.0 (`6379`)

---

## 📑 Complete Documentation Links

- [📜 API Reference Documentation](file:///d:/project/mppl%20reborn%20v3.0/docs/API_DOCUMENTATION.md)
- [🛡️ Guild User & Adventurer Guide](file:///d:/project/mppl%20reborn%20v3.0/docs/USER_GUIDE.md)
- [📋 System Phase Execution Log](file:///d:/project/mppl%20reborn%20v3.0/PHASE_LOG.md)
- [🎨 System Walkthrough & Screenshots](file:///C:/Users/asus/.gemini/antigravity-ide/brain/fbb591e8-b168-48a7-bb32-a23b0f6398fb/walkthrough.md)
