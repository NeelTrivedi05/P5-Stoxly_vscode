from datetime import datetime, timedelta
import json
import uuid

import httpx
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import settings
from database import init_db
from models import User
from routers import auth, users, watchlist

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="Stoxly Backend",
    description="FastAPI backend for Stoxly - Finance tracking app",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(watchlist.router)


class SharePortfolioRequest(BaseModel):
    include_watchlist: bool = True
    note: str | None = None


def parse_preferences(current_user: User) -> dict:
    raw_preferences = current_user.profile.preferences if current_user.profile else "{}"
    try:
        return json.loads(raw_preferences or "{}")
    except json.JSONDecodeError:
        return {}


def get_salary_slab_plan(salary: float) -> tuple[int, int]:
    if salary < 25000:
        pct = 10
    elif salary <= 50000:
        pct = 15
    elif salary <= 100000:
        pct = 20
    else:
        pct = 25

    return pct, round(salary * (pct / 100))


def compute_plan_from_preferences(preferences: dict) -> dict:
    onboarding = preferences.get("onboardingData", {})
    salary_raw = onboarding.get("salaryInr") or 0
    risk = str(onboarding.get("riskAppetite") or "Medium")

    try:
        salary = float(salary_raw)
    except (TypeError, ValueError):
        salary = 0.0

    risk_emergency_map = {
        "Low": 4,
        "Medium": 6,
        "High": 8,
    }

    pct, recommended = get_salary_slab_plan(salary)
    emergency_months = risk_emergency_map.get(risk, 6)

    range_min = round(recommended * 0.9)
    range_max = round(recommended * 1.1)

    buckets = [
        {
            "name": "Core Index Funds",
            "percent": 50,
            "amount": round(recommended * 0.50),
            "rationale": "Long-term compounding anchor.",
        },
        {
            "name": "Sector Opportunities",
            "percent": 30,
            "amount": round(recommended * 0.30),
            "rationale": "Focus on your chosen sectors.",
        },
        {
            "name": "Debt + Cash Buffer",
            "percent": 20,
            "amount": round(recommended * 0.20),
            "rationale": "Protects downside and keeps liquidity ready.",
        },
    ]

    return {
        "recommended_monthly_investment": recommended,
        "range_min": range_min,
        "range_max": range_max,
        "emergency_fund_target_months": emergency_months,
        "salary_percentage_rule": pct,
        "suggested_buckets": buckets,
    }


async def fetch_newsapi_business_headlines() -> list[dict]:
    if not settings.NEWS_API_KEY:
        return []

    url = f"{settings.NEWS_API_BASE_URL}/top-headlines"
    params = {
        "category": "business",
        "language": "en",
        "pageSize": 8,
        "apiKey": settings.NEWS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=12) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        payload = response.json()

    articles = payload.get("articles", [])
    normalized: list[dict] = []

    for index, article in enumerate(articles):
        title = article.get("title") or "Market update"
        summary = article.get("description") or "No summary available."
        normalized.append(
            {
                "id": f"newsapi-{index}",
                "headline": title,
                "summary": summary,
                "source": (article.get("source") or {}).get("name") or "NewsAPI",
                "url": article.get("url"),
                "impact": "neutral",
                "published_at": article.get("publishedAt") or datetime.utcnow().isoformat(),
            }
        )

    return normalized


async def fetch_finnhub_quote(symbol: str) -> dict:
    if not settings.FINNHUB_API_KEY:
        return {}

    url = f"{settings.FINNHUB_BASE_URL}/quote"
    params = {
        "symbol": symbol,
        "token": settings.FINNHUB_API_KEY,
    }

    async with httpx.AsyncClient(timeout=12) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        payload = response.json()

    current = payload.get("c") or 0
    prev_close = payload.get("pc") or 0
    delta = current - prev_close
    pct = (delta / prev_close * 100) if prev_close else 0

    return {
        "symbol": symbol,
        "price": current,
        "change": round(delta, 2),
        "change_percent": round(pct, 2),
        "high": payload.get("h") or 0,
        "low": payload.get("l") or 0,
        "open": payload.get("o") or 0,
        "previous_close": prev_close,
        "timestamp": payload.get("t"),
    }


async def fetch_finnhub_events() -> list[dict]:
    if not settings.FINNHUB_API_KEY:
        return []

    url = f"{settings.FINNHUB_BASE_URL}/calendar/earnings"
    params = {
        "from": datetime.utcnow().date().isoformat(),
        "to": (datetime.utcnow() + timedelta(days=10)).date().isoformat(),
        "token": settings.FINNHUB_API_KEY,
    }

    async with httpx.AsyncClient(timeout=12) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        payload = response.json()

    events = payload.get("earningsCalendar", [])

    normalized: list[dict] = []
    for index, event in enumerate(events[:8]):
        event_date = event.get("date") or datetime.utcnow().date().isoformat()
        status = "upcoming"
        if event_date == datetime.utcnow().date().isoformat():
            status = "ongoing"

        normalized.append(
            {
                "id": f"finnhub-evt-{index}",
                "title": f"{event.get('symbol', 'N/A')} earnings",
                "category": "Earnings",
                "status": status,
                "date": event_date,
                "detail": f"EPS estimate: {event.get('epsEstimate', 'N/A')} | Revenue estimate: {event.get('revenueEstimate', 'N/A')}",
            }
        )

    return normalized


