import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, FileText, Sparkles, Download, X, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TopBar } from './TopBar';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { analyzeSentiment } from '../utils/sentimentAnalysis';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

const mockBloodTests = [
  {
    id: 1,
    name: 'Hormone Panel',
    date: 'Nov 1, 2024',
    metrics: [
      { name: 'TSH', value: '2.5 mIU/L', status: 'normal', range: '0.5-5.0' },
      { name: 'FSH', value: '6.8 mIU/mL', status: 'normal', range: '3.0-10.0' },
      { name: 'LH', value: '12.4 mIU/mL', status: 'elevated', range: '2.0-10.0' },
    ]
  },
  {
    id: 2,
    name: 'Metabolic Panel',
    date: 'Oct 15, 2024',
    metrics: [
      { name: 'Glucose', value: '95 mg/dL', status: 'normal', range: '70-100' },
      { name: 'HbA1c', value: '5.4%', status: 'normal', range: '<5.7%' },
      { name: 'Insulin', value: '18 μU/mL', status: 'borderline', range: '2-15' },
    ]
  }
];

const mockUltrasound = [
  {
    id: 1,
    name: 'Pelvic Ultrasound',
    date: 'Oct 20, 2024',
    findings: 'Multiple small follicles observed in both ovaries. Consistent with PCOS presentation.',
    doctor: 'Dr. Sharma'
  }
];

