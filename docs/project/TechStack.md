# Stoxly Tech Stack (Proposed)

## 1. Frontend
1. Framework: Next.js (React, TypeScript).
2. Styling: Tailwind CSS + CSS variables for design tokens.
3. 3D Layer: Three.js + React Three Fiber + Drei.
4. Animation: Framer Motion.
5. Charts: Recharts or ECharts for 2D analytics.

## 2. Backend
1. Runtime: Node.js (TypeScript).
2. API: NestJS or Express with modular architecture.
3. Realtime/Events: WebSockets + queue workers.

## 3. Data Layer
1. Primary DB: PostgreSQL.
2. Cache: Redis.
3. Time-Series/Analytics: TimescaleDB extension or ClickHouse (later stage).

## 4. Intelligence Layer
1. Sentiment/NLP: Python microservice (FastAPI) or managed NLP APIs.
2. Rules Engine: TypeScript service for MVP recommendations.
3. Forecasting: Scenario-based projections with inflation modeling.

## 5. Infra and DevOps
1. Hosting: Vercel (frontend) + cloud containers (backend/workers).
2. CI/CD: GitHub Actions.
3. Monitoring: OpenTelemetry + Grafana/Datadog.
4. Error Tracking: Sentry.

## 6. Security
1. Auth: Clerk/Auth.js/Supabase Auth (choose one).
2. Secrets: Cloud secret manager.
3. Data controls: Encryption at rest and in transit.

## 7. Why This Stack
1. Fast iteration for MVP.
2. Strong 3D ecosystem in React.
3. Clear path to scale with queue + cache + modular services.
