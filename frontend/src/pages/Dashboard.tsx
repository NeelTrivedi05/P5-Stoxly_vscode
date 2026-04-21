import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNews } from '../hooks/useNews';
import { usePortfolio } from '../hooks/usePortfolio';
import BreakingNewsSlider from '../components/dashboard/BreakingNewsSlider';
import AIDigest from '../components/dashboard/AIDigest';
import WatchlistWidget from '../components/dashboard/WatchlistWidget';
import EventsWidget from '../components/dashboard/EventsWidget';
import PortfolioDiversification from '../components/dashboard/PortfolioDiversification';
import PersonalizedPlan from '../components/dashboard/PersonalizedPlan';
import ShareToAnalyser from '../components/dashboard/ShareToAnalyser';
import './Dashboard.css';

interface ProfilePreferences {
  onboarding_completed?: boolean;
  onboardingCompleted?: boolean;
  onboardingData?: {
    salaryInr?: string;
  };
}

function parsePreferences(preferences: string | null | undefined): ProfilePreferences {
  if (!preferences) {
    return {};
  }

  try {
    return JSON.parse(preferences) as ProfilePreferences;
  } catch {
    return {};
  }
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function Dashboard() {
  const { user, accessToken } = useAuth();
  const preferences = parsePreferences(user?.profile?.preferences);

  const hasCompletedOnboarding =
    preferences.onboarding_completed === true ||
    preferences.onboardingCompleted === true;

  const firstName = useMemo(() => {
    const fullName = user?.profile?.full_name?.trim() || 'Investor';
    return fullName.split(' ')[0] || 'Investor';
  }, [user?.profile?.full_name]);

  const { news, events, breakingHeadlines, loading: feedLoading, error: feedError } = useNews(accessToken);
  const {
    analysis,
    plan,
    watchlistQuotes,
    loading: portfolioLoading,
    error: portfolioError,
    shareLink,
    createShareLink,
  } = usePortfolio(accessToken);

  if (!user || !accessToken) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <main className="dash-page">
      <section className="dash-hero">
        <div>
          <h1>Good evening, {firstName} <span role="img" aria-label="wave">👋</span></h1>
          <p>Here&apos;s what moved markets while you were away.</p>
        </div>
        <time>{formatDate()}</time>
      </section>

      {feedError ? <p className="dash-error">{feedError}</p> : null}
      {portfolioError ? <p className="dash-error">{portfolioError}</p> : null}

      <BreakingNewsSlider headlines={breakingHeadlines} />

      <section className="dash-grid two-col">
        <AIDigest items={news} />
        <WatchlistWidget quotes={watchlistQuotes} />
      </section>

      <section className="dash-grid two-col">
        <EventsWidget events={events} />
        <PortfolioDiversification analysis={analysis} />
      </section>

      <PersonalizedPlan plan={plan} />
      <ShareToAnalyser shareLink={shareLink} onShare={createShareLink} />

      {(feedLoading || portfolioLoading) ? <p className="dash-muted">Refreshing dashboard data...</p> : null}
    </main>
  );
}
