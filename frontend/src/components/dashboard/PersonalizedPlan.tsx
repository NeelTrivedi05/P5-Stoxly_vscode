import { Target } from 'lucide-react';
import type { PersonalizedPlanResponse } from '../../lib/api';

interface PersonalizedPlanProps {
  plan: PersonalizedPlanResponse | null;
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PersonalizedPlan({ plan }: PersonalizedPlanProps) {
  return (
    <section className="dash-card wide">
      <div className="dash-head-row">
        <p className="dash-meta with-icon">
          <Target size={14} />
          Your Personalized Plan
        </p>
      </div>

      {!plan ? (
        <p className="dash-muted">Complete onboarding to unlock your plan.</p>
      ) : (
        <>
          <p className="plan-highlight">
            Recommended monthly investment:{' '}
            <strong>{formatInr(plan.recommended_monthly_investment)}</strong>
          </p>
          <p className="dash-muted">
            Suggested range: {formatInr(plan.range_min)} - {formatInr(plan.range_max)} | Emergency fund target:{' '}
            {plan.emergency_fund_target_months} months
          </p>

          <div className="plan-grid">
            {plan.suggested_buckets.map((bucket) => (
              <article key={bucket.name}>
                <h4>{bucket.name}</h4>
                <p>{bucket.percent}% ({formatInr(bucket.amount)})</p>
                <small>{bucket.rationale}</small>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
