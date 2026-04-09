<div align="center">
  <img 
    src="public/pwa-512x512.png" 
    alt="Japanerary Logo" 
    width="128"
  />

  <h1 align="center">Japanerary</h1>

  <p>
    A high-performance, mobile-first travel itinerary.
    Simple, yet dynamic.
  </p>

  [![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-Persistence-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
</div>

---

## Overview

**Japanerary** is a single source of truth for group travel. It bridges 
the gap between structured planning and spontaneous discovery by 
providing a shared, real-time timeline. 

Every member of the group stays in sync with the latest updates via a 
high-performance, mobile-first interface. It is a living document 
designed to be as dynamic as the trip itself—allowing for instant 
reordering, rescheduling, and synchronization across all devices.

---

## The Backstory

This project started with a simple request: *"Can you make a simple 
HTML file of the itinerary so we can see it on our phones?"*

As a CS student, "simple" quickly turned into "engineered." The project 
evolved through several stages of necessity:

* **Phase 1 (The Static File):** A basic HTML file. It was a hassle 
  to update and a pain to distribute every time a flight time changed.
* **Phase 2 (The Database):** I moved the data to a database, but I 
  was still hard-coding entries. 
* **Phase 3 (The "Mom" Factor):** Realizing that my mom (the lead 
  planner) loves to change things on the fly, I built the **Admin 
  Management** suite. This allowed us to update the entire trip from 
  a phone while standing in a train station in Shibuya.
* **Phase 4 (The Cleanup):** What started as "vibe coding" and 
  documentation copy-pasting eventually became a polished, reusable PWA. 

I’ve since cleaned up the "shitass spaghetti code" (mostly, hopefully, maybe),
documented the logic, and made it easy for anyone to fork and use for their own 
adventures.

---

## Features

### Timeline Experience
* **Snappy Animations:** Powered by Framer Motion with optimized 
  spring physics for a tactile feel.
* **Intelligent Scrolling:** Automatic vertical centering of active 
  cards with layout prediction for oversized content.
* **Markdown Engine:** Full support for rich text, including automatic 
  extraction of links into a dedicated "Attachments" section.

### Admin Management
* **The "Mom-Proof" Editor:** A dedicated management mode to handle 
  frequent itinerary shifts on the go.
* **Multi-Selection Mode:** Long-press to enter a bulk management 
  state for deleting or rescheduling multiple items at once.
* **Stationary Reorder:** A dedicated move mode with visual-center 
  controls to re-sequence the trip without losing context.

### Infrastructure
* **PWA Support:** Installable on iOS and Android with offline 
  persistence and safe-area awareness.
* **Password Gate:** Role-based access control (Admin/Viewer) 
  secured via client-side SHA-256 hashing.
* **Data Portability:** Built-in JSON export for instant database 
  backups and seeding.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 | UI Library |
| **Logic** | TypeScript 5 | Type-safe Development |
| **Styling** | Tailwind CSS | Utility-first Design |
| **Motion** | Framer Motion | Physics-based Animations |
| **Database** | Supabase | Real-time Persistence |
| **PWA** | Vite PWA | Offline Capabilities |

---

## Local Setup

### Prerequisites

- **Node.js:** v20.x or higher
- **npm:** v10.x or higher
- **Supabase Account:** For database hosting

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/your-repo/japanerary.git
cd japanerary
```

**2. Install dependencies:**
```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Branding
VITE_APP_TITLE=Japan Trip
VITE_APP_YEAR=2026
VITE_APP_SUBTITLE=Tokyo

# Supabase Public
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Auth Hashes (SHA-256)
VITE_ADMIN_HASH=your_admin_password_hash
VITE_VIEWER_HASH=your_viewer_password_hash

# Private Script Config
SUPABASE_DB_URL=your_direct_connection_string
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_HASH=your_admin_password_hash
```

### Database Setup

**3. Initialize schemas and policies:**
```bash
npm run setup-db
```

**4. Seed initial data:**
```bash
npm run seed
```

**5. Run development server:**
```bash
npm run dev
```

---

## Project Structure

```
src/
├── components/
│   ├── layout/         # Header, Footer, Navigation
│   └── ui/             # Pure "Brick" components
├── features/
│   ├── auth/           # Password gate and role logic
│   └── itinerary/      # Core timeline and management
├── hooks/              # Global utility hooks
├── lib/                # External service clients
└── utils/              # Global pure functions
```

> **Note on Implementation:** This codebase is a product of "vibe 
> coding"—a delicate balance of documentation copy-pasting, 
> trial-and-error, and divine intervention. It works beautifully, but 
> if you find a section of code that looks like it was written at 3 AM 
> during a caffeine crash... it probably was.

---

## Development Paradigm

- **Bricks (UI):** Components must be logic-free. They receive props 
  and emit events.
- **Hooks (Logic):** All state management and side effects must 
  reside in custom hooks.
- **Verticality:** Keep lines under 80 characters. Stack props 
  vertically. Use generous whitespace.
