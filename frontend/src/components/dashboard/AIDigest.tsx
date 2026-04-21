import { Newspaper } from 'lucide-react';
import type { DashboardNewsItem } from '../../lib/api';

interface AIDigestProps {
  items: DashboardNewsItem[];
}

export default function AIDigest({ items }: AIDigestProps) {
  return (
    <section className="dash-card">
      <div className="dash-head-row">
        <p className="dash-meta with-icon">
          <Newspaper size={14} />
          AI Digest
        </p>
      </div>

      <div className="digest-list">
        {items.slice(0, 5).map((item) => (
          <article className="digest-item" key={item.id}>
            <header>
              <h3>{item.headline}</h3>
              <span className={`impact ${item.impact}`}>{item.impact}</span>
            </header>
            <p>{item.summary}</p>
            <footer>
              <small>{item.source}</small>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer">
                  Read
                </a>
              ) : null}
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
