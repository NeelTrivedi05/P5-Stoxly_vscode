import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './OnboardingPage.css';

interface OnboardingData {
  dateOfBirth: string;
  salaryInr: string;
  experience: string;
  primaryGoal: string;
  sectors: string[];
  riskAppetite: string;
  investmentHorizon: string;
  recommendedInvestment: number;
  recommendedPct: number;
}

interface OptionItem {
  label: string;
  description?: string;
}

interface ProfilePreferences {
  [key: string]: unknown;
  onboarding_completed?: boolean;
  onboardingCompleted?: boolean;
  onboardingData?: OnboardingData;
}

const totalSteps = 7;

const experienceOptions: OptionItem[] = [
  { label: 'Beginner', description: 'Still learning market basics' },
  { label: 'Intermediate', description: 'Some exposure, some trades' },
  { label: 'Advanced', description: 'Confident and actively investing' },
];

const primaryGoalOptions: OptionItem[] = [
  { label: 'Learn' },
  { label: 'Track' },
  { label: 'Invest' },
  { label: 'All' },
];

const sectorOptions: OptionItem[] = [
  { label: 'IT & Technology' },
  { label: 'Banking & Finance' },
  { label: 'Pharma & Healthcare' },
  { label: 'Energy & Oil' },
  { label: 'FMCG & Consumer' },
  { label: 'Auto & EV' },
  { label: 'Real Estate' },
  { label: 'Infrastructure' },
];

const riskOptions: Array<OptionItem & { horizon: string }> = [
  {
    label: 'Low',
    description: 'Stable approach and lower volatility',
    horizon: '1-3 years',
  },
  {
    label: 'Medium',
    description: 'Balanced approach to growth and safety',
    horizon: '3-5 years',
  },
  {
    label: 'High',
    description: 'Higher risk for long-term upside',
    horizon: '5-10 years',
  },
];

const initialData: OnboardingData = {
  dateOfBirth: '',
  salaryInr: '',
  experience: '',
  primaryGoal: '',
  sectors: [],
  riskAppetite: '',
  investmentHorizon: '',
  recommendedInvestment: 0,
  recommendedPct: 0,
};

function PentagonIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="onb-logo-icon">
      <path
        fill="currentColor"
        d="M16 2.4L29.6 11.7L24.3 27.6H7.7L2.4 11.7L16 2.4Z"
      />
    </svg>
  );
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

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getRecommendationPct(salary: number): number {
  if (!salary || salary <= 0) {
    return 0;
  }

  if (salary < 25000) {
    return 10;
  }

  if (salary <= 50000) {
    return 15;
  }

  if (salary <= 100000) {
    return 20;
  }

  return 25;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, accessToken, updateProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [stepError, setStepError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const preferences = parsePreferences(user?.profile?.preferences);
    const hasCompleted =
      preferences.onboarding_completed === true ||
      preferences.onboardingCompleted === true;

    if (hasCompleted) {
      navigate('/dashboard');
    }
  }, [user?.profile?.preferences, navigate]);

  const firstName = useMemo(() => {
    const fullName = user?.profile?.full_name?.trim() || 'Investor';
    return fullName.split(' ')[0] || 'Investor';
  }, [user?.profile?.full_name]);

  const salaryValue = Number(data.salaryInr || 0);
  const recommendationPct = getRecommendationPct(salaryValue);
  const recommendedInvestment = Math.round((salaryValue * recommendationPct) / 100);

  const setValue = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSector = (label: string) => {
    setData((prev) => {
      const exists = prev.sectors.includes(label);
      return {
        ...prev,
        sectors: exists ? prev.sectors.filter((sector) => sector !== label) : [...prev.sectors, label],
      };
    });
  };

  const validateStep = (currentStep: number): string => {
    if (currentStep === 2) {
      if (!data.dateOfBirth) {
        return 'Please choose your date of birth.';
      }
      if (!data.salaryInr) {
        return 'Please enter your monthly take-home salary.';
      }
    }

    if (currentStep === 3 && !data.riskAppetite) {
      return 'Please choose your risk appetite.';
    }

    if (currentStep === 4 && !data.experience) {
      return 'Please select your trading experience.';
    }

    if (currentStep === 5 && !data.primaryGoal) {
      return 'Please select your primary goal.';
    }

    if (currentStep === 6 && !data.sectors.length) {
      return 'Please pick at least one sector.';
    }

    return '';
  };

  const goNext = () => {
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }

    setStepError('');
    setStep((prev) => Math.min(totalSteps, prev + 1));
  };

  const goBack = () => {
    setStepError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const selectRisk = (label: string) => {
    const selected = riskOptions.find((risk) => risk.label === label);
    if (!selected) {
      return;
    }

    setData((prev) => ({
      ...prev,
      riskAppetite: selected.label,
      investmentHorizon: selected.horizon,
    }));
  };

  const completeOnboarding = async () => {
    if (isSaving) {
      return;
    }

    if (!accessToken) {
      navigate('/auth');
      return;
    }

    setIsSaving(true);
    setStepError('');

    try {
      const existingPreferences = parsePreferences(user?.profile?.preferences);
      const payload: OnboardingData = {
        ...data,
        recommendedInvestment,
        recommendedPct: recommendationPct,
      };

      const mergedPreferences: ProfilePreferences = {
        ...existingPreferences,
        onboarding_completed: true,
        onboardingCompleted: true,
        onboardingData: payload,
      };

      await updateProfile({
        preferences: JSON.stringify(mergedPreferences),
      });

      navigate('/dashboard');
    } catch (error) {
      setStepError(error instanceof Error ? error.message : 'Failed to save onboarding preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderOption = (
    item: OptionItem,
    selected: boolean,
    onClick: () => void,
    multiselect = false
  ) => (
    <button
      type="button"
      key={item.label}
      className={`onb-chip ${selected ? 'selected' : ''} ${multiselect ? 'multi' : ''}`}
      onClick={onClick}
    >
      <span>{item.label}</span>
      {item.description ? <small>{item.description}</small> : null}
    </button>
  );

  return (
    <div className="onb-page">
      <div className="onb-card">
        <div className="onb-logo-row">
          <PentagonIcon />
          <span>Stoxly</span>
        </div>

        <div className="onb-progress-head">
          <p>Step {step} of {totalSteps}</p>
          <div className="onb-progress-dots" aria-label={`Progress step ${step} of ${totalSteps}`}>
            {Array.from({ length: totalSteps }).map((_, index) => {
              const dotStep = index + 1;
              return (
                <span
                  key={dotStep}
                  className={dotStep === step ? 'active' : dotStep < step ? 'done' : ''}
                />
              );
            })}
          </div>
        </div>

        <div className="onb-step" key={step}>
          {step === 1 && (
            <div className="onb-step-content onb-centered">
              <h1>Let&apos;s personalize your dashboard</h1>
              <p>A few quick questions so Stoxly can tune your plan and market feed.</p>
              <button type="button" className="onb-primary" onClick={goNext}>
                Get Started →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="onb-step-content">
              <h2>Basic info</h2>
              <p>Salary is used to compute your monthly investment recommendation.</p>

              <label className="onb-field" htmlFor="onb-dob">
                <span>Date of birth</span>
                <input
                  id="onb-dob"
                  type="date"
                  value={data.dateOfBirth}
                  onChange={(event) => setValue('dateOfBirth', event.target.value)}
                />
              </label>

              <label className="onb-field" htmlFor="onb-salary">
                <span>Monthly take-home salary (INR)</span>
                <div className="onb-money-input">
                  <b>₹</b>
                  <input
                    id="onb-salary"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    value={data.salaryInr}
                    placeholder="e.g. 50000"
                    onChange={(event) => setValue('salaryInr', event.target.value)}
                  />
                </div>
              </label>

              <div className="onb-recommendation">
                <p>Recommended monthly investment:</p>
                <strong>
                  {recommendedInvestment > 0
                    ? `${formatInr(recommendedInvestment)} (${recommendationPct}% of salary)`
                    : 'Enter salary to see recommendation'}
                </strong>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="onb-step-content">
              <h2>Risk appetite</h2>
              <p>Select one risk profile with the time horizon you are comfortable with.</p>
              <div className="onb-chip-list">
                {riskOptions.map((item) =>
                  renderOption(
                    {
                      label: `${item.label} (${item.horizon})`,
                      description: item.description,
                    },
                    data.riskAppetite === item.label,
                    () => selectRisk(item.label)
                  )
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="onb-step-content">
              <h2>Experience</h2>
              <p>Choose your current trading and investing comfort level.</p>
              <div className="onb-chip-list">
                {experienceOptions.map((item) =>
                  renderOption(item, data.experience === item.label, () => setValue('experience', item.label))
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="onb-step-content">
              <h2>Primary goal</h2>
              <p>Tell us what you want from Stoxly first.</p>
              <div className="onb-chip-grid compact">
                {primaryGoalOptions.map((item) =>
                  renderOption(item, data.primaryGoal === item.label, () => setValue('primaryGoal', item.label))
                )}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="onb-step-content">
              <h2>Sectors</h2>
              <p>Pick sectors you care about so your watchlist and digest stay relevant.</p>
              <div className="onb-chip-grid">
                {sectorOptions.map((item) =>
                  renderOption(item, data.sectors.includes(item.label), () => toggleSector(item.label), true)
                )}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="onb-step-content onb-centered">
              <h1>Ready, {firstName}</h1>
              <p>Your personalized setup is complete.</p>

              <ul className="onb-summary">
                <li>Recommended investment: {formatInr(recommendedInvestment)} ({recommendationPct}%)</li>
                <li>Risk profile: {data.riskAppetite || 'Not selected'} ({data.investmentHorizon || 'N/A'})</li>
                <li>Primary goal: {data.primaryGoal || 'Not selected'}</li>
              </ul>

              <button type="button" className="onb-primary" onClick={completeOnboarding} disabled={isSaving}>
                {isSaving ? <span className="onb-spinner" aria-hidden="true" /> : 'Go to Dashboard →'}
              </button>
            </div>
          )}
        </div>

        {stepError ? <p className="onb-error">{stepError}</p> : null}

        {step > 1 && step < totalSteps && (
          <div className="onb-actions">
            <button type="button" className="onb-ghost" onClick={goBack}>
              ← Back
            </button>
            <button type="button" className="onb-primary" onClick={goNext}>
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
