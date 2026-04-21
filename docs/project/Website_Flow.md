# Stoxly Website Flow (User Journey + Button-Level Behavior)

## 1. Entry
1. User lands on Home page.
2. User clicks `Get Started`.
3. System routes to Sign Up / Login.

## 2. Authentication
1. User clicks `Create Account`.
2. System creates user profile and session.
3. User is redirected to onboarding.

Alternative:
1. User clicks `Login`.
2. System validates credentials.
3. User goes to Dashboard.

## 3. Onboarding (Profile + Goal Setup)
1. User enters age and salary,  and risk apetite,then clicks `Next`.
- System stores profile draft.

2. User enters post-expense monthly savings and investment amount, then clicks `Next`.
- System validates affordability and stores finance profile.

3. User selects horizon: `Short`, `Medium`, or `Long`, then clicks `Generate Plan`.
- System calls recommendation service and returns allocation + projections.

4. User clicks `Accept Plan` or `Customize Plan`.
- `Accept Plan`: allocation becomes default portfolio strategy.
- `Customize Plan`: open editable allocation sliders.

## 4. Watchlist Setup
1. User searches a ticker and clicks `+ Add`.
- System adds stock to watchlist and starts personalized feed tracking.

2. User clicks `Done`.
- System routes to main dashboard.

## 5. Dashboard Main Journey
1. User clicks `Watchlist` tab.
- System displays followed stocks with quick stats.

2. User clicks `News Feed` tab.
- System shows only relevant news linked to followed stocks.

3. User clicks `Sentiment` card on a stock.
- System opens detailed sentiment breakdown and confidence.

4. User clicks `Trader Activity` card.
- System shows bullish/bearish ratio and unusual activity flags.

5. User clicks `Diversification` tab.
- System shows allocation, drift status, and goal projections.

## 6. Alert Journey
1. User clicks `Alert Settings`.
2. User toggles:
- Breaking news alerts.
- Sentiment shift alerts.
- Unusual activity spike alerts.

3. User clicks `Save Alerts`.
- System updates alert preferences.

4. On event trigger, user clicks incoming notification.
- System deep-links to stock insight panel.

## 7. Projection Journey
1. User clicks `Projection Details`.
2. System shows optimistic/base/conservative projections.
3. User clicks `Adjust Inflation` slider.
4. System recalculates projected target corpus instantly.

## 8. Optional 3D Interaction Journey
1. User clicks `3D View` on dashboard.
2. System loads 3D module if supported.
3. User rotates/interacts with allocation scene.
4. User clicks `Switch to Simple View` anytime for 2D fallback.
