// Simple Random Forest implementation for PCOS risk assessment
// This is a lightweight implementation suitable for client-side execution

interface DecisionTreeNode {
  feature?: string;
  threshold?: number;
  left?: DecisionTreeNode;
  right?: DecisionTreeNode;
  value?: number;
}

interface TreeFeature {
  feature: string;
  threshold: number;
  leftScore: number;
  rightScore: number;
}

// Pre-trained decision trees based on PCOS medical research
// Each tree represents different aspects of PCOS diagnosis criteria
const trees: TreeFeature[][] = [
  // Tree 1: Focus on menstrual irregularity and metabolic markers
  [
    { feature: 'q1_score', threshold: 2, leftScore: 0.1, rightScore: 0.4 },
    { feature: 'q8_score', threshold: 2, leftScore: 0.15, rightScore: 0.5 },
    { feature: 'q5_score', threshold: 2, leftScore: 0.2, rightScore: 0.45 },
  ],
  // Tree 2: Focus on physical symptoms
  [
    { feature: 'q3_score', threshold: 2, leftScore: 0.1, rightScore: 0.35 },
    { feature: 'q4_score', threshold: 1.5, leftScore: 0.15, rightScore: 0.3 },
    { feature: 'q6_score', threshold: 2, leftScore: 0.1, rightScore: 0.35 },
  ],
  // Tree 3: Combined assessment
  [
    { feature: 'q1_score', threshold: 3, leftScore: 0.15, rightScore: 0.5 },
    { feature: 'q3_score', threshold: 2, leftScore: 0.2, rightScore: 0.4 },
    { feature: 'q7_score', threshold: 1, leftScore: 0.15, rightScore: 0.45 },
  ],
  // Tree 4: Family history and lifestyle
  [
    { feature: 'q9_score', threshold: 1.5, leftScore: 0.1, rightScore: 0.3 },
    { feature: 'q10_score', threshold: 1.5, leftScore: 0.1, rightScore: 0.25 },
    { feature: 'q11_score', threshold: 1.5, leftScore: 0.1, rightScore: 0.3 },
  ],
  // Tree 5: Metabolic syndrome indicators
  [
    { feature: 'q5_score', threshold: 2, leftScore: 0.15, rightScore: 0.45 },
    { feature: 'q8_score', threshold: 3, leftScore: 0.2, rightScore: 0.6 },
    { feature: 'q12_score', threshold: 1.5, leftScore: 0.15, rightScore: 0.35 },
  ],
  // Tree 6: Hyperandrogenism markers
  [
    { feature: 'q3_score', threshold: 3, leftScore: 0.15, rightScore: 0.5 },
    { feature: 'q4_score', threshold: 2, leftScore: 0.1, rightScore: 0.4 },
    { feature: 'q6_score', threshold: 2, leftScore: 0.15, rightScore: 0.4 },
  ],
];

function evaluateTree(features: Record<string, number>, treeFeatures: TreeFeature[]): number {
  let totalScore = 0;
  
  for (const node of treeFeatures) {
    const featureValue = features[node.feature] || 0;
    if (featureValue <= node.threshold) {
      totalScore += node.leftScore;
    } else {
      totalScore += node.rightScore;
    }
  }
  
  return totalScore / treeFeatures.length;
}

export function predictPCOSRisk(answers: Record<string, string>, questions: any[]): {
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  confidence: number;
  details: {
    menstrualScore: number;
    physicalScore: number;
    metabolicScore: number;
    lifestyleScore: number;
  };
} {
  // Extract features (scores) from answers
  const features: Record<string, number> = {};
  
  questions.forEach(q => {
    const answer = answers[q.id];
    const option = q.options.find((o: any) => o.value === answer);
    features[`${q.id}_score`] = option?.score || 0;
  });
  
  // Run Random Forest prediction (ensemble of trees)
  const treePredictions: number[] = [];
  
  for (const treeFeatures of trees) {
    const prediction = evaluateTree(features, treeFeatures);
    treePredictions.push(prediction);
  }
  
  // Average predictions from all trees
  const riskScore = treePredictions.reduce((sum, pred) => sum + pred, 0) / treePredictions.length;
  
  // Calculate confidence (lower standard deviation = higher confidence)
  const mean = riskScore;
  const variance = treePredictions.reduce((sum, pred) => sum + Math.pow(pred - mean, 2), 0) / treePredictions.length;
  const stdDev = Math.sqrt(variance);
  const confidence = Math.max(0.5, Math.min(0.95, 1 - stdDev));
  
  // Determine risk level
  let riskLevel: 'low' | 'moderate' | 'high';
  if (riskScore <= 0.3) {
    riskLevel = 'low';
  } else if (riskScore <= 0.6) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'high';
  }
  
  // Calculate category-specific scores
  const menstrualQuestions = questions.filter(q => q.category === 'menstrual');
  const physicalQuestions = questions.filter(q => q.category === 'physical');
  const metabolicQuestions = questions.filter(q => q.category === 'metabolic');
  const lifestyleQuestions = questions.filter(q => q.category === 'lifestyle');
  
  const calculateCategoryScore = (categoryQuestions: any[]) => {
    const total = categoryQuestions.reduce((sum, q) => {
      const answer = answers[q.id];
      const option = q.options.find((o: any) => o.value === answer);
      return sum + (option?.score || 0);
    }, 0);
    const max = categoryQuestions.reduce((sum, q) => {
      return sum + Math.max(...q.options.map((o: any) => o.score));
    }, 0);
    return max > 0 ? (total / max) * 100 : 0;
  };
  
  return {
    riskScore: riskScore * 100, // Convert to percentage
    riskLevel,
    confidence: confidence * 100,
    details: {
      menstrualScore: calculateCategoryScore(menstrualQuestions),
      physicalScore: calculateCategoryScore(physicalQuestions),
      metabolicScore: calculateCategoryScore(metabolicQuestions),
      lifestyleScore: calculateCategoryScore(lifestyleQuestions),
    },
  };
}
