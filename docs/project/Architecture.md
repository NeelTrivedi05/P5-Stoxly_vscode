# Stoxly Architecture (React + Vite + 3D Scroll Experience)

## 1. Architecture Goals
1. Deliver a cinematic first impression with 60fps scroll behavior.
2. Keep the frontend modular and production-ready, not a single-file page.
3. Preserve a clean path from landing site to product app modules.
4. Support future real-time data, personalization, and recommendation engines.

## 2. Current Frontend Stack (Implemented)
1. Framework: React 19 + TypeScript + Vite 8.
2. Styling: Custom CSS modules for high-fidelity visual control.
3. Animation Engine: Native scroll interpolation with `requestAnimationFrame`.
4. Media: MP4 hero background video served from `public/videos/hero.mp4`.

## 3. Repository Structure (Current)
1. `index.html`
- Vite entry shell.

2. `src/main.tsx`
- React mount/bootstrap.

3. `src/App.tsx`
- Landing page composition.
- Scroll engine phases for hero title, nav state, and section reveal.

4. `src/stoxly.css`
- Full high-fidelity visual system for hero, nav, slabs, mockups, and modal.

5. `src/index.css`
- Global reset + font imports and font variable mapping.

6. `vite.config.ts`
- Build and dev server configuration.

7. `public/videos/hero.mp4`
- Optimized landing video used in fixed cinematic background.

## 4. Scroll Animation System
1. Initial State:
- Full-screen video + oversized centered STOXLY wordmark.

2. Transition State:
- Scroll progress lerps logo scale/position to top-center.
- Nav dock fades and slides in after threshold.

3. Content State:
- Video slightly desaturates as white slab sections enter.
- Features slab appears first, then How It Works slab with matching visual language.

## 5. Visual System Decisions
1. Bold nav typography for legibility over moving video.
2. Glassmorphic dock: blur + saturation boost for readability.
3. Accent indexing numbers (`01`, `02`, `03`) in high-contrast electric hues.
4. Dark mockups on white cards for premium contrast and depth.
5. Floating mockup overlap to create spatial layering.

## 6. Performance and Quality Guardrails
1. Choose lightweight hero video variant for faster load.
2. Keep scroll animations transform/opacity-based for GPU acceleration.
3. Avoid heavy runtime layout thrashing.
4. Preserve mobile responsiveness with fluid sizing and breakpoints.

## 7. Next Build Targets
1. Add React Router route modules for `/auth`, `/dashboard`, `/onboarding`.
2. Introduce API client layer and schema-validated DTOs.
3. Add React Three Fiber modules for in-product 3D data scenes.
4. Add telemetry hooks for scroll depth and CTA conversion.

## 8. Backend and Data Extension Plan (Planned)
1. API Layer: Auth, watchlist, feed, alerts, recommendations.
2. Data Services: sentiment pipeline and trader activity detection.
3. Stores: PostgreSQL + Redis cache + time-series analytics store.
4. Reliability: queues, retry policies, and observability stack.
