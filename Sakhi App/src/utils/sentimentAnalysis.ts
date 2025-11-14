// Simple sentiment analysis for PCOS-related text
// Analyzes mood from journal entries, symptoms, and chat messages

export type SentimentScore = {
  score: number; // -1 (very negative) to 1 (very positive)
  magnitude: number; // 0 to 1 (strength of emotion)
  label: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
  emoji: string;
  color: string;
  bgColor: string;
};

const positiveWords = [
  'happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 'love',
  'joy', 'excited', 'energetic', 'motivated', 'confident', 'strong', 'healthy',
  'better', 'improved', 'progress', 'success', 'relief', 'comfortable', 'calm',
  'peaceful', 'grateful', 'blessed', 'hopeful', 'optimistic', 'positive', 'proud',
  // Hindi transliteration
  'khush', 'achha', 'behtar', 'accha', 'badhiya'
];

const negativeWords = [
  'sad', 'bad', 'terrible', 'awful', 'horrible', 'hate', 'angry', 'frustrated',
  'tired', 'exhausted', 'weak', 'pain', 'hurt', 'ache', 'sick', 'ill', 'worse',
  'difficult', 'hard', 'struggle', 'suffer', 'depressed', 'anxious', 'worried',
  'stressed', 'overwhelmed', 'hopeless', 'scared', 'afraid', 'upset', 'crying',
  'bloated', 'cramps', 'fatigue', 'nausea', 'headache', 'migraine', 'acne',
  // Hindi transliteration
  'dukhi', 'bura', 'dard', 'thaka', 'pareshan'
];

const pcosSymptomWords = [
  'irregular', 'period', 'menstrual', 'cycle', 'cramps', 'bloating', 'acne',
  'hair', 'weight', 'gain', 'loss', 'insulin', 'hormone', 'ovulation',
  'fertility', 'hirsutism', 'pcos', 'polycystic', 'cyst', 'ovary'
];

const intensifiers = [
  'very', 'extremely', 'really', 'so', 'too', 'quite', 'absolutely', 'completely',
  'totally', 'highly', 'severely', 'badly', 'seriously', 'incredibly'
];

export function analyzeSentiment(text: string): SentimentScore {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      magnitude: 0,
      label: 'neutral',
      emoji: '😐',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    };
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  let intensifierMultiplier = 1;
  let symptomCount = 0;

  // Count sentiment words
  words.forEach((word, index) => {
    // Check for intensifiers
    if (intensifiers.includes(word) && index < words.length - 1) {
      intensifierMultiplier = 1.5;
    }

    // Check positive words
    if (positiveWords.some(pw => word.includes(pw))) {
      positiveCount += intensifierMultiplier;
      intensifierMultiplier = 1; // Reset
    }

    // Check negative words
    if (negativeWords.some(nw => word.includes(nw))) {
      negativeCount += intensifierMultiplier;
      intensifierMultiplier = 1; // Reset
    }

    // Check PCOS symptom words (slightly negative context)
    if (pcosSymptomWords.some(sw => word.includes(sw))) {
      symptomCount += 0.3;
    }
  });

  // Add symptom context to negative count
  negativeCount += symptomCount;

  // Calculate raw score
  const totalCount = positiveCount + negativeCount;
  let score = 0;
  
  if (totalCount > 0) {
    score = (positiveCount - negativeCount) / totalCount;
  }

  // Calculate magnitude (strength of emotion)
  const magnitude = Math.min(totalCount / words.length, 1);

  // Determine label
  let label: SentimentScore['label'];
  let emoji: string;
  let color: string;
  let bgColor: string;

  if (score >= 0.6) {
    label = 'very_positive';
    emoji = '😊';
    color = 'text-green-600';
    bgColor = 'bg-green-50';
  } else if (score >= 0.2) {
    label = 'positive';
    emoji = '🙂';
    color = 'text-green-500';
    bgColor = 'bg-green-50';
  } else if (score >= -0.2) {
    label = 'neutral';
    emoji = '😐';
    color = 'text-gray-600';
    bgColor = 'bg-gray-50';
  } else if (score >= -0.6) {
    label = 'negative';
    emoji = '😔';
    color = 'text-orange-600';
    bgColor = 'bg-orange-50';
  } else {
    label = 'very_negative';
    emoji = '😢';
    color = 'text-red-600';
    bgColor = 'bg-red-50';
  }

  return {
    score,
    magnitude,
    label,
    emoji,
    color,
    bgColor
  };
}

