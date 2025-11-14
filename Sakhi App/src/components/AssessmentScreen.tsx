import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { CheckCircle2, Circle, AlertCircle, Brain, TrendingUp, Activity } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { predictPCOSRisk } from '../utils/randomForest';

interface Question {
  id: string;
  question: string;
  category: 'menstrual' | 'physical' | 'metabolic' | 'lifestyle';
  type: 'single' | 'multiple';
  options: Array<{ value: string; label: string; score: number }>;
}

const questions: Question[] = [
  {
    id: 'q1',
    question: 'How regular is your menstrual cycle?',
    category: 'menstrual',
    type: 'single',
    options: [
      { value: 'regular', label: 'Very regular (every 21-35 days)', score: 0 },
      { value: 'irregular', label: 'Somewhat irregular (varies by 7+ days)', score: 2 },
      { value: 'very-irregular', label: 'Very irregular or absent for 3+ months', score: 4 },
    ],
  },
  {
    id: 'q2',
    question: 'Have you experienced absence of periods for 3+ months?',
    category: 'menstrual',
    type: 'single',
    options: [
      { value: 'no', label: 'No, never', score: 0 },
      { value: 'once', label: 'Yes, once or twice', score: 2 },
      { value: 'frequent', label: 'Yes, frequently', score: 4 },
    ],
  },
  {
    id: 'q3',
    question: 'Do you experience excessive hair growth (hirsutism)?',
    category: 'physical',
    type: 'single',
    options: [
      { value: 'no', label: 'No unusual hair growth', score: 0 },
      { value: 'mild', label: 'Mild (upper lip, chin)', score: 2 },
      { value: 'moderate', label: 'Moderate to severe (face, chest, back)', score: 4 },
    ],
  },
  {
    id: 'q4',
    question: 'Do you struggle with acne or oily skin?',
    category: 'physical',
    type: 'single',
    options: [
      { value: 'no', label: 'No, clear skin', score: 0 },
      { value: 'occasional', label: 'Occasional breakouts', score: 1 },
      { value: 'persistent', label: 'Persistent acne, especially on face/chest/back', score: 3 },
    ],
  },
  {
    id: 'q5',
    question: 'Have you experienced unexplained weight gain?',
    category: 'metabolic',
    type: 'single',
    options: [
      { value: 'no', label: 'No significant weight changes', score: 0 },
      { value: 'some', label: 'Some weight gain (2-5 kg)', score: 2 },
      { value: 'significant', label: 'Significant weight gain (5+ kg) or difficulty losing weight', score: 3 },
    ],
  },
  {
    id: 'q6',
    question: 'Do you experience hair thinning or hair loss?',
    category: 'physical',
    type: 'single',
    options: [
      { value: 'no', label: 'No hair thinning', score: 0 },
      { value: 'mild', label: 'Mild thinning', score: 2 },
      { value: 'noticeable', label: 'Noticeable hair loss or male-pattern baldness', score: 3 },
    ],
  },
  {
    id: 'q7',
    question: 'Do you have darkened skin patches (acanthosis nigricans)?',
    category: 'physical',
    type: 'single',
    options: [
      { value: 'no', label: 'No dark patches', score: 0 },
      { value: 'yes', label: 'Yes, especially on neck, armpits, or groin', score: 3 },
    ],
  },
  {
    id: 'q8',
    question: 'Have you been diagnosed with insulin resistance or pre-diabetes?',
    category: 'metabolic',
    type: 'single',
    options: [
      { value: 'no', label: 'No', score: 0 },
      { value: 'suspected', label: 'Suspected but not confirmed', score: 2 },
      { value: 'diagnosed', label: 'Yes, diagnosed by a doctor', score: 4 },
    ],
  },
  {
    id: 'q9',
    question: 'Do you have a family history of PCOS, diabetes, or thyroid issues?',
    category: 'metabolic',
    type: 'single',
    options: [
      { value: 'no', label: 'No family history', score: 0 },
      { value: 'distant', label: 'Distant relatives (cousins, aunts)', score: 1 },
      { value: 'immediate', label: 'Immediate family (mother, sister)', score: 3 },
    ],
  },
  {
    id: 'q10',
    question: 'How would you describe your stress levels?',
    category: 'lifestyle',
    type: 'single',
    options: [
      { value: 'low', label: 'Low, well-managed', score: 0 },
      { value: 'moderate', label: 'Moderate, some stressful periods', score: 1 },
      { value: 'high', label: 'High, constantly stressed', score: 2 },
    ],
  },
  {
    id: 'q11',
    question: 'How often do you exercise?',
    category: 'lifestyle',
    type: 'single',
    options: [
      { value: 'regular', label: '3+ times per week', score: 0 },
      { value: 'occasional', label: '1-2 times per week', score: 1 },
      { value: 'sedentary', label: 'Rarely or never', score: 2 },
    ],
  },
  {
    id: 'q12',
    question: 'How would you describe your diet?',
    category: 'lifestyle',
    type: 'single',
    options: [
      { value: 'healthy', label: 'Balanced, whole foods, low sugar', score: 0 },
      { value: 'moderate', label: 'Mix of healthy and processed foods', score: 1 },
      { value: 'unhealthy', label: 'Frequent processed foods, high sugar', score: 2 },
    ],
  },
];

