// PCOS-friendly Indian diet plan generator
// Focuses on low-GI foods, whole grains, lean proteins, and anti-inflammatory ingredients

interface Meal {
  items: string[];
}

interface DayMeal {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

interface DietPlan {
  day: string;
  meals: DayMeal;
}

// PCOS-friendly food database organized by meal type
const breakfastOptions = [
  ['Oats with berries and almonds', 'Green tea', 'Flaxseeds (1 tbsp)'],
  ['Moong dal chilla', 'Mint chutney', 'Orange juice'],
  ['Idli with sambar', 'Coconut chutney', 'Apple'],
  ['Vegetable poha', 'Curd', 'Pomegranate seeds'],
  ['Besan cheela', 'Green chutney', 'Herbal tea'],
  ['Ragi dosa', 'Sambar', 'Banana'],
  ['Quinoa upma', 'Coconut chutney', 'Mixed nuts'],
  ['Multigrain paratha', 'Curd', 'Seasonal fruit'],
  ['Sprouts salad', 'Whole wheat toast', 'Green tea'],
  ['Vermicelli upma', 'Mint chutney', 'Papaya'],
  ['Daliya (broken wheat)', 'Mixed vegetables', 'Buttermilk'],
  ['Egg white omelette', 'Brown bread', 'Green smoothie'],
];

const lunchOptions = [
  ['Brown rice with dal', 'Mixed vegetable curry', 'Cucumber raita'],
  ['Roti with palak paneer', 'Brown rice', 'Salad'],
  ['Vegetable khichdi', 'Curd', 'Cucumber salad'],
  ['Quinoa pulao', 'Rajma curry', 'Onion raita'],
  ['Jowar roti', 'Bhindi masala', 'Dal tadka'],
  ['Bajra roti', 'Methi sabzi', 'Sprouts salad'],
  ['Brown rice', 'Chana masala', 'Cucumber-tomato salad'],
  ['Ragi roti', 'Paneer bhurji', 'Green salad'],
  ['Multigrain roti', 'Mix dal', 'Steamed vegetables'],
  ['Barnyard millet', 'Lauki curry', 'Moong dal'],
  ['Whole wheat chapati', 'Soya chunks curry', 'Beetroot raita'],
  ['Brown rice', 'Tofu curry', 'Cabbage salad'],
];

const dinnerOptions = [
  ['Grilled chicken/paneer', 'Quinoa', 'Steamed broccoli'],
  ['Fish curry', 'Cauliflower rice', 'Sautéed spinach'],
  ['Grilled tofu', 'Millet roti', 'Mixed vegetables'],
  ['Chicken soup', 'Vegetable salad', 'Roasted nuts'],
  ['Palak paneer', 'Jowar roti', 'Cucumber raita'],
  ['Egg curry', 'Cauliflower rice', 'Green beans'],
  ['Grilled fish', 'Quinoa', 'Zucchini stir-fry'],
  ['Moong dal khichdi', 'Grilled vegetables', 'Curd'],
  ['Chicken tikka', 'Salad', 'Mushroom soup'],
  ['Paneer tikka', 'Millet roti', 'Mixed vegetable soup'],
  ['Baked fish', 'Vegetable soup', 'Side salad'],
  ['Vegetable soup', 'Grilled chicken', 'Steamed vegetables'],
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Fisher-Yates shuffle algorithm for randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get a random item from array without replacement
function getRandomItems<T>(array: T[], count: number, usedIndices: Set<number> = new Set()): T[] {
  const available = array.filter((_, index) => !usedIndices.has(index));
  const shuffled = shuffleArray(available);
  return shuffled.slice(0, Math.min(count, available.length));
}

export function generateDietPlan(seedDate: Date = new Date()): DietPlan[] {
  // Use date as seed for consistent but varying plans
  const seed = seedDate.getDate() + seedDate.getMonth() * 31 + seedDate.getHours();
  
  // Shuffle options based on seed
  const shuffledBreakfast = shuffleArray([...breakfastOptions]);
  const shuffledLunch = shuffleArray([...lunchOptions]);
  const shuffledDinner = shuffleArray([...dinnerOptions]);
  
  const plan: DietPlan[] = [];
  
  for (let i = 0; i < days.length; i++) {
    plan.push({
      day: days[i],
      meals: {
        breakfast: shuffledBreakfast[i % shuffledBreakfast.length],
        lunch: shuffledLunch[i % shuffledLunch.length],
        dinner: shuffledDinner[i % shuffledDinner.length],
      },
    });
  }
  
  return plan;
}

export function getDietPlanVariant(variant: 'balanced' | 'vegetarian' | 'high-protein' = 'balanced'): DietPlan[] {
  const plan = generateDietPlan(new Date());
  
  // You can add variant-specific modifications here
  // For now, returning the base plan with a fresh shuffle
  return plan;
}

// Get nutritional tips based on PCOS management
export function getNutritionalTips(): string[] {
  return [
    'Focus on low-GI foods like whole grains, legumes, and non-starchy vegetables',
    'Include anti-inflammatory foods like turmeric, ginger, and green leafy vegetables',
    'Add healthy fats from nuts, seeds, and fatty fish',
    'Limit processed foods and refined sugars',
    'Stay hydrated - aim for 8-10 glasses of water daily',
    'Include protein in every meal to help stabilize blood sugar',
    'Choose complex carbohydrates over simple carbs',
    'Add spearmint tea - studies show it may help with PCOS symptoms',
  ];
}

// Calculate estimated calories for a meal plan (rough estimation)
export function estimateCalories(plan: DietPlan[]): number {
  // Rough estimation: breakfast ~400, lunch ~500, dinner ~450
  return (400 + 500 + 450) * 7; // Weekly total
}
