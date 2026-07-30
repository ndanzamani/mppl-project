# 📜 GuildHall RPG v1.0 — API Reference Documentation

All API endpoints require an authenticated session (`sanctum` or Inertia web session).

---

## 1. Authentication & User Profile APIs

### `POST /login`
Adventurer login.
- **Request Body**:
  ```json
  {
    "email": "admin@guildhall.io",
    "password": "password"
  }
  ```

### `GET /api/users/{id}`
Retrieve character profile data.
- **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "name": "Guild Master User",
    "email": "admin@guildhall.io",
    "status": "working",
    "xp": 1500,
    "level": 5,
    "days_employed": 61,
    "role_name": "Guild Master",
    "hierarchy_level": 100,
    "theme": "dark"
  }
  ```

### `PATCH /api/users/{id}/status`
Update status aura (`working`, `free`, `on_vacation`, `sick`, `away`, `do_not_disturb`).
- **Request Body**: `{"status": "free"}`

### `PATCH /api/users/{id}/theme`
Update active theme (`light`, `dark`, `midnight`, `forest`, `sunset`).
- **Request Body**: `{"theme": "midnight"}`

### `POST /api/users/{id}/award-xp`
Award experience points and trigger level recalculation.
- **Request Body**: `{"xp_amount": 500}`

---

## 2. Text Halls & Voice Taverns APIs

### `GET /api/channels`
List accessible text channels and voice taverns.

### `POST /api/channels`
Create new text hall or voice tavern.
- **Request Body**:
  ```json
  {
    "name": "strategy-room",
    "type": "tavern",
    "topic": "Strategy & Raid Planning"
  }
  ```

### `POST /api/channels/{id}/join`
Join voice tavern and assign 3D seat (1-12).

### `POST /api/channels/{id}/messages`
Post message to text hall.

---

## 3. Missions Board APIs

### `GET /api/projects`
List project proposals & missions.

### `POST /api/projects`
Submit new mission scroll (+20 XP).
- **Request Body**:
  ```json
  {
    "name": "Authentication Sanctum Upgrade",
    "description": "Upgrade session validation for all realm members",
    "status": "backlog"
  }
  ```

### `POST /api/projects/{id}/vote`
Vote upvote/downvote on proposal (+10 XP).
- **Request Body**: `{"type": "up"}`

### `PATCH /api/projects/{id}/status`
Update status column (*backlog*, *in_progress*, *in_review*, *approved*, *rejected*).

---

## 4. Quest Log APIs

### `GET /api/quests`
List available, claimed, or completed bounties.

### `POST /api/quests`
Post a new help request quest (+20 XP).
- **Request Body**:
  ```json
  {
    "title": "Fix WebRTC Peer Audio Signal",
    "description": "Need assistance verifying SDP candidate exchange",
    "estimated_duration": "2 hours",
    "expires_at": "2026-08-01 12:00:00"
  }
  ```

### `POST /api/quests/{id}/claim`
Accept and claim a quest.

### `POST /api/quests/{id}/complete`
Mark quest completed and auto-distribute reward XP.
