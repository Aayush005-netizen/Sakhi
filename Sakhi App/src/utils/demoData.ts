import { CycleEntry, WeightEntry } from '../contexts/AppContext';

export function generateDemoData() {
  const today = new Date();
  const cycleEntries: CycleEntry[] = [];
  const weightEntries: WeightEntry[] = [];

  // Generate cycle data for last 3 months
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Add period days (simulate 28-day cycle with 5-day periods)
    const dayInCycle = i % 28;
    if (dayInCycle < 5) {
      cycleEntries.push({
        date: dateStr,
        isPeriod: true,
        mood: ['Happy', 'Tired', 'Calm', 'Anxious'][Math.floor(Math.random() * 4)],
      });
    } else if (Math.random() > 0.7) {
      // Random mood entries on non-period days
      cycleEntries.push({
        date: dateStr,
        isPeriod: false,
        mood: ['Happy', 'Sad', 'Anxious', 'Tired', 'Angry', 'Calm'][Math.floor(Math.random() * 6)],
      });
    }
  }

  // Generate weight data (weekly weigh-ins showing gradual decrease)
  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));
    const dateStr = date.toISOString().split('T')[0];

    // Start at 64.5kg and gradually decrease to 62kg
    const weight = 64.5 - (i * 0.2) + (Math.random() * 0.3 - 0.15);
    
    weightEntries.push({
      date: dateStr,
      weight: parseFloat(weight.toFixed(1)),
      time: 'morning'
    });
  }

  return { cycleEntries, weightEntries };
}
