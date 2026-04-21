# Stoxly Product Requirements Document (PRD)

## Document Control
- Product: Stoxly
- Version: 0.1 (Draft)
- Date: 2026-03-23
- Owner: Product + Engineering
- Status: Working Draft

## 1. Product Vision
Stoxly is a mobile-first investing intelligence platform that helps users cut through market noise by focusing only on the stocks they care about, while guiding safer long-term decisions through personalized diversification insights.

The web experience should feel premium and modern, with a 3D visual layer that improves understanding (not decoration only).

## 2. Problem Statement
Retail investors face three main problems:
1. Information overload from generic market news.
2. Slow reaction to meaningful events in followed stocks.
3. Poor portfolio allocation decisions due to unclear risk/time-horizon planning.

## 3. Goals
1. Increase relevant signal quality for each user.
2. Improve user confidence in portfolio decisions.
3. Reduce reaction time to meaningful stock events.
4. Build a differentiated 3D product experience.

## 4. Non-Goals (MVP)
1. Fully automated trading execution.
2. Social trading or copy trading.
3. Derivatives/options strategy engine.
4. Tax filing automation.

## 5. Target Users
1. Beginner to intermediate retail investors.
2. Users with salaried income and monthly savings.
3. Long-term wealth builders with 1-20 year goals.

## 6. Core Features (From Current Notes)
1. Personalized Watchlist
- User follows specific stocks.
- Watchlist is the primary context for content and alerts.

2. Personalized News Feed
- News is filtered to user-followed stocks.
- Generic market noise is deprioritized.

3. Push/Broadcast Alerts (Web + Mobile Later)
- Breaking news notifications for followed stocks.
- Significant movement alerts (price/volume/news sentiment triggers).

4. Sentiment Indicator
- Per-stock sentiment meter (bullish/neutral/bearish).
- Confidence score with source count.

5. Trader Activity Signals
- Simple signal like "70% bullish".
- Unusual buy activity spike detection with warning cards.

6. Portfolio Diversification Advisor
- Collect user profile: age, salary, post-expense savings, amount willing to invest.
- Collect horizon: short (1-3), medium (5-10), long (10-20 years).
- Suggest allocation mix across index funds, stocks, commodities, bonds.
- Optional: user can override and choose own mix.

7. Goal Value Projection
- Show target corpus estimate by horizon.
- Include inflation-adjusted projection.
- Show optimistic/base/conservative scenarios.

## 7. Additional Features To Discuss (Suggested)
1. Risk tolerance quiz (conservative/moderate/aggressive).
2. Rebalancing reminders when allocation drifts.
3. Explainability panel: "Why this alert/suggestion?"
4. Learning cards for beginners (risk, inflation, diversification basics).

## 8. UX Principles
1. Signal over noise.
2. Fast readability for key actions.
3. Trust through explainability.
4. 3D visuals only where they improve understanding.

## 9. Success Metrics
1. % users completing onboarding profile.
2. Daily active watchlist users.
3. Alert open rate.
4. % users viewing diversification recommendations.
5. 30-day retention.

## 10. MVP Scope
Included:
1. Onboarding profile + horizon capture.
2. Watchlist + personalized feed.
3. Sentiment + trader activity signal cards.
4. Diversification recommendation + inflation-aware projection.

Excluded:
1. Brokerage integrations.
2. In-app trade execution.
3. Advanced derivatives analytics.

## 11. Risks and Mitigations
1. Risk: Users over-trust simplified indicators.
- Mitigation: Always show confidence and data sources.

2. Risk: Alert fatigue.
- Mitigation: User-controlled alert thresholds and frequency.

3. Risk: 3D UI hurts performance.
- Mitigation: Progressive enhancement + fallback 2D mode.

## 12. Compliance and Disclaimers
1. Educational/informational use only.
2. Not financial advice.
3. Market data attribution and licensing required.
