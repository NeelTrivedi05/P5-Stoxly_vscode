import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type {
  PersonalizedPlanResponse,
  PortfolioAnalysisResponse,
  SharePortfolioResponse,
  StockQuoteResponse,
} from '../lib/api';

interface UsePortfolioResult {
  analysis: PortfolioAnalysisResponse | null;
  plan: PersonalizedPlanResponse | null;
  watchlistQuotes: StockQuoteResponse[];
  loading: boolean;
  error: string;
  shareLink: SharePortfolioResponse | null;
  createShareLink: (note?: string) => Promise<void>;
}

export function usePortfolio(accessToken: string | null): UsePortfolioResult {
  const [analysis, setAnalysis] = useState<PortfolioAnalysisResponse | null>(null);
  const [plan, setPlan] = useState<PersonalizedPlanResponse | null>(null);
  const [watchlistQuotes, setWatchlistQuotes] = useState<StockQuoteResponse[]>([]);
  const [shareLink, setShareLink] = useState<SharePortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const [analysisResult, planResult, watchlistResult] = await Promise.all([
          api.getPortfolioAnalysis(accessToken),
          api.getPersonalizedPlan(accessToken),
          api.getWatchlist(accessToken),
        ]);

        const quoteResults = await Promise.all(
          watchlistResult.map((item) => api.getStock(accessToken, item.symbol))
        );

        if (!active) {
          return;
        }

        setAnalysis(analysisResult);
        setPlan(planResult);
        setWatchlistQuotes(quoteResults);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Unable to load portfolio insights.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [accessToken]);

  const createShareLink = async (note?: string) => {
    if (!accessToken) {
      return;
    }

    try {
      const result = await api.sharePortfolio(accessToken, {
        include_watchlist: true,
        note,
      });
      setShareLink(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate share link.');
    }
  };

  return {
    analysis,
    plan,
    watchlistQuotes,
    loading,
    error,
    shareLink,
    createShareLink,
  };
}