export function getSentimentSummary(entries: string[]): {
  averageScore: number;
  trend: 'improving' | 'stable' | 'declining';
  predominantSentiment: SentimentScore['label'];
  emoji: string;
} {
  if (entries.length === 0) {
    return {
      averageScore: 0,
      trend: 'stable',
      predominantSentiment: 'neutral',
      emoji: '😐'
    };
  }

  const sentiments = entries.map(analyzeSentiment);
  const averageScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;

  // Determine trend (compare first half vs second half)
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (sentiments.length >= 4) {
    const midpoint = Math.floor(sentiments.length / 2);
    const firstHalf = sentiments.slice(0, midpoint);
    const secondHalf = sentiments.slice(midpoint);
    
    const firstAvg = firstHalf.reduce((sum, s) => sum + s.score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, s) => sum + s.score, 0) / secondHalf.length;
    
    if (secondAvg - firstAvg > 0.2) {
      trend = 'improving';
    } else if (firstAvg - secondAvg > 0.2) {
      trend = 'declining';
    }
  }

  // Determine predominant sentiment
  const labels = sentiments.map(s => s.label);
  const labelCounts = labels.reduce((acc, label) => {
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const predominantSentiment = Object.entries(labelCounts).sort((a, b) => b[1] - a[1])[0][0] as SentimentScore['label'];
  
  // Get emoji for predominant sentiment
  const emoji = analyzeSentiment(entries[entries.length - 1]).emoji;

  return {
    averageScore,
    trend,
    predominantSentiment,
    emoji
  };
}

export function analyzeMoodTrend(moods: string[]): {
  trend: 'improving' | 'stable' | 'declining';
  description: string;
  suggestion: string;
} {
  if (moods.length < 3) {
    return {
      trend: 'stable',
      description: 'Not enough data to determine trend',
      suggestion: 'Keep tracking your mood daily to see patterns'
    };
  }

  const moodScores: Record<string, number> = {
    'Very Happy': 1,
    'Happy': 0.75,
    'Good': 0.5,
    'Okay': 0.25,
    'Sad': -0.25,
    'Very Sad': -0.5,
    'Anxious': -0.3,
    'Tired': -0.2,
    'Energetic': 0.6,
    'Calm': 0.4
  };

  const scores = moods.map(mood => moodScores[mood] || 0);
  const recentScore = scores.slice(-3).reduce((sum, s) => sum + s, 0) / 3;
  const olderScore = scores.slice(0, -3).reduce((sum, s) => sum + s, 0) / (scores.length - 3);

  let trend: 'improving' | 'stable' | 'declining';
  let description: string;
  let suggestion: string;

  if (recentScore - olderScore > 0.2) {
    trend = 'improving';
    description = 'Your mood has been improving recently 📈';
    suggestion = 'Keep up whatever you\'re doing! Your current routine seems to be working.';
  } else if (olderScore - recentScore > 0.2) {
    trend = 'declining';
    description = 'Your mood has been declining recently 📉';
    suggestion = 'Consider talking to someone, practicing self-care, or consulting your healthcare provider.';
  } else {
    trend = 'stable';
    description = 'Your mood has been relatively stable';
    suggestion = 'Maintain your current lifestyle habits and keep tracking.';
  }

  return { trend, description, suggestion };
}
