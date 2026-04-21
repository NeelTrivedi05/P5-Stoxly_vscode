import { CalendarClock } from 'lucide-react';
import type { MarketEventItem } from '../../lib/api';

interface EventsWidgetProps {
  events: MarketEventItem[];
}

export default function EventsWidget({ events }: EventsWidgetProps) {
  return (
    <section className="dash-card">
      <div className="dash-head-row">
        <p className="dash-meta with-icon">
          <CalendarClock size={14} />
          Recent Events
        </p>
      </div>

      {events.length ? (
        <ul className="events-list">
          {events.slice(0, 5).map((event) => (
            <li key={event.id}>
              <div>
                <p>{event.title}</p>
                <small>{event.detail}</small>
              </div>
              <span className={`event-status ${event.status}`}>{event.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="dash-muted">No events available.</p>
      )}
    </section>
  );
}
