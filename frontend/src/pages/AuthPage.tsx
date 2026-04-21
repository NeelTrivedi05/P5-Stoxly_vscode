import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AuthPage.css";

type AuthMode = "login" | "signup";

interface AuthFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface StoredUserProfile {
  full_name?: string;
  preferences?: string | null;
}

interface StoredUser {
  profile?: StoredUserProfile | null;
}

const initialFormState: AuthFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2.7 11.3C4.5 7.5 8 5 12 5c4 0 7.5 2.5 9.3 6.3a1.7 1.7 0 0 1 0 1.4C19.5 16.5 16 19 12 19c-4 0-7.5-2.5-9.3-6.3a1.7 1.7 0 0 1 0-1.4Zm9.3 5.2c2.4 0 4.3-2 4.3-4.5S14.4 7.5 12 7.5 7.7 9.5 7.7 12s1.9 4.5 4.3 4.5Zm0-2.2c-1.2 0-2.2-1-2.2-2.3s1-2.3 2.2-2.3 2.2 1 2.2 2.3-1 2.3-2.2 2.3Z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3.8 2.3 2.3 3.8l3.2 3.2a12.8 12.8 0 0 0-2.8 4.2 1.7 1.7 0 0 0 0 1.4C4.5 16.5 8 19 12 19c1.9 0 3.6-.6 5.1-1.5l3.1 3.2 1.5-1.5L3.8 2.3Zm8.2 14.2c-2.4 0-4.3-2-4.3-4.5 0-.6.1-1.1.3-1.6l1.8 1.8A2.4 2.4 0 0 0 12 14.4c.4 0 .8-.1 1.2-.3l1.8 1.8c-.9.4-1.9.6-3 .6Zm3.8-2.3-1.6-1.6c0-.2.1-.4.1-.6 0-1.3-1-2.3-2.2-2.3-.2 0-.4 0-.6.1L9.9 8.2c.7-.4 1.4-.7 2.1-.7 4 0 7.5 2.5 9.3 6.3a1.7 1.7 0 0 1 0 1.4c-.8 1.7-2.1 3.2-3.6 4.2l-1.9-1.9a10.8 10.8 0 0 0 2.8-3.3 10.7 10.7 0 0 0-2.8-3.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.8 3.1-4.4 3.1-7.5Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.8 0 5.1-.9 6.7-2.4l-3.2-2.6c-.9.6-2 .9-3.5.9-2.7 0-4.9-1.8-5.7-4.2H3v2.7A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.3 13.7A6 6 0 0 1 6 12c0-.6.1-1.2.3-1.7V7.6H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.4l3.3-2.7Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.1c1.5 0 2.9.5 3.9 1.5l2.9-2.9A10 10 0 0 0 12 2 10 10 0 0 0 3 7.6l3.3 2.7c.8-2.4 3-4.2 5.7-4.2Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function parsePreferences(preferences: string | null | undefined): Record<string, unknown> {
  if (!preferences) {
    return {};
  }

  try {
    const parsed = JSON.parse(preferences) as Record<string, unknown>;
    return parsed;
  } catch {
    return {};
  }
}

function hasCompletedOnboarding(user: StoredUser | null): boolean {
  const raw = user?.profile?.preferences;
  const preferences = parsePreferences(raw);

  return (
    preferences.onboarding_completed === true ||
    preferences.onboardingCompleted === true
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<AuthFormState>(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";

  const handleTabChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage("");
  };

  const handleFieldUpdate = (field: keyof AuthFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const readStoredUser = (): StoredUser | null => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as StoredUser;
    } catch {
      return null;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setErrorMessage("");

    if (!form.email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }

    if (!form.password.trim()) {
      setErrorMessage("Password is required.");
      return;
    }

    if (!isLogin) {
      if (!form.fullName.trim()) {
        setErrorMessage("Full name is required.");
        return;
      }

      if (form.password.length < 8) {
        setErrorMessage("Password must be at least 8 characters.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(form.email.trim(), form.password);
        const hasOnboarding = hasCompletedOnboarding(readStoredUser());
        navigate(hasOnboarding ? "/dashboard" : "/onboarding");
      } else {
        await signup(form.email.trim(), form.password, form.fullName.trim());
        navigate("/onboarding");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-left-panel">
        <div className="auth-grid-overlay" aria-hidden="true" />
        <div className="auth-glow-orb" aria-hidden="true" />

        <div className="auth-brand-row">
          <span className="auth-wordmark">STOXLY<span className="g">.</span></span>
        </div>

        <p className="auth-kicker">India-focused investing intelligence</p>

        <h1 className="auth-headline">
          <span>Understand the market,</span>
          <em>not just the price.</em>
        </h1>

        <p className="auth-description">
          AI-powered news pinned to price charts. Daily digests in plain English. Built for the
          next generation of Indian investors.
        </p>

        <div className="auth-signal-panel" aria-label="Platform value props">
          <article>
            <h3>Daily Signal Briefs</h3>
            <p>Top market movers explained in simple language every morning.</p>
          </article>
          <article>
            <h3>Chart + News Context</h3>
            <p>See why a stock moved, not only how much it moved.</p>
          </article>
        </div>
      </section>

      <section className="auth-right-panel">
        <div className="auth-card-shell">
          <div className="auth-card-head">
            <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
            <p>
              {isLogin
                ? "Log in to continue your personalized market digest."
                : "Set up your profile and start your onboarding in under a minute."}
            </p>
          </div>

          <div className="auth-tab-switch" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={isLogin ? "active" : ""}
              onClick={() => handleTabChange("login")}
            >
              Log in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={!isLogin ? "active" : ""}
              onClick={() => handleTabChange("signup")}
            >
              Sign up
            </button>
          </div>

          <div className="auth-fields">
            {!isLogin && (
              <label className="auth-field" htmlFor="auth-full-name">
                <span>FULL NAME</span>
                <input
                  id="auth-full-name"
                  type="text"
                  value={form.fullName}
                  onChange={(event) => handleFieldUpdate("fullName", event.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </label>
            )}

            <label className="auth-field" htmlFor="auth-email">
              <span>EMAIL</span>
              <input
                id="auth-email"
                type="email"
                value={form.email}
                onChange={(event) => handleFieldUpdate("email", event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="auth-field" htmlFor="auth-password">
              <span>PASSWORD</span>
              <div className="auth-password-wrap">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => handleFieldUpdate("password", event.target.value)}
                  placeholder="••••••••"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="auth-eye-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </label>

            {!isLogin && (
              <label className="auth-field" htmlFor="auth-confirm-password">
                <span>CONFIRM PASSWORD</span>
                <div className="auth-password-wrap">
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(event) => handleFieldUpdate("confirmPassword", event.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-eye-toggle"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <EyeIcon open={showConfirmPassword} />
                  </button>
                </div>
              </label>
            )}

            {isLogin && (
              <div className="auth-forgot-row">
                <Link to="/auth" onClick={(event) => event.preventDefault()}>
                  Forgot password?
                </Link>
              </div>
            )}

            {errorMessage && <p className="auth-error-text">{errorMessage}</p>}

            <button
              type="button"
              className="auth-primary-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="auth-button-spinner" aria-hidden="true" />
              ) : isLogin ? (
                "Continue →"
              ) : (
                "Create Account →"
              )}
            </button>

            <div className="auth-divider" aria-hidden="true">
              <span />
              <b>or</b>
              <span />
            </div>

            <button type="button" className="auth-google-button">
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <p className="auth-legal-note">
              By continuing, you agree to Stoxly&apos;s Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}