export function ReportsScreen() {
  const [activeTab, setActiveTab] = useState('blood');
  const [aiExplanation, setAiExplanation] = useState<{reportId: number, text: string, sentiment?: any} | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const { settings } = useApp();
  const t = getTranslation(settings.language);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30';
      case 'elevated':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30';
      case 'borderline':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getAIExplanation = async (report: any, type: 'blood' | 'ultrasound') => {
    setLoadingAI(true);
    
    try {
      let prompt = '';
      
      if (type === 'blood') {
        const metricsText = report.metrics.map((m: any) => 
          `${m.name}: ${m.value} (${m.status}, normal range: ${m.range})`
        ).join(', ');
        
        prompt = settings.language === 'hi' 
          ? `इस रक्त परीक्षण रिपोर्ट को सरल भाषा में समझाएं और PCOS के संदर्भ में इसका क्या मतलब है बताएं। ${report.name} - ${metricsText}. रिपोर्ट में कौन से मान सामान्य हैं और कौन से चिंता का विषय हैं?`
          : `Explain this blood test report in simple terms and what it means for PCOS. ${report.name} - ${metricsText}. Which values are normal and which should be a concern? Keep it brief and supportive.`;
      } else {
        prompt = settings.language === 'hi'
          ? `इस अल्ट्रासाउंड रिपोर्ट को सरल भाषा में समझाएं और PCOS के संदर्भ में इसका क्या मतलब है बताएं। निष्कर्ष: ${report.findings}. यह क्या संकेत देता है?`
          : `Explain this ultrasound report in simple terms and what it means for PCOS. Findings: ${report.findings}. What does this indicate? Keep it brief and supportive.`;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fab45668/ai-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            message: prompt,
            conversationHistory: []
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get AI explanation');
      }

      const data = await response.json();
      const sentiment = analyzeSentiment(data.response);
      
      setAiExplanation({
        reportId: report.id,
        text: data.response,
        sentiment
      });
      
    } catch (error) {
      console.error('Error getting AI explanation:', error);
      toast.error(settings.language === 'hi' 
        ? 'AI स्पष्टीकरण प्राप्त करने में विफल। कृपया पुनः प्रयास करें।'
        : 'Failed to get AI explanation. Please try again.'
      );
    } finally {
      setLoadingAI(false);
    }
  };

  const handleUpload = () => {
    toast.info(settings.language === 'hi'
      ? 'फ़ाइल अपलोड सुविधा जल्द ही आ रही है! 📎'
      : 'File upload feature coming soon! 📎'
    );
  };

  return (
    <div className="pb-24">
      {/* Top Bar */}
      <TopBar 
        title={settings.language === 'hi' ? 'स्वास्थ्य रिपोर्ट' : 'Health Reports'}
        subtitle={settings.language === 'hi' ? 'अपनी चिकित्सा रिपोर्ट अपलोड करें और ट्रैक करें' : 'Upload and track your medical reports'}
      />

      <div className="px-6 space-y-6">

      {/* Upload Card */}
      <Card 
        onClick={handleUpload}
        className="p-6 rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer active:scale-98"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h4 className="mb-1">
            {settings.language === 'hi' ? 'नई रिपोर्ट अपलोड करें' : 'Upload New Report'}
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            PDF, JPG, PNG up to 10MB
          </p>
          <Button className="rounded-full bg-primary hover:bg-primary/90">
            {settings.language === 'hi' ? 'फ़ाइल चुनें' : 'Choose File'}
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-12 bg-muted/50 rounded-2xl p-1">
          <TabsTrigger value="blood" className="rounded-xl">
            🩸 {settings.language === 'hi' ? 'रक्त परीक्षण' : 'Blood Tests'}
          </TabsTrigger>
          <TabsTrigger value="ultrasound" className="rounded-xl">
            📊 {settings.language === 'hi' ? 'अल्ट्रासाउंड' : 'Ultrasound'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blood" className="mt-6 space-y-4">
          {mockBloodTests.map((report) => (
            <Card key={report.id} className="p-5 rounded-3xl border-none shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4>{report.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground active:scale-95">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-sm">{settings.language === 'hi' ? 'मुख्य मेट्रिक्स' : 'Key Metrics'}</p>
                {report.metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div>
                      <p className="text-sm">{metric.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{metric.value}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full capitalize ${getStatusColor(metric.status)}`}>
                      {settings.language === 'hi' 
                        ? (metric.status === 'normal' ? 'सामान्य' : metric.status === 'elevated' ? 'उच्च' : 'सीमारेखा')
                        : metric.status
                      }
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => getAIExplanation(report, 'blood')}
                disabled={loadingAI && aiExplanation?.reportId !== report.id}
                variant="outline"
                className="w-full mt-4 rounded-2xl border-secondary/50 hover:bg-secondary/10 active:scale-98"
              >
                {loadingAI && aiExplanation?.reportId === report.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 text-secondary animate-spin" />
                    {settings.language === 'hi' ? 'AI विश्लेषण कर रहा है...' : 'AI Analyzing...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 text-secondary" />
                    {settings.language === 'hi' ? 'AI से समझाएं' : 'Explain with AI'}
                  </>
                )}
              </Button>

              {/* AI Explanation */}
              {aiExplanation && aiExplanation.reportId === report.id && (
                <div className="mt-4 p-4 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl border border-secondary/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      <h5 className="text-sm">{settings.language === 'hi' ? 'AI स्पष्टीकरण' : 'AI Explanation'}</h5>
                      {aiExplanation.sentiment && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${aiExplanation.sentiment.bgColor} ${aiExplanation.sentiment.color}`}>
                          {aiExplanation.sentiment.emoji}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => setAiExplanation(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {aiExplanation.text}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ultrasound" className="mt-6 space-y-4">
          {mockUltrasound.map((report) => (
            <Card key={report.id} className="p-5 rounded-3xl border-none shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4>{report.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground active:scale-95">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-muted/30 rounded-2xl p-4 mb-4">
                <p className="text-sm mb-2">
                  {settings.language === 'hi' ? 'निष्कर्ष' : 'Findings'}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {report.findings}
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  {settings.language === 'hi' ? 'द्वारा समीक्षित' : 'Reviewed by'}: {report.doctor}
                </p>
              </div>

              <Button
                onClick={() => getAIExplanation(report, 'ultrasound')}
                disabled={loadingAI}
                variant="outline"
                className="w-full rounded-2xl border-secondary/50 hover:bg-secondary/10 active:scale-98"
              >
                {loadingAI && aiExplanation?.reportId === report.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 text-secondary animate-spin" />
                    {settings.language === 'hi' ? 'AI विश्लेषण कर रहा है...' : 'AI Analyzing...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 text-secondary" />
                    {settings.language === 'hi' ? 'AI से समझाएं' : 'Explain with AI'}
                  </>
                )}
              </Button>

              {/* AI Explanation */}
              {aiExplanation && aiExplanation.reportId === report.id && (
                <div className="mt-4 p-4 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl border border-secondary/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      <h5 className="text-sm">{settings.language === 'hi' ? 'AI स्पष्टीकरण' : 'AI Explanation'}</h5>
                      {aiExplanation.sentiment && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${aiExplanation.sentiment.bgColor} ${aiExplanation.sentiment.color}`}>
                          {aiExplanation.sentiment.emoji}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => setAiExplanation(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {aiExplanation.text}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* AI Summary with Sentiment */}
      <Card className="p-5 rounded-3xl border-none bg-gradient-to-br from-secondary/10 to-accent/10 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div>
            <h4 className="mb-2">
              {settings.language === 'hi' ? 'AI स्वास्थ्य सारांश' : 'AI Health Summary'}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {settings.language === 'hi'
                ? 'आपकी हालिया रिपोर्टों के आधार पर, आपके हार्मोन स्तर सामान्य PCOS पैटर्न दिखाते हैं। अपने डॉक्टर से इंसुलिन प्रबंधन पर चर्चा करने पर विचार करें।'
                : 'Based on your recent reports, your hormone levels show typical PCOS patterns. Consider discussing insulin management with your doctor.'
              }
            </p>
            <div className="flex items-center gap-2 mt-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">
                {settings.language === 'hi' ? 'स्थिर सुधार' : 'Steady improvement'}
              </span>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}
