# 🛡️ GuildHall RPG v1.0 — User & Adventurer Guide

Welcome to **GuildHall RPG**! This guide details how to navigate the realm, claim help quests, review council mission proposals, customize your 5 realm themes, and level up your adventurer rank.

---

## 🗡️ 1. Getting Started & Logging In
1. Open `http://localhost:8000/login` in your web browser.
2. Experience the **Medieval Parchment** layout and click **"Begin Your Adventure"**.
3. Credentials:
   - **Email**: `admin@guildhall.io`
   - **Password**: `password`

---

## 📜 2. Navigation & Realm Center
Use the RPG sidebar to access all main sections:
- **Guild Hall** (`/dashboard`): Realm center with quick links and activity overview.
- **Text Halls** (`#general-hall`): Real-time chat with emoji pickers, file attachments, and typing indicators.
- **Voice Taverns** (`voice-tavern`): Interactive wooden table scene with food props (🍺, 🍞, 🧀), animated fireplace, and **"🍺 Raise Tankard"** action.
- **Hierarchy of Honor** (`/dashboard/hierarchy`): Visual organization graph displaying roles, ranks, and permission toggles.
- **Missions Board** (`/dashboard/board`): 5-column Kanban board for submitting mission scrolls and council voting.
- **Quest Log** (`/dashboard/quests`): Help request bounty board with XP rewards.
- **Party Members** (`/dashboard/team`): Roster grid showing active status auras.
- **Character Sheet** (`/dashboard/profile/1`): Your RPG attributes (**Strength ⚔️**, **Wisdom 📜**, **Charisma ✨**, **Endurance 🛡️**), Class Title, and Experience progress.

---

## 🎨 3. Changing Themes & Audio
1. Locate the **Theme Switcher** dropdown in the TopBar.
2. Select from 5 curated themes:
   - ☀️ **Light Realm**: Modern clean white & indigo.
   - 🌙 **Dark Realm**: Deep slate & amber dark mode.
   - 🌌 **Midnight Cyber**: Deep violet cyberpunk theme.
   - 🌲 **Forest Tavern**: Emerald RPG tavern theme.
   - 🌅 **Sunset Realm**: Warm coral & pink theme.
3. Toggle sound effects on or off using the **Mute Button** 🔊 next to the Theme Switcher.

---

## ⚡ 4. Leveling Up & Earning Experience (XP)
- **XP Formula**: `level = floor(sqrt(xp / 100)) + 1`
- **Ways to Earn XP**:
  - Completing Quests: **+150 XP**
  - Submitting Mission Scrolls: **+20 XP**
  - Voting Proposals: **+10 XP**
  - Posting Quests: **+20 XP**
- Click the glowing **Experience Orb** in the TopBar anytime to view your exact level breakdown and progress to the next rank!
