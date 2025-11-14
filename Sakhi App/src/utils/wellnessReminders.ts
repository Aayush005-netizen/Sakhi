// Wellness reminder system for PCOS management
// Provides time-based reminders throughout the day

export interface WellnessReminder {
  id: string;
  time: 'morning' | 'afternoon' | 'evening';
  message: string;
  icon: string;
}

const morningReminders = [
  { message: "Good morning! Don't forget to take your supplements 💊", icon: "☀️" },
  { message: "Start your day with a glass of water and some stretching 💧", icon: "🌅" },
  { message: "Have you logged your morning weight? Track your progress! ⚖️", icon: "📊" },
  { message: "Remember to have a protein-rich breakfast for stable blood sugar 🥚", icon: "🍳" },
  { message: "Time for your morning walk! Even 10 minutes helps 🚶‍♀️", icon: "👟" },
];

const afternoonReminders = [
  { message: "Afternoon reminder: Stay hydrated! Drink some water 💧", icon: "💦" },
  { message: "Time for a healthy snack! Try nuts or fruits 🥜", icon: "🍎" },
  { message: "Take a short break and do some deep breathing exercises 🧘‍♀️", icon: "😮‍💨" },
  { message: "How's your stress level? Try a 5-minute meditation break 🧘", icon: "🕉️" },
  { message: "Don't skip lunch! Your body needs balanced nutrition 🍱", icon: "🥗" },
];

const eveningReminders = [
  { message: "Evening wind-down: Have you logged today's cycle data? 📅", icon: "🌙" },
  { message: "Prepare for tomorrow: Plan your breakfast and workout 📝", icon: "✅" },
  { message: "Wind down with some herbal tea before bed 🍵", icon: "☕" },
  { message: "Remember to take your evening supplements if prescribed 💊", icon: "🌃" },
  { message: "Log your mood and symptoms for today. Track your patterns! 😊", icon: "📔" },
];

export function getWellnessReminder(time: 'morning' | 'afternoon' | 'evening'): WellnessReminder {
  let reminders: typeof morningReminders;
  
  switch (time) {
    case 'morning':
      reminders = morningReminders;
      break;
    case 'afternoon':
      reminders = afternoonReminders;
      break;
    case 'evening':
      reminders = eveningReminders;
      break;
  }
  
  const selected = reminders[Math.floor(Math.random() * reminders.length)];
  
  return {
    id: `${time}-${Date.now()}`,
    time,
    message: selected.message,
    icon: selected.icon,
  };
}

export function shouldShowReminder(
  time: 'morning' | 'afternoon' | 'evening',
  lastShown: string | null
): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Check if already shown today for this time period
  if (lastShown) {
    const lastShownDate = new Date(lastShown);
    const isSameDay = lastShownDate.toDateString() === now.toDateString();
    const lastShownHour = lastShownDate.getHours();
    
    // Don't show if already shown in the same time period today
    if (isSameDay) {
      if (time === 'morning' && lastShownHour >= 6 && lastShownHour < 12) return false;
      if (time === 'afternoon' && lastShownHour >= 12 && lastShownHour < 18) return false;
      if (time === 'evening' && lastShownHour >= 18) return false;
    }
  }
  
  // Show reminders based on time of day
  switch (time) {
    case 'morning':
      return currentHour >= 7 && currentHour < 12;
    case 'afternoon':
      return currentHour >= 13 && currentHour < 18;
    case 'evening':
      return currentHour >= 19 && currentHour < 22;
    default:
      return false;
  }
}

export function initializeWellnessReminders(
  settings: { morning: boolean; afternoon: boolean; evening: boolean },
  onReminder: (reminder: WellnessReminder) => void
) {
  const checkReminders = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Morning reminders (7 AM - 12 PM)
    if (settings.morning && currentHour >= 7 && currentHour < 12) {
      const lastShown = localStorage.getItem('sakhi_morning_reminder');
      if (shouldShowReminder('morning', lastShown)) {
        const reminder = getWellnessReminder('morning');
        onReminder(reminder);
        localStorage.setItem('sakhi_morning_reminder', new Date().toISOString());
      }
    }
    
    // Afternoon reminders (1 PM - 6 PM)
    if (settings.afternoon && currentHour >= 13 && currentHour < 18) {
      const lastShown = localStorage.getItem('sakhi_afternoon_reminder');
      if (shouldShowReminder('afternoon', lastShown)) {
        const reminder = getWellnessReminder('afternoon');
        onReminder(reminder);
        localStorage.setItem('sakhi_afternoon_reminder', new Date().toISOString());
      }
    }
    
    // Evening reminders (7 PM - 10 PM)
    if (settings.evening && currentHour >= 19 && currentHour < 22) {
      const lastShown = localStorage.getItem('sakhi_evening_reminder');
      if (shouldShowReminder('evening', lastShown)) {
        const reminder = getWellnessReminder('evening');
        onReminder(reminder);
        localStorage.setItem('sakhi_evening_reminder', new Date().toISOString());
      }
    }
  };
  
  // Check immediately
  checkReminders();
  
  // Check every 30 minutes
  const interval = setInterval(checkReminders, 30 * 60 * 1000);
  
  return () => clearInterval(interval);
}
