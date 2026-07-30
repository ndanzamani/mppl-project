# PHASE_LOG.md - GuildHall Private 1-Account 1-Server Workspace & Resignation System Phase

## Overview
This phase implemented the **Private 1-Account 1-Server Workspace & Resignation System** with **ZERO public servers**. Every user account belongs to at most **one server** at a time. Users can join a company via an HR invitation code (`REALM-XXXXX`) or found a new company as CEO.

---

## 1. Domain Rules Verified
- [x] **ZERO Public Servers**: No public server listings or directory exist anywhere.
- [x] **1 Account = 1 Server**: Every account belongs to at most 1 server at a time (`users.server_id`).
- [x] **Join via HR Invitation Code**: Unemployed accounts (`server_id == null`) join strictly via an 8-character HR invitation code (`REALM-XXXXX`).
- [x] **Found New Company**: Unemployed accounts (`server_id == null`) can create a new server, becoming CEO/Guild Master.
- [x] **Resignation Flow**: Accounts in a company can click **"Resign from Company 🚪"**, setting `server_id = null`.
- [x] **Automated Tests**: 5/5 backend rule tests passed in `test_strict_single_server_rules.php`.

---

## 2. Component Implementations
- **`JoinRealm.jsx`**: Adventurer Onboarding Sanctum (`/dashboard/join-realm`) for accounts without a company (`server_id == null`).
- **`InviteCodeModal.jsx`**: Modal displaying current server's HR invitation code (`REALM-8X92K`) with copy and regenerate buttons.
- **`ServerController.php`**: API endpoints (`current`, `store`, `join`, `resign`, `regenerateInviteCode`).
- **`AuthenticatedLayout.jsx`**: Company header, HR invite code copy button, and Resign from Company modal.
