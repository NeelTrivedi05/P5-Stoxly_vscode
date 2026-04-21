import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import type { DashboardNewsItem, MarketEventItem } from '../lib/api';

interface UseNewsResult {
  news: DashboardNewsItem[];
  events: MarketEventItem[];
  breakingHeadlines: string[];
  loading: boolean;
  error: string;
}

export function useNews(accessToken: string | null): UseNewsResult {
  const [news, setNews] = useState<DashboardNewsItem[]>([]);
  const [events, setEvents] = useState<MarketEventItem[]>([]);
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

        const [newsResult, eventsResult] = await Promise.all([
          api.getNews(accessToken),
          api.getEvents(accessToken),
        ]);

        if (!active) {
          return;
        }

        setNews(newsResult);
        setEvents(eventsResult);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Unable to load market feed.');
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

  const breakingHeadlines = useMemo(
    () => news.slice(0, 6).map((item) => item.headline),
    [news]
  );

  return {
    news,
    events,
    breakingHeadlines,
    loading,
    error,
  };
}
