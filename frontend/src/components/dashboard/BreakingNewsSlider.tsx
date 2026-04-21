import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';

interface BreakingNewsSliderProps {
  headlines: string[];
}

export default function BreakingNewsSlider({ headlines }: BreakingNewsSliderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (headlines.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % headlines.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, [headlines]);

  if (!headlines.length) {
    return (
      <section className="dash-card dash-breaking">
        <p className="dash-meta">Breaking News</p>
        <p className="dash-muted">No breaking headlines at the moment.</p>
      </section>
    );
  }

  return (
    <section className="dash-card dash-breaking" aria-live="polite">
      <p className="dash-meta with-icon">
        <Radio size={14} />
        Breaking News
      </p>
      <h2>{headlines[index]}</h2>
      <div className="dash-slider-dots" aria-hidden="true">
        {headlines.map((_, dotIndex) => (
          <span key={dotIndex} className={dotIndex === index ? 'active' : ''} />
        ))}
      </div>
    </section>
  );
}
