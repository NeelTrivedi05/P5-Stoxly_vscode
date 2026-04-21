import { useState } from 'react';
import { Share2 } from 'lucide-react';
import type { SharePortfolioResponse } from '../../lib/api';

interface ShareToAnalyserProps {
  shareLink: SharePortfolioResponse | null;
  onShare: (note?: string) => Promise<void>;
}

export default function ShareToAnalyser({ shareLink, onShare }: ShareToAnalyserProps) {
  const [note, setNote] = useState('Please review my allocation and risk spread.');

  const handleCopy = async () => {
    if (!shareLink?.share_url) {
      return;
    }
    await navigator.clipboard.writeText(shareLink.share_url);
  };

  return (
    <section className="dash-card wide share-card">
      <div className="dash-head-row">
        <p className="dash-meta with-icon">
          <Share2 size={14} />
          Share Portfolio to Analyser
        </p>
      </div>

      <label className="share-note">
        <span>Context for analyser</span>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
      </label>

      <div className="share-actions">
        <button type="button" className="dash-btn" onClick={() => onShare(note)}>
          Generate Share Link
        </button>
        {shareLink ? (
          <>
            <a href={shareLink.share_url} target="_blank" rel="noreferrer">
              Open link
            </a>
            <button type="button" className="dash-btn ghost" onClick={handleCopy}>
              Copy
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}
