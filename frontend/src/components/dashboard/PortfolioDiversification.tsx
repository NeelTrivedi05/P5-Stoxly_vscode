import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChartIcon } from 'lucide-react';
import type { PortfolioAnalysisResponse } from '../../lib/api';

interface PortfolioDiversificationProps {
  analysis: PortfolioAnalysisResponse | null;
}

export default function PortfolioDiversification({ analysis }: PortfolioDiversificationProps) {
  return (
    <section className="dash-card">
      <div className="dash-head-row">
        <p className="dash-meta with-icon">
          <PieChartIcon size={14} />
          Portfolio Diversification
        </p>
      </div>

      {!analysis ? (
        <p className="dash-muted">Portfolio analysis is not available yet.</p>
      ) : (
        <>
          <div className="pie-wrap" aria-label="Portfolio allocation chart">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={analysis.allocation}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {analysis.allocation.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="dash-muted">{analysis.insight}</p>
        </>
      )}
    </section>
  );
}
