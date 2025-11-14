# Sakhi 🌸 - Testing Checklist for New Features

## Overview
This checklist covers the five new features added to the Sakhi PCOS Companion app:
1. ✨ Motivational Nudges
2. ⏰ Wellness Reminders  
3. 🌐 Language Settings (English/Hindi)
4. 🤖 Random Forest Assessment Scoring
5. 🔄 Regenerate Diet Plan Feature

---

## 1. ✨ Motivational Nudges

### Setup & Display
- [ ] Open the app and navigate to **Home Screen**
- [ ] Wait 3 seconds - a motivational nudge card should appear below the greeting
- [ ] Verify the nudge has:
  - [ ] Gradient background (primary/secondary colors)
  - [ ] Sparkles icon
  - [ ] "Daily Motivation" header
  - [ ] Random motivational message
  - [ ] Close (X) button

### Functionality
- [ ] Click the X button - nudge should disappear
- [ ] Refresh the page - nudge should NOT reappear (localStorage check)
- [ ] Clear localStorage (`sakhi_last_nudge`) and refresh - nudge should appear again after 3 seconds

### Settings Integration
- [ ] Go to **Profile Screen**
- [ ] Find "Motivational Nudges" toggle
- [ ] Turn OFF the toggle
- [ ] Go back to Home Screen
- [ ] Wait 3 seconds - nudge should NOT appear
- [ ] Turn toggle back ON - nudge should work again (after localStorage clear)

---

## 2. ⏰ Wellness Reminders

### Settings Configuration
- [ ] Go to **Profile Screen**
- [ ] Click on "Wellness Reminders" row
- [ ] Dialog should open with three toggles:
  - [ ] Morning Reminder (7 AM - 12 PM)
  - [ ] Afternoon Reminder (1 PM - 6 PM)
  - [ ] Evening Reminder (7 PM - 10 PM)

### Testing Reminders (Time-based)
**Note**: These are time-sensitive. Test during appropriate hours or modify times in `/utils/wellnessReminders.ts` for testing.

#### Morning Reminder (7 AM - 12 PM)
- [ ] Enable "Morning Reminder" toggle
- [ ] During morning hours, a toast notification should appear with:
  - [ ] Emoji icon (☀️, 🌅, 📊, 🍳, or 👟)
  - [ ] Morning wellness message
- [ ] Reminder should only show once per morning period
- [ ] Check localStorage for `sakhi_morning_reminder` timestamp

#### Afternoon Reminder (1 PM - 6 PM)
- [ ] Enable "Afternoon Reminder" toggle
- [ ] During afternoon hours, should show toast with:
  - [ ] Emoji icon (💦, 🍎, 😮‍💨, 🕉️, or 🥗)
  - [ ] Afternoon wellness message
- [ ] Should only show once per afternoon period
- [ ] Check localStorage for `sakhi_afternoon_reminder` timestamp

#### Evening Reminder (7 PM - 10 PM)
- [ ] Enable "Evening Reminder" toggle
- [ ] During evening hours, should show toast with:
  - [ ] Emoji icon (🌙, ✅, ☕, 🌃, or 📔)
  - [ ] Evening wellness message
- [ ] Should only show once per evening period
- [ ] Check localStorage for `sakhi_evening_reminder` timestamp

### Integration
- [ ] Reminders respect the "Notifications" master toggle
- [ ] If notifications are OFF, wellness reminders should not show
- [ ] Reminders initialize when HomeScreen mounts
- [ ] Check every 30 minutes (interval set correctly)

---

## 3. 🌐 Language Settings (English/Hindi)

### Language Selection
- [ ] Go to **Profile Screen**
- [ ] Click on "Language" row (currently shows "English" or "हिंदी")
- [ ] Dialog opens with two language options:
  - [ ] English (with Globe icon)
  - [ ] हिंदी / Hindi (with Globe icon)
- [ ] Selected language is highlighted (default variant)

### English Translation
- [ ] Select "English"
- [ ] Toast shows: "Language changed to English! 🌐"
- [ ] Dialog closes
- [ ] Verify language display shows "English" in Profile

### Hindi Translation  
- [ ] Select "हिंदी (Hindi)"
- [ ] Toast shows: "Language changed to Hindi! 🌐"
- [ ] Dialog closes
- [ ] Verify language display shows "हिंदी" in Profile

### Translation Integration
**Note**: Currently, translations are set up but UI text remains in English. To verify translation system works:

- [ ] Check `/utils/translations.ts` file exists
- [ ] Contains both `en` and `hi` translation objects
- [ ] `getTranslation()` function works correctly
- [ ] `getLanguageName()` returns correct names
- [ ] Settings store language preference in AppContext
- [ ] Language persists in localStorage

