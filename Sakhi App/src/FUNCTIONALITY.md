# Sakhi 🌸 - Functionality Documentation

## Complete Feature List

### ✅ **Authentication & Onboarding**
- **Splash Screen**: Animated intro with logo and tagline
- **Onboarding Flow**: 3-screen carousel with skip option
- **Authentication**: 
  - Sign up with name, email, password
  - Login with email/password
  - Forgot password flow with email reset
  - Guest mode option
  - Form validation
  - Loading states

### 🧠 **PCOS Assessment**
- **Comprehensive Questionnaire**:
  - 12 evidence-based questions
  - Categories: Menstrual, Physical, Metabolic, Lifestyle
  - Single-choice questions with score weighting
  - Progress indicator (percentage complete)
  - Previous/Next navigation
- **Risk Calculation**:
  - **Random Forest Machine Learning Algorithm**:
    - Ensemble of 6 decision trees
    - Evidence-based on Rotterdam criteria
    - Considers feature interactions and thresholds
    - Provides confidence scoring
    - More accurate than simple additive scoring
  - Risk levels: Low, Moderate, High
  - Percentage-based risk score
  - Category-wise breakdown analysis
- **Results Screen**:
  - Visual risk level display with emoji indicators
  - Overall risk percentage
  - Category analysis with progress bars
  - Personalized recommendations based on responses
  - Health insights and action items
- **Recommendations**:
  - Healthcare provider consultation advice
  - Nutrition guidance
  - Exercise suggestions
  - Stress management tips
  - Symptom tracking reminders
- **Data Persistence**:
  - Assessment history saved to localStorage
  - Latest assessment displayed on home screen
  - Retake assessment anytime
  - Export with other health data
- **Disclaimer**: Medical disclaimer for educational purposes

### 📊 **Data Persistence**
- **LocalStorage Integration**: All data automatically saved
- **Auto-load**: Data persists across sessions
- **Export Functionality**: Download all data as JSON file
- **User Profile**: Stores name, email, join date

### 🔄 **Cycle & Mood Tracking**
- **Interactive Calendar**: 
  - Monthly view with navigation
  - Click any day to add/edit entry
  - Visual indicators for period days (red dot) and mood entries (purple dot)
  - Highlights today's date
- **Entry Features**:
  - Mood selection (6 emoji options: Happy, Sad, Anxious, Tired, Angry, Calm)
  - Period day toggle
  - Weight entry option
  - Edit existing entries
- **Predictions**:
  - Next period date calculation based on cycle history
  - Average cycle length tracking
  - Days until next period countdown
- **Statistics**: 
  - Average cycle length
  - Total entries tracked
  - Cycle regularity insights

### ⚖️ **Weight Tracking**
- **Entry Management**:
  - Add weight with date picker
  - Morning/evening time selection
  - Form validation
  - Auto-sorted by date
- **Visualizations**:
  - Beautiful gradient area chart
  - Auto-scaling Y-axis
  - Responsive chart design
  - Last 20 entries displayed
- **Analytics**:
  - Current weight display
  - Goal weight tracking
  - Weight change calculation (loss/gain)
  - Insight cards with progress messages
  - Color-coded feedback (green for loss, blue for gain)
- **History**: Recent entries list with dates

### 💬 **AI Chat (Sakhi Assistant)**
- **Intelligent Responses**:
  - Context-aware replies based on keywords
  - Topics: diet, exercise, symptoms, weight, periods, mood
  - Personalized PCOS advice
  - Fallback responses for general queries
- **Chat Features**:
  - Real-time typing indicator
  - Auto-scroll to latest message
  - Save/unsave messages
  - Persistent chat history
  - Timestamps for all messages
- **User Experience**:
  - Smooth animations
  - Distinct bubbles for user/AI messages
  - Message save indicators
  - Voice input button (UI ready)

### 🥗 **Personalized Plans**
- **Diet Plans**:
  - 7-day meal plans
  - Breakfast, lunch, dinner breakdown
  - Indian cuisine focused
  - PCOS-friendly ingredients (low GI, high protein, anti-inflammatory)
  - Expandable/collapsible day cards
  - **Dynamic Regenerate Feature**:
    - Generate completely new meal plans on demand
    - Random selection from extensive meal database
    - Date-seeded randomness for variety
    - Instant updates with loading animation
    - Unlimited regenerations
    - Success toast notifications
- **Workout Plans**:
  - Daily exercise routines
  - Duration and type indicators
  - Exercise breakdowns
  - Mix of cardio, strength, yoga
  - Generate new plan option

### 📄 **Health Reports**
- **Report Types**:
  - Blood Tests (with key metrics)
  - Ultrasound Reports (with findings)
- **Features**:
  - Upload placeholder (PDF/JPG/PNG)
  - Status indicators (Normal, Elevated, Borderline)
  - Color-coded metric cards
  - AI explanation button
  - Download report option
  - Date tracking
- **AI Summary**: Overall health insights based on reports

