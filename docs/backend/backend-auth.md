# STOXLY Backend Implementation Plan

## Architecture Overview

```
Frontend (React/Vite)  ←→  FastAPI REST API  ←→  SQLite (→ PostgreSQL ready)
     :5173                       :8000                    stoxly.db
```

---

## Phase 1: Python Backend Foundation

### 1.1 Project Structure

```
backend/
├── requirements.txt          # Dependencies
├── main.py                   # FastAPI app entry
├── config.py                 # Settings (DB path, JWT secret)
├── database.py               # SQLite connection + init
├── models.py                 # SQLAlchemy models
├── schemas.py                # Pydantic schemas
├── auth.py                   # JWT + password utilities
├── routers/
│   ├── __init__.py
│   ├── auth.py              # /api/auth/* endpoints
│   ├── users.py             # /api/users/* endpoints
│   └── watchlist.py         # /api/watchlist/* endpoints
└── migrations/
    └── init_db.sql          # Initial schema (PG-compatible)
```

### 1.2 Dependencies (requirements.txt)

- `fastapi`, `uvicorn[standard]`
- `sqlalchemy` (with SQLite dialect)
- `pydantic`, `pydantic-settings`
- `python-jose[cryptography]` (JWT)
- `passlib[bcrypt]` (password hashing)
- `python-multipart` (form data)

---

## Phase 2: Database Schema (PostgreSQL-Compatible)

```sql
-- users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- profiles table
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- watchlists table
CREATE TABLE watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, symbol)
);

-- Indexes for performance
CREATE INDEX idx_watchlists_user_id ON watchlists(user_id);
```

---

## Phase 3: API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| POST | `/api/auth/refresh` | Refresh token | Refresh token |
| GET | `/api/users/me` | Get current user profile | JWT |
| PUT | `/api/users/me` | Update profile | JWT |
| GET | `/api/watchlist` | Get user's watchlist | JWT |
| POST | `/api/watchlist` | Add symbol to watchlist | JWT |
| DELETE | `/api/watchlist/{symbol}` | Remove from watchlist | JWT |

---

## Phase 4: Frontend Changes

### 4.1 New API Client (src/lib/api.ts)

```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = {
  login: (email, password) => fetch(`${API_BASE}/api/auth/login`, ...),
  signup: (email, password, name) => fetch(`${API_BASE}/api/auth/signup`, ...),
  // ... etc
}
```

### 4.2 Auth Context (src/contexts/AuthContext.tsx)

- Store JWT in localStorage
- Provide `user`, `login()`, `signup()`, `logout()`
- Protected route wrapper

### 4.3 AuthPage Fix

- Remove Supabase import
- Integrate `api.signup()` / `api.login()`
- Handle response/errors properly

---

## Phase 5: Vite Proxy Configuration

Add to `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true
    }
  }
}
```

---

## Implementation Order

```
1. backend/requirements.txt + setup
2. backend/database.py + models.py
3. backend/auth.py (JWT + hashing)
4. backend/routers/auth.py (signup/login endpoints)
5. backend/main.py (app assembly + CORS)
6. Test API with curl or Swagger (auto at /docs)
7. src/lib/api.ts (frontend API client)
8. src/contexts/AuthContext.tsx (auth state)
9. src/pages/AuthPage.tsx (fix + connect)
10. src/lib/supabase.ts → remove or archive
```

---

## To Start Development

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
npm run dev
```

---

## Current Frontend State

- **Framework**: React 19 + TypeScript + Vite (Vite SPA)
- **Auth**: Supabase client configured but `AuthPage.tsx` has syntax errors (lines 77-86)
- **No Python backend** currently exists
- **Integration Point**: Replace `src/lib/supabase.ts` with `src/lib/api.ts`

## User Requirements

- **Purpose**: Replace Supabase entirely with Python SQLite
- **Framework**: FastAPI
- **Auth Strategy**: JWT tokens (stateless, recommended for SPA)
- **DB Strategy**: SQLite now but schema designed for easy PostgreSQL migration later
- **Dev Setup**: Separate terminal for backend (uvicorn) and frontend (npm run dev)