export function AssessmentScreen() {
  const { saveAssessment } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = questions.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!answers[questions[currentStep].id]) {
      toast.error('Please select an answer before continuing');
      return;
    }

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    // Use Random Forest algorithm for more accurate prediction
    const prediction = predictPCOSRisk(answers, questions);
    
    const assessment = {
      date: new Date().toISOString(),
      score: Math.round(prediction.riskScore),
      maxScore: 100,
      percentage: prediction.riskScore,
      riskLevel: prediction.riskLevel,
      answers,
    };

    saveAssessment(assessment);
    setShowResults(true);
    toast.success(`Assessment completed with ${Math.round(prediction.confidence)}% confidence! 🎯`);
  };

  const getRecommendations = () => {
    const score = questions.reduce((sum, q) => {
      const answer = answers[q.id];
      const option = q.options.find(o => o.value === answer);
      return sum + (option?.score || 0);
    }, 0);

    const recommendations = [];

    if (score > 20) {
      recommendations.push({
        icon: '🏥',
        title: 'Consult a Healthcare Provider',
        description: 'Based on your symptoms, we recommend consulting with a gynecologist or endocrinologist for proper diagnosis.',
      });
    }

    if (answers.q8 === 'diagnosed' || answers.q5 === 'significant') {
      recommendations.push({
        icon: '🥗',
        title: 'Focus on Nutrition',
        description: 'Consider a low-GI diet rich in whole grains, lean proteins, and vegetables. Avoid processed sugars.',
      });
    }

    if (answers.q11 === 'sedentary' || answers.q11 === 'occasional') {
      recommendations.push({
        icon: '💪',
        title: 'Increase Physical Activity',
        description: 'Aim for 150 minutes of moderate exercise per week. Try a mix of cardio and strength training.',
      });
    }

    if (answers.q10 === 'high') {
      recommendations.push({
        icon: '🧘‍♀️',
        title: 'Manage Stress',
        description: 'Practice stress-reduction techniques like yoga, meditation, or deep breathing exercises.',
      });
    }

    recommendations.push({
      icon: '📊',
      title: 'Track Your Symptoms',
      description: 'Use Sakhi to consistently track your cycle, weight, and symptoms to identify patterns.',
    });

    return recommendations;
  };

  const currentQuestion = questions[currentStep];

  if (showResults) {
    const score = questions.reduce((sum, q) => {
      const answer = answers[q.id];
      const option = q.options.find(o => o.value === answer);
      return sum + (option?.score || 0);
    }, 0);

    const maxScore = questions.reduce((sum, q) => {
      const maxOption = Math.max(...q.options.map(o => o.score));
      return sum + maxOption;
    }, 0);

    const scorePercentage = (score / maxScore) * 100;

    let riskLevel: string;
    let riskColor: string;
    let riskEmoji: string;
    let riskDescription: string;

    if (scorePercentage <= 30) {
      riskLevel = 'Low Risk';
      riskColor = 'text-green-600 dark:text-green-400';
      riskEmoji = '✅';
      riskDescription = 'Your symptoms suggest a low likelihood of PCOS. However, continue monitoring your health.';
    } else if (scorePercentage <= 60) {
      riskLevel = 'Moderate Risk';
      riskColor = 'text-yellow-600 dark:text-yellow-400';
      riskEmoji = '⚠️';
      riskDescription = 'You may have some PCOS symptoms. Consider consulting a healthcare provider for evaluation.';
    } else {
      riskLevel = 'High Risk';
      riskColor = 'text-red-600 dark:text-red-400';
      riskEmoji = '🔴';
      riskDescription = 'Your symptoms are consistent with PCOS. We strongly recommend consulting a healthcare provider.';
    }

    const recommendations = getRecommendations();

    return (
      <div className="pb-24">
        <TopBar title="Assessment Results" backButton />

        <div className="px-6 space-y-6 pt-6">
          {/* Results Card */}
          <Card className="p-8 rounded-3xl border-none shadow-lg text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="w-20 h-20 rounded-full bg-white dark:bg-card mx-auto mb-4 flex items-center justify-center shadow-md">
              <span className="text-4xl">{riskEmoji}</span>
            </div>
            
            <h2 className="mb-2">Your PCOS Risk Assessment</h2>
            <p className={`${riskColor} mb-4`}>{riskLevel}</p>
            
            <div className="mb-6">
              <div className="text-5xl mb-2">{Math.round(scorePercentage)}%</div>
              <p className="text-sm text-muted-foreground">
                Risk Score: {score} out of {maxScore} points
              </p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {riskDescription}
            </p>
          </Card>

          {/* Category Breakdown */}
          <div>
            <h3 className="mb-4">Category Analysis</h3>
            <div className="space-y-3">
              {['menstrual', 'physical', 'metabolic', 'lifestyle'].map(category => {
                const categoryQuestions = questions.filter(q => q.category === category);
                const categoryScore = categoryQuestions.reduce((sum, q) => {
                  const answer = answers[q.id];
                  const option = q.options.find(o => o.value === answer);
                  return sum + (option?.score || 0);
                }, 0);
                const categoryMax = categoryQuestions.reduce((sum, q) => {
                  const maxOption = Math.max(...q.options.map(o => o.score));
                  return sum + maxOption;
                }, 0);
                const categoryPercentage = categoryMax > 0 ? (categoryScore / categoryMax) * 100 : 0;

                const categoryIcons = {
                  menstrual: '📅',
                  physical: '✨',
                  metabolic: '⚡',
                  lifestyle: '🏃‍♀️',
                };

                const categoryNames = {
                  menstrual: 'Menstrual Health',
                  physical: 'Physical Symptoms',
                  metabolic: 'Metabolic Markers',
                  lifestyle: 'Lifestyle Factors',
                };

                return (
                  <Card key={category} className="p-4 rounded-2xl border-none shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{categoryIcons[category]}</span>
                      <div className="flex-1">
                        <h4>{categoryNames[category]}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={categoryPercentage} className="h-2" />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(categoryPercentage)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="mb-4">Personalized Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <Card key={index} className="p-4 rounded-2xl border-none shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{rec.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <Card className="p-4 rounded-2xl border-none bg-muted/50">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="mb-1">Important Note</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This assessment is for informational purposes only and does not replace professional medical advice. 
                  Please consult with a qualified healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full rounded-full h-12" 
              onClick={() => {
                setShowResults(false);
                setCurrentStep(0);
                setAnswers({});
              }}
            >
              Take Assessment Again
            </Button>
            <Button 
              variant="outline" 
              className="w-full rounded-full h-12"
              onClick={() => window.history.back()}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <TopBar 
        title="PCOS Assessment" 
        subtitle={`Question ${currentStep + 1} of ${totalQuestions}`}
        backButton 
      />

      <div className="px-6 space-y-6 pt-6">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
            <span className="text-sm">
              {currentStep + 1}/{totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-6 rounded-3xl border-none shadow-lg bg-gradient-to-br from-card to-muted/30">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 mb-4">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-xs text-primary capitalize">
                {currentQuestion.category.replace('-', ' ')}
              </span>
            </div>
            <h3 className="mb-2">{currentQuestion.question}</h3>
            <p className="text-sm text-muted-foreground">
              Select the option that best describes your situation
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                      {isSelected ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </div>
                    <span className={isSelected ? '' : 'text-muted-foreground'}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 rounded-full h-12"
            >
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 rounded-full h-12"
            disabled={!answers[currentQuestion.id]}
          >
            {currentStep === totalQuestions - 1 ? 'View Results' : 'Next'}
          </Button>
        </div>

        {/* Help Text */}
        <Card className="p-4 rounded-2xl border-none bg-secondary/10">
          <div className="flex gap-3">
            <Activity className="w-5 h-5 text-secondary-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              This assessment helps identify potential PCOS symptoms based on established medical criteria. 
              Your responses are saved securely and can be shared with your healthcare provider.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
