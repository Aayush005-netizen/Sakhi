# Sakhi 🌸 - Quick Reference Card

## New Features Quick Access

### 1. Motivational Nudges ✨

**File**: `/components/MotivationalNudge.tsx`

**Usage**:
```tsx
import { MotivationalNudge } from './components/MotivationalNudge';

// In HomeScreen
{settings.motivationalNudges && <MotivationalNudge />}
```

**Settings**:
- Profile → "Motivational Nudges" toggle
- `settings.motivationalNudges: boolean`

**LocalStorage Keys**:
- `sakhi_last_nudge` - Date string of last shown nudge

**How It Works**:
- Shows 3 seconds after HomeScreen mounts
- Only once per day (checked via localStorage)
- Random message from `t.motivationalMessages`
- Dismissible with X button

---

### 2. Wellness Reminders ⏰

**File**: `/utils/wellnessReminders.ts`

**Functions**:
```typescript
// Get a random reminder for time period
getWellnessReminder('morning' | 'afternoon' | 'evening')

// Check if should show reminder now
shouldShowReminder(time, lastShown)

// Initialize reminder system
initializeWellnessReminders(settings, onReminder)
```

**Time Windows**:
- Morning: 7 AM - 12 PM
- Afternoon: 1 PM - 6 PM  
- Evening: 7 PM - 10 PM

**Settings**:
- Profile → "Wellness Reminders" dialog
- `settings.wellnessReminders: { morning, afternoon, evening }`

**LocalStorage Keys**:
- `sakhi_morning_reminder` - ISO timestamp
- `sakhi_afternoon_reminder` - ISO timestamp
- `sakhi_evening_reminder` - ISO timestamp

**Integration**:
```tsx
// In HomeScreen
useEffect(() => {
  if (settings.notifications && settings.wellnessReminders) {
    const cleanup = initializeWellnessReminders(
      settings.wellnessReminders,
      (reminder) => toast(reminder.message, { icon: reminder.icon })
    );
    return cleanup;
  }
}, [settings.notifications, settings.wellnessReminders]);
```

---

### 3. Language Settings 🌐

**File**: `/utils/translations.ts`

**Types**:
```typescript
type Language = 'en' | 'hi';
```

**Functions**:
```typescript
// Get translation object for language
const t = getTranslation(settings.language);

// Get display name of language
const name = getLanguageName('en'); // "English"
const name = getLanguageName('hi'); // "हिंदी"
```

**Usage in Components**:
```tsx
import { getTranslation } from '../utils/translations';
import { useApp } from '../contexts/AppContext';

function MyComponent() {
  const { settings } = useApp();
  const t = getTranslation(settings.language);
  
  return (
    <div>
      <h1>{t.home}</h1>
      <p>{t.howFeelingToday}</p>
    </div>
  );
}
```

**Settings**:
- Profile → "Language" dialog
- `settings.language: 'en' | 'hi'`

**Translation Keys Available**:
- Common: home, cycle, weight, ai, profile
- Home: hiThere, howFeelingToday, pcosRiskScore, etc.
- Profile: settings, language, darkMode, etc.
- Assessment: pcosAssessment, question, riskScore, etc.
- Plans: personalizedPlans, dietPlan, workoutPlan, etc.
- 100+ keys total

---

### 4. Random Forest Assessment 🤖

**File**: `/utils/randomForest.ts`

**Function**:
```typescript
predictPCOSRisk(
  answers: Record<string, string>,
  questions: Question[]
): {
  riskScore: number;      // 0-100
  riskLevel: 'low' | 'moderate' | 'high';
  confidence: number;     // 0-1
  details: {
    menstrualScore: number;
    physicalScore: number;
    metabolicScore: number;
    lifestyleScore: number;
  };
}
```

**Algorithm**:
- 6 decision trees (ensemble)
- Each tree evaluates features against thresholds
- Trees vote on risk level
- Final prediction = average of all trees

**Usage**:
```tsx
import { predictPCOSRisk } from '../utils/randomForest';

// In AssessmentScreen after completing questions
const result = predictPCOSRisk(answers, questions);
const assessment = {
  date: new Date().toISOString(),
  score: result.riskScore,
  maxScore: 100,
  percentage: result.riskScore,
  riskLevel: result.riskLevel,
  answers,
};
saveAssessment(assessment);
```

**Tree Structure**:
1. Menstrual irregularity & metabolic
2. Physical symptoms
3. Combined assessment
4. Family history & lifestyle
5. Metabolic syndrome
6. Hyperandrogenism

---

### 5. Regenerate Diet Plan 🔄

**File**: `/utils/dietPlanGenerator.ts`

**Function**:
```typescript
generateDietPlan(seed?: Date): DayPlan[]

type DayPlan = {
  day: string;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
};
```

