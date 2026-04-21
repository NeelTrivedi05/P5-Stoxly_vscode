import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './App.css';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LandingPage = lazy(() => import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));

function AppLoading() {
  return (
    <div className="app-loading" role="status" aria-live="polite" aria-label="Loading Stoxly">
      <div className="app-loading-card">
        <div className="app-loading-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="app-loading-kicker">STOXLY</p>
          <h1>Preparing your market workspace</h1>
          <p className="app-loading-copy">Loading the next view with a smaller, faster bundle.</p>
        </div>
      </div>
    </div>
  );
}

interface StoredPreferences {
  onboarding_completed?: boolean;
  onboardingCompleted?: boolean;
}

function parsePreferences(preferences: string | null | undefined): StoredPreferences {
  if (!preferences) {
    return {};
  }

  try {
    return JSON.parse(preferences) as StoredPreferences;
  } catch {
    return {};
  }
}

function hasCompletedOnboarding(preferences: string | null | undefined): boolean {
  const parsed = parsePreferences(preferences);
  return parsed.onboarding_completed === true || parsed.onboardingCompleted === true;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const isAuthed = Boolean(user);
  const onboardingDone = hasCompletedOnboarding(user?.profile?.preferences);

  return (
    <Suspense fallback={<AppLoading />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/auth"
          element={isAuthed ? <Navigate to={onboardingDone ? '/dashboard' : '/onboarding'} replace /> : <AuthPage />}
        />

        <Route
          path="/onboarding"
          element={isAuthed ? <OnboardingPage /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/dashboard"
          element={
            isAuthed ? (
              onboardingDone ? <Dashboard /> : <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