### Future UI Updates (Optional)
To fully implement Hindi UI, update components to use:
```tsx
const t = getTranslation(settings.language);
<h2>{t.home}</h2> // Instead of hardcoded "Home"
```

---

## 4. 🤖 Random Forest Assessment Scoring

### Assessment Flow
- [ ] Go to **Assessment Screen** (from Home or bottom nav)
- [ ] Complete all 12 questions
- [ ] Click "View Results"

### Random Forest Algorithm
- [ ] Results screen displays risk score
- [ ] Check that scoring uses Random Forest algorithm (not simple addition)
- [ ] Verify file `/utils/randomForest.ts` contains:
  - [ ] 6 decision trees (trees array)
  - [ ] `evaluateTree()` function
  - [ ] `predictPCOSRisk()` function
- [ ] Results include:
  - [ ] Risk Score (0-100%)
  - [ ] Risk Level (Low/Moderate/High)
  - [ ] Confidence score
  - [ ] Category breakdown (Menstrual, Physical, Metabolic, Lifestyle)

### Score Accuracy
Test with different answer combinations:

**Test 1: All Low Risk Answers**
- [ ] Select all lowest risk options
- [ ] Should show "Low Risk" (0-40%)
- [ ] Category scores should be low across board

**Test 2: All High Risk Answers**
- [ ] Select all highest risk options
- [ ] Should show "High Risk" (60-100%)
- [ ] Category scores should be high

**Test 3: Mixed Answers**
- [ ] Mix of low, medium, high risk answers
- [ ] Should show "Moderate Risk" (40-60%)
- [ ] Category scores should reflect answer distribution

### Algorithm Comparison
- [ ] Compare with previous simple scoring (if available)
- [ ] Random Forest should provide more nuanced risk assessment
- [ ] Ensemble method should average predictions from 6 trees

---

## 5. 🔄 Regenerate Diet Plan Feature

### Initial Diet Plan
- [ ] Go to **Plans Screen**
- [ ] Click on "Diet Plan" tab
- [ ] Verify 7-day diet plan is displayed (Monday-Sunday)
- [ ] Each day shows:
  - [ ] Day name
  - [ ] "3 meals planned" subtitle
  - [ ] Collapsible card
- [ ] Click on a day - should expand to show:
  - [ ] 🌅 Breakfast section with items
  - [ ] ☀️ Lunch section with items
  - [ ] 🌙 Dinner section with items

### Regenerate Functionality
- [ ] Scroll to bottom of Diet Plan tab
- [ ] Find "Regenerate Diet Plan" button with refresh icon
- [ ] Note current meal items for Monday
- [ ] Click "Regenerate Diet Plan" button

### Expected Behavior
- [ ] Button shows loading state:
  - [ ] Text changes to "Generating..."
  - [ ] RefreshCw icon spins (`animate-spin`)
  - [ ] Button is disabled during generation
- [ ] After ~1 second delay:
  - [ ] Toast notification appears: "New diet plan generated! 🥗 Fresh PCOS-friendly meals await you!"
  - [ ] Button returns to normal state
  - [ ] Diet plan updates with NEW meals

### Verify New Plan
- [ ] Check Monday's meals - should be different from before
- [ ] All 7 days should have new meal combinations
- [ ] Meals remain PCOS-friendly (low GI, balanced macros)
- [ ] Check `/utils/dietPlanGenerator.ts`:
  - [ ] Multiple meal variations exist
  - [ ] Random selection logic works
  - [ ] Date seed ensures different plans

### Multiple Regenerations
- [ ] Click "Regenerate Diet Plan" again
- [ ] Should generate another new plan
- [ ] Plans should vary each time (randomness works)
- [ ] Can regenerate unlimited times
- [ ] Each regeneration triggers success toast

---

## Integration Tests

### Cross-Feature Testing

#### Language + Motivational Nudges
- [ ] Change language to Hindi
- [ ] Wait for motivational nudge
- [ ] Messages should be in selected language (if Hindi translations implemented)

#### Wellness Reminders + Notifications
- [ ] Turn OFF main Notifications toggle
- [ ] Wellness reminders should not appear
- [ ] Turn ON main Notifications toggle
- [ ] Wellness reminders should work again

#### Assessment + Diet Plan
- [ ] Complete assessment with high metabolic scores
- [ ] Go to Plans screen
- [ ] Diet plan should be PCOS-appropriate (already is)
- [ ] Regenerate to get new plan

#### All Settings Persistence
- [ ] Set language to Hindi
- [ ] Enable motivational nudges
- [ ] Enable all wellness reminders
- [ ] Refresh the page
- [ ] All settings should persist from localStorage

---

## Data Persistence Tests

### LocalStorage Keys to Verify
Check browser DevTools > Application > Local Storage:

- [ ] `sakhi_settings` - contains all settings including:
  - [ ] `language: "en" | "hi"`
  - [ ] `motivationalNudges: boolean`
  - [ ] `wellnessReminders: { morning, afternoon, evening }`
- [ ] `sakhi_last_nudge` - stores last nudge show date
- [ ] `sakhi_morning_reminder` - timestamp of last morning reminder
- [ ] `sakhi_afternoon_reminder` - timestamp of last afternoon reminder
- [ ] `sakhi_evening_reminder` - timestamp of last evening reminder

### Export Data Test
- [ ] Go to Profile > Data & Privacy
- [ ] Click "Export Data"
- [ ] Download JSON file
- [ ] Verify it contains:
  - [ ] User data
  - [ ] Settings (including new language, nudges, reminders)
  - [ ] All assessments with Random Forest scores
  - [ ] Cycle entries
  - [ ] Weight entries
  - [ ] Chat messages

---

## UI/UX Tests

### Mobile Responsiveness (390px width)
- [ ] All new features work in mobile frame
- [ ] Language dialog fits screen
- [ ] Wellness reminder dialog fits screen
- [ ] Motivational nudge card fits properly
- [ ] Regenerate button accessible

### Animations
Check `/styles/globals.css` animations work:
- [ ] Motivational nudge has `animate-fade-in`
- [ ] Regenerate button icon spins on click
- [ ] Toast notifications slide in
- [ ] All animations smooth on mobile

### Color Scheme Consistency
- [ ] Motivational nudge uses dusty rose (#D96D77) and lavender mist (#C7B8EA)
- [ ] All buttons use brand colors
- [ ] Dark mode support (if enabled) looks good

---

## Error Handling Tests

### Edge Cases

#### Motivational Nudges
- [ ] Disable nudges mid-session - should stop showing
- [ ] Clear localStorage during session - handles gracefully

#### Wellness Reminders
- [ ] Test outside of time windows - should not show
- [ ] Test with all reminders disabled - should not show
- [ ] Test rapid time changes - handles correctly

#### Language Settings
- [ ] Switch language multiple times rapidly - no errors
- [ ] Invalid language in localStorage - falls back to English

#### Random Forest
- [ ] Incomplete assessment answers - handles missing data
- [ ] Invalid answer values - defaults to 0 score
- [ ] All same answers - algorithm doesn't break

#### Diet Plan Regenerate
- [ ] Click regenerate multiple times rapidly - handles gracefully
- [ ] Regenerate while collapsibles are open - maintains state
- [ ] Network issues (N/A - client-side only)

---

## Performance Tests

- [ ] Motivational nudge appears within 3 seconds (not before)
- [ ] Language change is instant (no lag)
- [ ] Diet plan regeneration completes in ~1 second
- [ ] Random Forest calculation is fast (< 100ms)
- [ ] No memory leaks from reminder intervals
- [ ] LocalStorage reads/writes are efficient

---

## Accessibility Tests

- [ ] All buttons have proper aria-labels
- [ ] Motivational nudge close button accessible via keyboard
- [ ] Language dialog keyboard navigable
- [ ] Wellness reminder toggles keyboard accessible
- [ ] Toast notifications don't block content
- [ ] Screen reader friendly

---

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Desktop & Mobile)
- [ ] Firefox
- [ ] Safari (Desktop & iOS)
- [ ] Opera

---

## Final Checks

- [ ] No console errors
- [ ] No console warnings
- [ ] All TypeScript types correct
- [ ] All imports resolve correctly
- [ ] App builds successfully
- [ ] No broken links or images
- [ ] All features documented in `/FUNCTIONALITY.md`
- [ ] Code follows existing patterns and style

---

## Sign-off

**Tester Name**: ________________  
**Date**: ________________  
**App Version**: 1.0.0  
**All Tests Passed**: ☐ Yes  ☐ No (See notes below)  

**Notes/Issues Found**:
_______________________________________________
_______________________________________________
_______________________________________________

---

## Quick Test Commands

### Clear All LocalStorage (Fresh Start)
```javascript
// Run in browser console
localStorage.clear();
location.reload();
```

### Force Show Motivational Nudge
```javascript
localStorage.removeItem('sakhi_last_nudge');
location.reload();
```

### Force Show Wellness Reminder
```javascript
localStorage.removeItem('sakhi_morning_reminder');
localStorage.removeItem('sakhi_afternoon_reminder');
localStorage.removeItem('sakhi_evening_reminder');
location.reload();
```

### Check Current Settings
```javascript
console.log(JSON.parse(localStorage.getItem('sakhi_settings')));
```

### Simulate Different Times (in `/utils/wellnessReminders.ts`)
Change time checks temporarily for testing:
```typescript
// Morning: 7-12 → change to current hour
case 'morning':
  return currentHour >= 10 && currentHour < 11; // Test between 10-11
```

---

**End of Testing Checklist** ✅