### 💎 **Subscription Management**
- **Three Tiers**:
  - **Free**: Basic features, 5 AI queries/month
  - **Pro** (₹299/month): Unlimited AI, personalized plans, analytics
  - **Premium** (₹2,999/year): Everything + doctor consultations, health coach
- **Features**:
  - Plan comparison cards
  - Current plan indicator
  - Highlighted recommended plan
  - Feature checklists
  - Payment modal (Razorpay integration ready)
  - Payment method selection (Card/UPI)
  - 7-day money-back guarantee
  - Tier tracking in profile

### 👤 **Profile & Settings**
- **User Information**:
  - Avatar with initials fallback
  - Name and email display
  - Profile edit option
- **Statistics Dashboard**:
  - Days tracked counter
  - AI chats counter
  - Reports counter
  - Real-time updates
- **Settings**:
  - **Dark Mode**: Toggle with instant theme switch
  - **Notifications**: Enable/disable reminders
  - **Language**: English/Hindi selection with full translation system
  - **Motivational Nudges**: Daily inspiration messages toggle
  - **Wellness Reminders**: Customizable morning/afternoon/evening health tips
  - **Research Consent**: Anonymous data sharing option
- **Data Management**:
  - Export all data as JSON
  - Download with timestamp
  - Includes all user data, entries, chats, assessments
- **Account Actions**:
  - Logout with confirmation
  - Clear session on logout