@app.get("/api/news")
async def get_market_news(current_user: User = Depends(users.get_current_user)):
    """NewsAPI market news with fallback sample feed."""
    _ = current_user

    try:
        news = await fetch_newsapi_business_headlines()
        if news:
            return news
    except Exception:
        pass

    now = datetime.utcnow().isoformat()
    return [
        {
            "id": "news-fallback-1",
            "headline": "Markets close mixed as investors assess global cues",
            "summary": "Indices traded in a narrow range with sector rotation in IT, banking, and energy.",
            "source": "Fallback Feed",
            "impact": "neutral",
            "published_at": now,
        },
        {
            "id": "news-fallback-2",
            "headline": "Rupee stays range-bound ahead of macro data releases",
            "summary": "Currency traders remained cautious before upcoming inflation and growth figures.",
            "source": "Fallback Feed",
            "impact": "neutral",
            "published_at": now,
        },
    ]


@app.get("/api/stocks/{symbol}")
async def get_stock(symbol: str, current_user: User = Depends(users.get_current_user)):
    """Finnhub quote endpoint for watchlist pricing."""
    _ = current_user

    try:
        quote = await fetch_finnhub_quote(symbol.upper())
        if quote:
            return quote
    except Exception:
        pass

    return {
        "symbol": symbol.upper(),
        "price": 0,
        "change": 0,
        "change_percent": 0,
        "high": 0,
        "low": 0,
        "open": 0,
        "previous_close": 0,
        "timestamp": int(datetime.utcnow().timestamp()),
    }


@app.get("/api/events")
async def get_market_events(current_user: User = Depends(users.get_current_user)):
    """Finnhub earnings/event feed with fallback events."""
    _ = current_user

    try:
        events = await fetch_finnhub_events()
        if events:
            return events
    except Exception:
        pass

    today = datetime.utcnow().date().isoformat()
    return [
        {
            "id": "evt-fallback-1",
            "title": "Major index weekly options expiry",
            "category": "Derivatives",
            "status": "upcoming",
            "date": today,
            "detail": "Higher intraday volatility expected around close.",
        },
        {
            "id": "evt-fallback-2",
            "title": "Top private bank conference call",
            "category": "Corporate",
            "status": "ongoing",
            "date": today,
            "detail": "Management commentary may influence financial sector sentiment.",
        },
    ]


@app.get("/api/portfolio/analysis")
def get_portfolio_analysis(current_user: User = Depends(users.get_current_user)):
    """Calculate basic diversification using user's watchlist concentration."""
    watchlist_count = len(current_user.watchlists)

    if watchlist_count <= 3:
        allocation = [
            {"name": "Large Cap", "value": 62, "color": "#c7a242"},
            {"name": "Mid Cap", "value": 20, "color": "#4f46e5"},
            {"name": "Defensive", "value": 18, "color": "#0ea5e9"},
        ]
        score = 63
        insight = "Portfolio is slightly concentrated; consider spreading across more sectors."
    else:
        allocation = [
            {"name": "Large Cap", "value": 45, "color": "#c7a242"},
            {"name": "Mid Cap", "value": 25, "color": "#4f46e5"},
            {"name": "Defensive", "value": 18, "color": "#0ea5e9"},
            {"name": "Cash", "value": 12, "color": "#10b981"},
        ]
        score = 79
        insight = "Diversification looks healthy with balanced exposure across segments."

    return {
        "score": score,
        "insight": insight,
        "allocation": allocation,
    }


@app.get("/api/plan/personalized")
def get_personalized_plan(current_user: User = Depends(users.get_current_user)):
    """Salary slab + risk appetite aware monthly plan."""
    preferences = parse_preferences(current_user)
    return compute_plan_from_preferences(preferences)


@app.post("/api/portfolio/share")
def share_portfolio(
    request: SharePortfolioRequest,
    current_user: User = Depends(users.get_current_user),
):
    """Generate temporary share link for analyser."""
    _ = request
    share_id = str(uuid.uuid4())
    expires_at = (datetime.utcnow() + timedelta(days=7)).isoformat()
    app_url = settings.ALLOWED_ORIGINS[0] if settings.ALLOWED_ORIGINS else "http://localhost:5173"

    return {
        "share_id": share_id,
        "share_url": f"{app_url}/analyser/share/{share_id}",
        "expires_at": expires_at,
        "user_id": current_user.id,
    }


@app.get("/")
def read_root():
    """Root endpoint."""
    return {
        "message": "Welcome to Stoxly Backend",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