**Meal Database**:
- 10+ breakfast options
- 10+ lunch options
- 10+ dinner options
- All PCOS-friendly (low GI, high protein)
- Indian cuisine focus

**Usage**:
```tsx
import { generateDietPlan } from '../utils/dietPlanGenerator';

const [dietPlan, setDietPlan] = useState(() => generateDietPlan());

const handleRegenerate = () => {
  setIsRegenerating(true);
  setTimeout(() => {
    const newPlan = generateDietPlan(new Date());
    setDietPlan(newPlan);
    setIsRegenerating(false);
    toast.success('New diet plan generated! 🥗');
  }, 1000);
};
```

**In PlansScreen**:
- "Regenerate Diet Plan" button at bottom of diet tab
- Loading state with spinning RefreshCw icon
- Success toast on completion
- Unlimited regenerations allowed

---

## AppContext Settings Structure

```typescript
interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  language: 'en' | 'hi';
  researchConsent: boolean;
  motivationalNudges: boolean;        // NEW
  wellnessReminders: {                // NEW
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
}
```

**Update Settings**:
```tsx
const { settings, updateSettings } = useApp();

// Update single setting
updateSettings({ motivationalNudges: true });

// Update nested setting
updateSettings({
  wellnessReminders: {
    ...settings.wellnessReminders,
    morning: true,
  },
});

// Update language
updateSettings({ language: 'hi' });
```

---

## LocalStorage Keys Reference

| Key | Type | Purpose |
|-----|------|---------|
| `sakhi_user` | User object | User profile data |
| `sakhi_cycle_entries` | CycleEntry[] | Period tracking |
| `sakhi_weight_entries` | WeightEntry[] | Weight tracking |
| `sakhi_chat_messages` | ChatMessage[] | AI chat history |
| `sakhi_reports` | HealthReport[] | Blood/ultrasound reports |
| `sakhi_assessments` | Assessment[] | PCOS assessments |
| `sakhi_settings` | AppSettings | All app settings |
| `sakhi_subscription_tier` | string | free/pro/premium |
| `sakhi_onboarding_seen` | "true" | Onboarding completion |
| `sakhi_welcome_shown` | "true" | Welcome message shown |
| `sakhi_last_nudge` | string | Last nudge date |
| `sakhi_morning_reminder` | string | Last morning reminder |
| `sakhi_afternoon_reminder` | string | Last afternoon reminder |
| `sakhi_evening_reminder` | string | Last evening reminder |

---

## CSS Animations Reference

```css
/* fadeIn - General fade in from bottom */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* slideInRight - Slide from right */
.animate-slide-in-right {
  animation: slideInRight 0.4s ease-out;
}

/* slideInLeft - Slide from left */
.animate-slide-in-left {
  animation: slideInLeft 0.4s ease-out;
}

/* pulse-soft - Gentle opacity pulse */
.animate-pulse-soft {
  animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* shimmer - Loading shimmer effect */
.animate-shimmer {
  animation: shimmer 2s infinite;
}
```

---

## Component Import Paths

```tsx
// New Components
import { MotivationalNudge } from './components/MotivationalNudge';

// New Utils
import { getTranslation, getLanguageName } from '../utils/translations';
import { generateDietPlan } from '../utils/dietPlanGenerator';
import { predictPCOSRisk } from '../utils/randomForest';
import { 
  initializeWellnessReminders,
  getWellnessReminder,
  shouldShowReminder 
} from '../utils/wellnessReminders';

// Existing
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
```

---

## Toast Notification Patterns

```tsx
import { toast } from 'sonner@2.0.3';

// Success
toast.success('Diet plan regenerated! 🥗');

// Error
toast.error('Failed to save data');

// Info with icon
toast('Reminder message', { 
  icon: '🌅',
  duration: 5000 
});

// With custom duration
toast.success('Saved!', { duration: 3000 });
```

---

## Testing Quick Commands

```javascript
// Clear all localStorage (fresh start)
localStorage.clear();
location.reload();

// Force show motivational nudge
localStorage.removeItem('sakhi_last_nudge');

// Force show wellness reminder
localStorage.removeItem('sakhi_morning_reminder');

// View current settings
console.log(JSON.parse(localStorage.getItem('sakhi_settings')));

// View all assessments
console.log(JSON.parse(localStorage.getItem('sakhi_assessments')));

// Change language manually
const settings = JSON.parse(localStorage.getItem('sakhi_settings'));
settings.language = 'hi';
localStorage.setItem('sakhi_settings', JSON.stringify(settings));
location.reload();
```

---

## Common Patterns

### Conditional Rendering Based on Settings
```tsx
{settings.motivationalNudges && <MotivationalNudge />}
{settings.notifications && <BellIcon />}
{settings.language === 'hi' && <HindiContent />}
```

