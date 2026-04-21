# Stoxly Backend Setup Guide

## Quick Start

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Development Server
```bash
uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

### 4. API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry
├── config.py              # Configuration settings
├── database.py            # Database setup & session
├── models.py              # SQLAlchemy ORM models
├── schemas.py             # Pydantic request/response schemas
├── auth.py                # JWT & password utilities
├── routers/
│   ├── auth.py            # Authentication endpoints
│   ├── users.py           # User profile endpoints
│   └── watchlist.py       # Watchlist endpoints
├── migrations/
│   └── init_db.sql        # Database schema
├── requirements.txt       # Python dependencies
└── .env.example          # Environment variables template
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add symbol to watchlist
- `DELETE /api/watchlist/{symbol}` - Remove symbol from watchlist

## Database

The backend uses SQLite for development (automatically created at `stoxly.db`).

The schema is designed to be PostgreSQL-compatible for easy migration to production.

## Running Both Backend & Frontend

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Frontend will be at http://localhost:5173
Backend will be at http://localhost:8000

## Configuration

Edit `backend/config.py` to change:
- Database location
- JWT secret key (IMPORTANT: Change in production!)
- Token expiration times
- CORS allowed origins

## Troubleshooting

### Port 8000 already in use?
```bash
# Change port in terminal
uvicorn main:app --reload --port 8001

# Or update vite.config.ts proxy target to match
```

### Database reset needed?
```bash
# Delete stoxly.db and restart server - it will recreate
rm stoxly.db  # or del stoxly.db on Windows
```

### Import errors?
Make sure virtual environment is activated and dependencies installed:
```bash
pip install -r requirements.txt
```