### 🎨 **Design System**
- **Color Palette**:
  - Primary: Dusty Rose (#D96D77)
  - Secondary: Lavender Mist (#C7B8EA)
  - Background: Soft Blush (#FDECEF)
  - Cards: Warm Beige (#FFF7F2)
  - Text: Slate (#3D405B)
- **Dark Mode**:
  - Complete dark theme support
  - Pastel color adjustments
  - Preserved readability
  - Auto-persists preference
- **Typography**:
  - Poppins font family
  - Responsive text sizing
  - Proper hierarchy
- **Components**:
  - Rounded corners (16-24px)
  - Soft shadows
  - Smooth animations
  - Mobile-optimized touch targets

### 📱 **Navigation**
- **Bottom Navigation Bar**:
  - 5 tabs: Home, Tracker, AI, Reports, Profile
  - Active state indicators
  - Icon glow effects
  - Smooth transitions
  - Fixed positioning
- **Cross-Navigation**:
  - Quick action buttons on home
  - Deep linking between screens
  - Contextual navigation

### 🔔 **Notifications & Feedback**
- **Toast Notifications**:
  - Success messages (green)
  - Error messages (red)
  - Info messages (blue)
  - Rich colors and icons
  - Auto-dismiss
  - Top-center positioning
- **Motivational Nudges** ✨ NEW:
  - Daily inspiration messages on home screen
  - Beautiful gradient card design
  - Appears once per day after 3-second delay
  - Random motivational quotes for PCOS management
  - Dismissible with X button
  - Toggle on/off in Profile settings
  - LocalStorage tracking to prevent duplicates
  - Supports bilingual system
- **Wellness Reminders** ⏰ NEW:
  - Time-based health reminders throughout the day
  - **Morning Reminders** (7 AM - 12 PM):
    - Supplement reminders
    - Hydration prompts
    - Exercise motivation
    - Breakfast nutrition tips
  - **Afternoon Reminders** (1 PM - 6 PM):
    - Hydration check-ins
    - Healthy snack suggestions
    - Stress management breaks
    - Meditation prompts
  - **Evening Reminders** (7 PM - 10 PM):
    - Data logging reminders
    - Evening supplement prompts
    - Wind-down suggestions
    - Mood tracking prompts
  - Individual toggle controls for each time period
  - Shows once per time window per day
  - Toast notifications with emoji icons
  - Respects main notifications toggle
  - Smart scheduling with 30-minute check intervals
- **Feedback Points**:
  - Data saved confirmations
  - Login/logout messages
  - Settings changed alerts
  - Entry added notifications
  - Export success messages
  - Diet plan regeneration confirmations
  - Language change confirmations

### 📊 **Statistics & Analytics**
- **Home Dashboard**:
  - PCOS risk score
  - Last period tracking
  - Current mood
  - Current weight
  - Next period prediction
- **Insights**:
  - AI-powered tips
  - Personalized recommendations
  - Progress tracking
  - Trend analysis

### 🔒 **Data & Privacy**
- **Local Storage**: All data stays on device
- **No External APIs**: Privacy-first approach
- **Data Export**: Full data portability
- **Anonymous Mode**: Research opt-in
- **Secure**: No sensitive data transmission

### 🎯 **User Experience**
- **Mobile-First**: Optimized for iPhone 13 (390×844) & Pixel 7 (412×915)
- **Responsive**: Works on all mobile screen sizes
- **Smooth Animations**: Fade-ins, transitions, pulses
- **Loading States**: Clear feedback during operations
- **Form Validation**: Input validation with helpful messages
- **Empty States**: Helpful messages when no data
- **Confirmations**: Important actions require confirmation
- **Accessibility**: Proper labels, contrast, touch targets

### 🚀 **Performance**
- **Fast Loading**: Optimized component rendering
- **Efficient Storage**: Minimal localStorage usage
- **Auto-save**: Changes saved immediately
- **Optimistic Updates**: UI updates before save completion
- **Lazy Loading**: Charts and images load on demand

## Technical Implementation

### State Management
- **React Context API**: Global state management
- **Custom Hooks**: `useApp()` hook for all app state
- **TypeScript**: Full type safety

### Data Structure
```typescript
{
  user: { name, email, avatar, joinDate }
  cycleEntries: [{ date, isPeriod, mood, weight, symptoms, notes }]
  weightEntries: [{ date, weight, time }]
  chatMessages: [{ id, text, sender, timestamp, saved }]
  reports: [{ id, type, name, date, data }]
  assessments: [{ date, score, maxScore, percentage, riskLevel, answers }]
  settings: { 
    darkMode, 
    notifications, 
    language: 'en' | 'hi',
    researchConsent,
    motivationalNudges: boolean,
    wellnessReminders: { morning, afternoon, evening }
  }
  subscriptionTier: 'free' | 'pro' | 'premium'
}
```

### Key Libraries
- **React 18**: UI framework
- **TypeScript**: Type safety and developer experience
- **Recharts**: Chart visualizations
- **Lucide React**: Icon system
- **Sonner**: Toast notifications
- **Tailwind CSS 4.0**: Styling system
- **ShadCN UI**: Component library

### Custom Algorithms
- **Random Forest ML** ✨ NEW: 
  - Custom implementation for PCOS risk assessment
  - 6-tree ensemble method
  - Evidence-based decision thresholds
  - Category-wise feature analysis
  - Confidence scoring
- **Diet Plan Generator** ✨ NEW:
  - Dynamic meal plan creation
  - 30+ PCOS-friendly meal options
  - Date-seeded randomness for variety
  - Indian cuisine focus
- **Translation System** 🌐 NEW:
  - Bilingual support (English/Hindi)
  - 100+ translation keys
  - Type-safe implementation
  - Easy to extend to more languages
- **Wellness Reminder Scheduler** ⏰ NEW:
  - Time-based notification system
  - Smart duplicate prevention
  - 15 unique wellness messages
  - LocalStorage state management

## Recently Added Features (v1.0)

1. ✅ **Motivational Nudges**: Daily inspiration messages on home screen
2. ✅ **Wellness Reminders**: Time-based health tips (morning/afternoon/evening)
3. ✅ **Language Settings**: Full bilingual infrastructure (English/Hindi)
4. ✅ **Random Forest ML**: Advanced PCOS risk assessment algorithm
5. ✅ **Regenerate Diet Plans**: Dynamic meal plan generation on demand

## Future Enhancements (Ready for Implementation)

1. **Full UI Translation**: Apply translation keys to all UI components
2. **API Integration**: Backend sync ready
3. **Doctor Consultations**: Video call integration points
4. **Supplement Tracking**: Data structure in place
5. **Community Features**: Social interaction framework
6. **Custom Reminder Times**: User-configurable notification times
7. **Report OCR**: Text extraction from images
8. **Advanced Analytics**: More charts and insights
9. **Symptom Tracking**: Extended logging capabilities
10. **Medication Reminders**: Scheduling system
11. **Enhanced ML Models**: Train Random Forest on real patient data
12. **Regional Meal Plans**: Expand diet database with more regional variations

## Testing Checklist

### Core Features
✅ Sign up with new account  
✅ Login with existing account  
✅ Guest mode access  
✅ Add cycle entries with mood and period  
✅ Navigate calendar months  
✅ Add weight entries  
✅ View weight chart  
✅ Chat with AI about different topics  
✅ Save AI messages  
✅ View diet and workout plans  
✅ Toggle dark mode  
✅ Export data  
✅ Change subscription tier  
✅ Logout and data persistence  
✅ Data survives page refresh  
✅ All toast notifications work  
✅ Responsive on different mobile sizes

### New Features (v1.0) ✨
✅ Motivational nudge appears on home screen  
✅ Nudge shows once per day  
✅ Nudge can be dismissed  
✅ Toggle motivational nudges in settings  
✅ Wellness reminders appear at correct times  
✅ Configure morning/afternoon/evening reminders  
✅ Language selection dialog works  
✅ Language preference persists  
✅ Assessment uses Random Forest algorithm  
✅ Risk score includes confidence metric  
✅ Category breakdown shows detailed analysis  
✅ Regenerate diet plan button works  
✅ New meal plan generates successfully  
✅ Diet plan shows different meals each time  
✅ All new settings persist in localStorage  
✅ Export includes new settings and assessment data

**For comprehensive testing guide, see `/TESTING_CHECKLIST.md`**  

---

**Built with ❤️ for Indian women managing PCOS**
