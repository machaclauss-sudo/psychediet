# PsycheDiet

## Current State
- Full app with Internet Identity login, onboarding, food/mood logging, insights, recommendations, community, admin panel
- RecommendationsPage: static list of recommended foods, foods to avoid, nutrient targets, AI personalized section
- ResourcesPage: 5 articles (expandable), 4 recipe cards with images
- Admin panel: user management, analytics, audit logs at `/admin/login` (emmanuel.m / Emma@1234)
- LoginPage: Internet Identity only (no username/password for regular users)

## Requested Changes (Diff)

### Add
- User login with username/password credentials (register + login flow, stored in localStorage, mirroring admin credential pattern)
- Dietary preference filter tabs/chips on RecommendationsPage (All, Vegan, Gluten-Free, Mediterranean, African, Asian)
- Mood-adaptive recommendation section: show different food suggestions based on current mood score (calming foods when anxiety/low mood, brain-focus foods for cognitive goals)
- Multi-cuisine meal recommendations: African, Asian, Mediterranean dishes
- More educational content in ResourcesPage:
  - 4+ more articles (sleep nutrition, ADHD diet, tryptophan/serotonin, anti-inflammatory foods)
  - Step-by-step recipe instructions (expand recipe cards to show steps)
  - Video resource cards with embedded YouTube links (nutritionist/mental health expert videos)
  - Visual fact cards / infographic-style stat highlights
- Admin educational content management: new admin page at `/admin/content` where admin can add/edit/remove educational articles and recipes (stored in localStorage for now)

### Modify
- LoginPage: add tab or toggle to switch between "Internet Identity" and "Username & Password" login
- RecommendationsPage: add filter chips, mood-adaptive section at top, expand food list with multi-cuisine items
- ResourcesPage: add video section, fact cards section, expand recipes with step-by-step instructions
- AdminLayout: add "Content" nav link pointing to `/admin/content`
- App.tsx: add route for `/admin/content`

### Remove
- Nothing removed

## Implementation Plan
1. Create `useUserAuth` hook managing localStorage-based username/password credentials (register, login, logout, isLoggedIn)
2. Update `LoginPage` to show two tabs: Internet Identity and Username/Password; II tab stays as-is, credentials tab shows register/login form
3. Update `AppLayout` to check both II identity and user credential auth
4. Update `RecommendationsPage`: add filter state, filter chips, mood-adaptive top section (uses last mood score from insights), multi-cuisine food data
5. Update `ResourcesPage`: add more articles array, video cards section, fact cards section, expand recipe cards with step-by-step steps
6. Create `AdminContentPage` at `src/frontend/src/pages/admin/AdminContentPage.tsx` with add/edit/delete for articles and recipes stored in localStorage
7. Update `AdminLayout` nav to include Content link
8. Update `App.tsx` with new route and import
