# Blushing Birdie Golf Tracker - Refactored

## Development and verification

Use Node.js 24 (`.nvmrc`) and run `npm ci` to install the locked dependencies.
The app uses React with Vite and Vitest:

- `npm run dev` — local development.
- `npm run build` — production files in `build/` (the existing Netlify publish directory).
- `npm run preview` — serve the production build locally.
- `npm test` — run the tests once.
- `npm run test:watch` — run tests while editing.
- `npm audit` — check dependencies for known vulnerabilities.

`index.html` at the repository root is the Vite entry, loading `src/index.jsx`.
React components use `.jsx` extensions. Static files in `public/` are copied to
the build, including the manifest, security headers, and SPA redirect rule.
The migration preserves browser storage keys, record formats, and `/app`.
Preview deployments must be reviewed before publishing production changes.

This is the refactored version of the Blushing Birdie golf tracking app, reorganized from a single 3392-line App.js into a modular, maintainable codebase.

## Project Structure

```
src/
├── App.js                 # Main app component with navigation logic
├── index.js               # React entry point
├── index.css              # Global styles
├── SplashScreen.css       # Splash screen animations
│
├── assets/
│   └── images/            # Logo and tagline images
│       ├── Blushing_Birdie_Logo.png
│       └── Blushing_Birdie_Tagline.png
│
├── components/            # Reusable UI components
│   ├── index.js           # Component exports
│   ├── NumberPad.js       # Numeric input pad for yardage
│   ├── QuickCounter.js    # Tap-to-count component for shots
│   ├── Modal.js           # Reusable modal component
│   └── SplashScreen.js    # App splash/loading screen
│
├── constants/
│   └── index.js           # Colors, quotes, storage keys
│
├── hooks/
│   ├── index.js           # Hook exports
│   └── useStorage.js      # Custom hooks for data persistence
│       ├── useRounds()    # Rounds data with localStorage
│       ├── useCourses()   # Courses data with localStorage
│       └── useCurrentRound() # Active round state management
│
├── screens/               # Full-page screen components
│   ├── index.js           # Screen exports
│   ├── HomeScreen.js      # Main dashboard
│   ├── SelectCourseScreen.js  # Course selection before round
│   ├── LogRoundScreen.js      # Hole-by-hole scoring
│   ├── RoundCompleteScreen.js # Post-round summary
│   ├── StatsScreen.js         # Statistics and round history
│   ├── ManageCoursesScreen.js # View/edit/delete courses
│   ├── CreateCourseScreen.js  # Create new course
│   └── ShopScreen.js          # Shop placeholder
│
└── utils/
    └── index.js           # Utility functions
        ├── generateId()       # Unique ID generation
        ├── getLocalDateString()   # Date formatting
        ├── formatDateForDisplay() # Display date formatting
        ├── calcStats()        # Statistics calculations
        ├── calcOverallStats() # Overall statistics
        ├── exportToCSV()      # CSV export
        ├── downloadCSV()      # File download
        └── formatScoreToPar() # Score formatting
```

## Key Improvements

### 1. Component Separation
- **NumberPad** and **QuickCounter** moved outside the main component
- These are now proper React components that don't recreate on every render
- Improves performance and enables reuse

### 2. Unique IDs for Rounds
- All rounds now have unique IDs generated with `generateId()`
- Format: `{timestamp}-{random9chars}` (e.g., `1701619200000-a1b2c3d4e`)
- Prevents deletion bugs when rounds have same date/course
- Migration: Old data without IDs gets IDs assigned on load

### 3. Custom Hooks for Data Management
- `useRounds()` - Manages rounds with localStorage persistence
- `useCourses()` - Manages courses with localStorage persistence
- Centralizes data logic and reduces prop drilling

### 4. Separated Screen Components
Each screen is now its own file with focused responsibility:
- Easier to find and modify specific features
- Smaller files are easier to review and test
- Clear boundaries between features

### 5. Centralized Constants
- Colors, quotes, and storage keys in one place
- Easy to update branding/theming
- No magic strings scattered through code

### 6. Utility Functions
- Reusable date formatting, stats calculations
- CSV export logic extracted and testable
- Clean, pure functions with single responsibilities

## Migration Notes

When switching to this refactored version:

1. **Copy your images** to `src/assets/images/`
2. **Data is backward compatible** - existing localStorage data will work
3. **IDs are auto-generated** - old rounds get IDs on first load

## Future Improvements

Consider adding:
- [ ] TypeScript for type safety
- [ ] Unit tests for utility functions
- [ ] React Testing Library tests for components
- [ ] Context API for deeply nested state
- [ ] React Query for data management
- [ ] Storybook for component documentation

## File Size Comparison

| Before | After |
|--------|-------|
| App.js: 3,392 lines | App.js: ~200 lines |
| 1 file | 20+ focused files |

Each screen/component is now typically 100-400 lines - much more manageable!

## Public-page HTML

`npm run build` creates the Vite client bundle, then renders the existing public
React pages to HTML at build time. The homepage, Our Story, Privacy, Journal index,
and every article have their own initial content, canonical, title, social tags,
and structured data. The `/app` route stays client-rendered and retains its
`noindex,nofollow` policy. Scoring and local storage are unchanged.

Page components remain the source of both content and SEO options. Adding an
article to `journalArticles` automatically adds its HTML output; update the sitemap
when adding or removing public URLs. The non-forced Netlify SPA fallback allows
existing generated HTML to be served while preserving app routing.

Run `node scripts/check-public-html.mjs` after building to verify public content,
route metadata, structured data, and local assets. Run `npm test` for tracker tests.
Temporary server build files in `.prerender/` are removed after generation and are
not published. No server runtime or new dependencies are required.
