# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Build to dist/ (required before syncing to iOS)
npm run lint      # Run ESLint
npm run preview   # Preview the production build locally
```

### iOS (Capacitor)

```bash
npx cap sync ios                   # Copy dist/ into the iOS project
npx cap open ios                   # Open Xcode
npx cap run ios --target=<device>  # Build and run on a device/simulator
```

Always run `npm run build` before `npx cap sync ios` — Capacitor serves from `dist/`.

To push directly to a connected physical device (no Xcode UI needed):

```bash
# Build for device
xcodebuild -project ios/App/App.xcodeproj -scheme App \
  -destination 'platform=iOS,id=<UDID>' -configuration Debug build

# Install + launch
xcrun devicectl device install app --device <UDID> <path-to-App.app>
xcrun devicectl device process launch --device <UDID> com.ashumishra.claudefirstapp
```

The iPhone 17 Pro device UDID is `7BCF0A8C-417D-5C61-B304-BC4AED64660D`. The built `.app` lands in `~/Library/Developer/Xcode/DerivedData/App-*/Build/Products/Debug-iphoneos/App.app`.

## Architecture

**HabitHen** is a habit-tracking PWA built with React 19 + Vite, wrapped in a Capacitor iOS shell.

### Data layer

All state lives in a single `localStorage` key (`habitTracker_v1`) managed by `src/hooks/useHabits.js`. The shape is:

```js
{ habits: [{ id, name, createdAt, color }], completions: { [habitId]: ['YYYY-MM-DD', ...] } }
```

`useHabits` is the only place that reads/writes this storage. Components receive data and callbacks as props — no context or external state library.

Achievement unlock history is persisted separately under `habitTracker_achievements_v1` as a JSON array of achievement IDs, managed by `src/utils/achievements.js`.

### Component tree

```
main.jsx           ThemeProvider + GlobalStyles wrapper
└── App.jsx        Owns all modal/burst/achievement UI state; wires useHabits → children
    ├── Dashboard       Summary stats (total, completed today, best streak, weekly %)
    ├── HabitList       Renders a HabitRow per habit
    │   └── HabitRow    Toggle button, MiniCalendar (7-day view), streak, delete trigger
    ├── AddHabitModal   Controlled form; calls addHabit on submit
    ├── DeleteDialog    Confirmation dialog; calls deleteHabit on confirm
    ├── ConfettiBurst   Canvas-based particle effect; positioned at toggle click coords
    ├── AchievementToast  Queued toast; App drains the queue one at a time; plays sound on mount
    └── HenMascot      Decorative animated SVG mascot; reacts to `excited` prop
```

### Theme

The styled-components theme is defined once in `main.jsx` and injected via `ThemeProvider`. All components consume it via `${({ theme }) => theme.*}`. The color palette, border radii, and shadows are all in that single theme object — add new tokens there rather than hardcoding values in components.

### Date handling

All dates are ISO strings in `YYYY-MM-DD` format via `en-CA` locale. Use `getToday()` and `dateMinus()` from `src/utils/dates.js` — never construct date strings manually to avoid timezone bugs.

### Achievement system

`checkAchievements()` in `src/utils/achievements.js` is called *before* state is committed (the hook passes a hypothetical next-completions map). It returns newly unlocked achievement objects; the caller is responsible for persisting the shown-set. Milestones are streak-based and keyed per habit ID.

### Sound

`src/utils/sounds.js` exports `playAchievementSound()`, which synthesises a C5→E5→G5 arpeggio via the Web Audio API — no audio files, works offline and in the Capacitor WebView. `AchievementToast` calls it on mount. Sound is silenced on iOS when the device is on silent/mute.

### iOS safe area

The `AppBar` uses `padding: max(12px, env(safe-area-inset-top)) 16px 12px` to avoid the Dynamic Island and status bar on notched/pill-cutout devices. `index.html` already includes `viewport-fit=cover` which is required for `env(safe-area-inset-top)` to have a non-zero value.