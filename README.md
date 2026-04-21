# Minimalist Chess

A web-based Chess application built from scratch to focus on clean logic, interactive usability, and optimal performance.

## Tech Stack Overview

- **Frontend (Client):** React, Vite, TypeScript, Tailwind CSS
- **Backend (Server):** Fastify, Node.js, TypeScript
- **Real-Time Engine:** Socket.io
- **Database / ORM:** PostgreSQL managed via Prisma

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL database

### 1. Client Setup
Open a terminal in the `/client` directory and run:

```bash
cd client
npm install
npm run dev
```
The client will start on `http://localhost:5173`.

### 2. Server Setup
Open a terminal in the `/server` directory and run:

```bash
cd server
npm install
npm run dev
```
By default, the Fastify server will be configured to start and watch for changes on development.

*(Note: Prior to using database features, ensure you configure your `.env` and run `npx prisma db push`)*

## Phased TODO List

### Phase 1: Setup & Core Logic
- [x] Initial project skeleton and stack setup.
- [ ] Implement board representation (Array vs Matrix).
- [ ] Define piece types, initial positions, and basic move validation geometry.

### Phase 2: Interactive UI
- [ ] Draw the board using clean CSS grid/flex.
- [ ] Render chess pieces on the board.
- [ ] Implement drag-and-drop capabilities.
- [ ] Highlight valid moves and capture interactions.

### Phase 3: Real-time Backend
- [ ] Integrate Socket.io on the server mapping connections.
- [ ] Pair players into game rooms dynamically via WebSocket.
- [ ] Dispatch moves and sync board state between Player A and Player B in real-time.

### Phase 4: Persistence & Polish
- [ ] Implement simple user authentication or session tracking.
- [ ] Save match histories into the PostgreSQL database.
- [ ] Build and integrate match clocks/timers.
- [ ] Final UI Polish according to 'DESIGN.md'.
