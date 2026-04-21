import { LineChart } from 'lucide-react';
import type { StockQuoteResponse } from '../../lib/api';

interface WatchlistWidgetProps {
  quotes: StockQuoteResponse[];
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function WatchlistWidget({ quotes }: WatchlistWidgetProps) {
  return (
    <section className="dash-card">
      <div className="dash-head-row">
        <p className="dash-meta with-icon">
          <LineChart size={14} />
          Watchlist
        </p>
      </div>

      {quotes.length ? (
        <ul className="watchlist-grid">
          {quotes.map((quote) => (
            <li key={quote.symbol}>
              <strong>{quote.symbol}</strong>
              <span>{formatPrice(quote.price)}</span>
              <em className={quote.change >= 0 ? 'up' : 'down'}>
                {quote.change >= 0 ? '+' : ''}{quote.change_percent}%
              </em>
            </li>
          ))}
        </ul>
      ) : (
        <p className="dash-muted">No symbols in your watchlist yet.</p>
      )}
    </section>
  );
}