### Toggle Setting with Toast
```tsx
const toggleFeature = (checked: boolean) => {
  updateSettings({ featureName: checked });
  toast.success(checked ? 'Feature enabled ✅' : 'Feature disabled');
};
```

### Loading State Pattern
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  // Do work
  setTimeout(() => {
    // Update state
    setIsLoading(false);
    toast.success('Done! ✨');
  }, 1000);
};

<Button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Action'}
</Button>
```

---

## File Structure

```
├── components/
│   ├── MotivationalNudge.tsx         ✨ NEW
│   ├── HomeScreen.tsx                📝 Modified
│   ├── ProfileScreen.tsx             📝 Modified
│   ├── PlansScreen.tsx               📝 Modified
│   ├── AssessmentScreen.tsx          📝 Modified
│   └── ...
├── utils/
│   ├── randomForest.ts               ✨ NEW
│   ├── translations.ts               ✨ NEW
│   ├── dietPlanGenerator.ts          ✨ NEW
│   ├── wellnessReminders.ts          ✨ NEW
│   └── ...
├── contexts/
│   └── AppContext.tsx                📝 Modified
├── styles/
│   └── globals.css                   📝 Modified
├── FUNCTIONALITY.md                  📝 Updated
├── NEW_FEATURES_SUMMARY.md           ✨ NEW
├── TESTING_CHECKLIST.md              ✨ NEW
└── QUICK_REFERENCE.md                ✨ NEW (this file)
```

---

## Color Palette Quick Reference

```css
/* Design System Colors */
--dusty-rose: #D96D77;      /* Primary */
--soft-blush: #FDECEF;      /* Background */
--lavender-mist: #C7B8EA;   /* Secondary */
--warm-beige: #FFF7F2;      /* Cards */
--slate: #3D405B;           /* Text */
```

**Usage in Components**:
- Primary actions: `bg-primary text-primary-foreground`
- Secondary: `bg-secondary text-secondary-foreground`
- Cards: `bg-card text-card-foreground`
- Muted: `bg-muted text-muted-foreground`

---

## Debugging Tips

### Check if feature is enabled
```javascript
const settings = JSON.parse(localStorage.getItem('sakhi_settings'));
console.log('Motivational Nudges:', settings.motivationalNudges);
console.log('Wellness Reminders:', settings.wellnessReminders);
console.log('Language:', settings.language);
```

### Check reminder timings
```javascript
// Current hour
console.log('Current hour:', new Date().getHours());

// Last reminders shown
console.log('Morning:', localStorage.getItem('sakhi_morning_reminder'));
console.log('Afternoon:', localStorage.getItem('sakhi_afternoon_reminder'));
console.log('Evening:', localStorage.getItem('sakhi_evening_reminder'));
```

### Verify Random Forest
```javascript
import { predictPCOSRisk } from './utils/randomForest';

const testAnswers = { q1: 'regular', q2: 'no', /* ... */ };
const result = predictPCOSRisk(testAnswers, questions);
console.log('Risk Score:', result.riskScore);
console.log('Risk Level:', result.riskLevel);
console.log('Confidence:', result.confidence);
console.log('Details:', result.details);
```

### Test Diet Plan Generator
```javascript
import { generateDietPlan } from './utils/dietPlanGenerator';

const plan1 = generateDietPlan();
const plan2 = generateDietPlan(new Date('2025-01-15'));
console.log('Plan 1 Monday:', plan1[0]);
console.log('Plan 2 Monday:', plan2[0]);
// Should be different
```

---

## Performance Considerations

- **Motivational Nudge**: Appears after 3-second delay (not instant)
- **Wellness Reminders**: Check every 30 minutes (not every minute)
- **Random Forest**: < 100ms calculation time
- **Diet Plan Generator**: Instant (client-side only)
- **Language Switch**: Instant (no API calls)
- **LocalStorage**: All operations are synchronous and fast

---

## Accessibility

- All buttons have proper `aria-label`
- Dialogs are keyboard navigable
- Toast notifications don't block interaction
- Color contrast meets WCAG AA standards
- Touch targets are 44x44px minimum
- Focus states visible on all interactive elements

---

## Browser Support

✅ Chrome/Edge (Desktop & Mobile)  
✅ Firefox  
✅ Safari (Desktop & iOS)  
✅ Opera  

---

**Need more details?**
- Full documentation: `/FUNCTIONALITY.md`
- Testing guide: `/TESTING_CHECKLIST.md`
- Feature summary: `/NEW_FEATURES_SUMMARY.md`
- Design guidelines: `/guidelines/Guidelines.md`

---

**Version**: 1.0.0  
**Last Updated**: November 13, 2025  
🌸 **Sakhi - Your PCOS Companion** 🌸
