const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface UserResponse {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
    preferences?: string;
    updated_at: string;
  };
}

interface WatchlistItem {
  id: string;
  symbol: string;
  created_at: string;
}

export interface StockQuoteResponse {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  high: number;
  low: number;
  open: number;
  previous_close: number;
  timestamp: number;
}

export interface DashboardNewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url?: string;
  impact: 'positive' | 'negative' | 'neutral';
  published_at: string;
}

export interface MarketEventItem {
  id: string;
  title: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  date: string;
  detail: string;
}

export interface PortfolioSlice {
  name: string;
  value: number;
  color: string;
}

export interface PortfolioAnalysisResponse {
  score: number;
  insight: string;
  allocation: PortfolioSlice[];
}

export interface PersonalizedPlanResponse {
  recommended_monthly_investment: number;
  range_min: number;
  range_max: number;
  emergency_fund_target_months: number;
  suggested_buckets: Array<{
    name: string;
    percent: number;
    amount: number;
    rationale: string;
  }>;
}

export interface SharePortfolioResponse {
  share_id: string;
  share_url: string;
  expires_at: string;
}

export interface SharePortfolioRequest {
  include_watchlist?: boolean;
  note?: string;
}

const getAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const api = {
  // Auth endpoints
  signup: async (request: SignupRequest): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }
    return response.json();
  },

  login: async (request: LoginRequest): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    return response.json();
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Token refresh failed');
    }
    return response.json();
  },

  // User endpoints
  getCurrentUser: async (accessToken: string): Promise<UserResponse> => {
    const response = await fetch(`${API_BASE}/api/users/me`, {
      method: 'GET',
      headers: getAuthHeader(accessToken),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch user');
    }
    return response.json();
  },

  updateProfile: async (
    accessToken: string,
    data: { full_name?: string; avatar_url?: string; preferences?: string }
  ): Promise<UserResponse> => {
    const response = await fetch(`${API_BASE}/api/users/me`, {
      method: 'PUT',
      headers: getAuthHeader(accessToken),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update profile');
    }
    return response.json();
  },

  // Watchlist endpoints
  getWatchlist: async (accessToken: string): Promise<WatchlistItem[]> => {
    const response = await fetch(`${API_BASE}/api/watchlist`, {
      method: 'GET',
      headers: getAuthHeader(accessToken),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch watchlist');
    }
    return response.json();
  },

  addToWatchlist: async (accessToken: string, symbol: string): Promise<WatchlistItem> => {
    const response = await fetch(`${API_BASE}/api/watchlist`, {
      method: 'POST',
      headers: getAuthHeader(accessToken),
      body: JSON.stringify({ symbol }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to add to watchlist');
    }
    return response.json();
  },

  removeFromWatchlist: async (accessToken: string, symbol: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/watchlist/${symbol}`, {
      method: 'DELETE',
      headers: getAuthHeader(accessToken),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to remove from watchlist');
    }
  },

  // Dashboard endpoints
  getNews: async (accessToken: string): Promise<DashboardNewsItem[]> => {
    const response = await fetch(`${API_BASE}/api/news`, {
      method: 'GET',
      headers: getAuthHeader(accessToken),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch market news');
    }
    return response.json();
  },

  getEvents: async (accessToken: string): Promise<MarketEventItem[]> => {
    const response = await fetch(`${API_BASE}/api/events`, {
      method: 'GET',
      headers: getAuthHeader(accessToken),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch market events');
    }
    return response.json();
  },

  getStock: async (accessToken: string, symbol: string): Promise<StockQuoteResponse> => {
    const response = await fetch(`${API_BASE}/api/stocks/${symbol}`, {
      method: 'GET',
      headers: getAuthHeader(accessToken),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Failed to fetch stock data for ${symbol}`);
    }
    return response.json();
  },

  getPortfolioAnalysis: async (accessToken: string): Promise<PortfolioAnalysisResponse> => {
    const response = await fetch(`${API_BASE}/api/portfolio/analysis`, {
      method: 'GET',
      headers: getAuthHeader(accessToken),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch portfolio analysis');
    }
    return response.json();
  },

  getPersonalizedPlan: async (accessToken: string): Promise<PersonalizedPlanResponse> => {
    const response = await fetch(`${API_BASE}/api/plan/personalized`, {
      method: 'GET',
      headers: getAuthHeader(accessToken),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch personalized plan');
    }
    return response.json();
  },

  sharePortfolio: async (
    accessToken: string,
    request: SharePortfolioRequest
  ): Promise<SharePortfolioResponse> => {
    const response = await fetch(`${API_BASE}/api/portfolio/share`, {
      method: 'POST',
      headers: getAuthHeader(accessToken),
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate share link');
    }
    return response.json();
  },
};
