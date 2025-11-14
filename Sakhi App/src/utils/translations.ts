// Translation system for Sakhi PCOS Companion App
// Currently supports English (en) and Hindi (hi)

export type Language = 'en' | 'hi';

export interface Translations {
  // Common
  home: string;
  cycle: string;
  weight: string;
  ai: string;
  profile: string;
  
  // Home Screen
  hiThere: string;
  howFeelingToday: string;
  pcosRiskScore: string;
  notAssessed: string;
  takeAssessment: string;
  lastPeriod: string;
  notTracked: string;
  daysAgo: string;
  todaysMood: string;
  notLogged: string;
  currentWeight: string;
  quickActions: string;
  assessment: string;
  askAI: string;
  reports: string;
  todaysAITip: string;
  personalized: string;
  learnMore: string;
  upcoming: string;
  expectedPeriod: string;
  inDays: string;
  healthInsights: string;
  
  // Profile
  manageAccount: string;
  editProfile: string;
  daysTracked: string;
  aiChats: string;
  settings: string;
  language: string;
  darkMode: string;
  enabled: string;
  disabled: string;
  notifications: string;
  periodReminders: string;
  dataPrivacy: string;
  exportData: string;
  downloadData: string;
  researchConsent: string;
  helpResearch: string;
  about: string;
  termsOfService: string;
  privacyPolicy: string;
  aboutSakhi: string;
  version: string;
  logout: string;
  
  // Notifications & Reminders
  motivationalNudges: string;
  wellnessReminders: string;
  customizeReminders: string;
  morningReminder: string;
  afternoonReminder: string;
  eveningReminder: string;
  
  // Assessment
  pcosAssessment: string;
  question: string;
  of: string;
  complete: string;
  selectOption: string;
  previous: string;
  next: string;
  viewResults: string;
  yourPCOSRisk: string;
  lowRisk: string;
  moderateRisk: string;
  highRisk: string;
  riskScore: string;
  points: string;
  categoryAnalysis: string;
  menstrualHealth: string;
  physicalSymptoms: string;
  metabolicMarkers: string;
  lifestyleFactors: string;
  personalizedRecommendations: string;
  importantNote: string;
  disclaimer: string;
  takeAgain: string;
  backToHome: string;
  
  // Plans
  personalizedPlans: string;
  aiCuratedPlans: string;
  yourPlans: string;
  tailoredForPCOS: string;
  dietPlan: string;
  workoutPlan: string;
  mealsPlanned: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  regenerateDietPlan: string;
  generateWorkoutPlan: string;
  
  // Toast messages
  welcomeMessage: string;
  darkModeEnabled: string;
  lightModeEnabled: string;
  notificationsEnabled: string;
  notificationsDisabled: string;
  researchConsentThanks: string;
  researchConsentDisabled: string;
  dataExportedSuccess: string;
  logoutSuccess: string;
  languageChanged: string;
  dietPlanRegenerated: string;
  
  // Motivational Messages
  motivationalMessages: string[];
}

const translations: Record<Language, Translations> = {
  en: {
    // Common
    home: 'Home',
    cycle: 'Cycle',
    weight: 'Weight',
    ai: 'AI',
    profile: 'Profile',
    
    // Home Screen
    hiThere: 'Hi',
    howFeelingToday: 'How are you feeling today?',
    pcosRiskScore: 'PCOS Risk Score',
    notAssessed: 'Not assessed',
    takeAssessment: 'Take assessment',
    lastPeriod: 'Last Period',
    notTracked: 'Not tracked',
    daysAgo: 'days ago',
    todaysMood: "Today's Mood",
    notLogged: 'Not logged',
    currentWeight: 'Current Weight',
    quickActions: 'Quick Actions',
    assessment: 'Assessment',
    askAI: 'Ask AI',
    reports: 'Reports',
    todaysAITip: "Today's AI Tip",
    personalized: 'Personalized',
    learnMore: 'Learn more',
    upcoming: 'Upcoming',
    expectedPeriod: 'Expected Period',
    inDays: 'In',
    healthInsights: 'Health Insights',
    
    // Profile
    manageAccount: 'Manage your account settings',
    editProfile: 'Edit Profile',
    daysTracked: 'Days Tracked',
    aiChats: 'AI Chats',
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    enabled: 'Enabled',
    disabled: 'Disabled',
    notifications: 'Notifications',
    periodReminders: 'Period reminders, tips',
    dataPrivacy: 'Data & Privacy',
    exportData: 'Export Data',
    downloadData: 'Download all your data',
    researchConsent: 'Research Consent',
    helpResearch: 'Help PCOS research (anonymous)',
    about: 'About',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    aboutSakhi: 'About Sakhi',
    version: 'Version',
    logout: 'Logout',
    
    // Notifications & Reminders
    motivationalNudges: 'Motivational Nudges',
    wellnessReminders: 'Wellness Reminders',
    customizeReminders: 'Customize your daily reminders',
    morningReminder: 'Morning Reminder',
    afternoonReminder: 'Afternoon Reminder',
    eveningReminder: 'Evening Reminder',
    
    // Assessment
    pcosAssessment: 'PCOS Assessment',
    question: 'Question',
    of: 'of',
    complete: 'Complete',
    selectOption: 'Select the option that best describes your situation',
    previous: 'Previous',
    next: 'Next',
    viewResults: 'View Results',
    yourPCOSRisk: 'Your PCOS Risk Assessment',
    lowRisk: 'Low Risk',
    moderateRisk: 'Moderate Risk',
    highRisk: 'High Risk',
    riskScore: 'Risk Score',
    points: 'points',
    categoryAnalysis: 'Category Analysis',
    menstrualHealth: 'Menstrual Health',
    physicalSymptoms: 'Physical Symptoms',
    metabolicMarkers: 'Metabolic Markers',
    lifestyleFactors: 'Lifestyle Factors',
    personalizedRecommendations: 'Personalized Recommendations',
    importantNote: 'Important Note',
    disclaimer: 'This assessment is for informational purposes only and does not replace professional medical advice.',
    takeAgain: 'Take Assessment Again',
    backToHome: 'Back to Home',
    
    // Plans
    personalizedPlans: 'Personalized Plans',
    aiCuratedPlans: 'AI-curated diet and workout plans',
    yourPlans: 'Your Plans',
    tailoredForPCOS: 'Tailored specifically for PCOS management and your lifestyle',
    dietPlan: 'Diet Plan',
    workoutPlan: 'Workout Plan',
    mealsPlanned: 'meals planned',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    regenerateDietPlan: 'Regenerate Diet Plan',
    generateWorkoutPlan: 'Generate New Workout Plan',
    
    // Toast messages
    welcomeMessage: 'Welcome to Sakhi! Start by tracking your cycle or weight 🌸',
    darkModeEnabled: 'Dark mode enabled 🌙',
    lightModeEnabled: 'Light mode enabled ☀️',
    notificationsEnabled: 'Notifications enabled 🔔',
    notificationsDisabled: 'Notifications disabled',
    researchConsentThanks: 'Thank you for supporting PCOS research! 🙏',
    researchConsentDisabled: 'Research consent disabled',
    dataExportedSuccess: 'Data exported successfully! 📥',
    logoutSuccess: 'Logged out successfully. Take care! 🌸',
    languageChanged: 'Language changed successfully! 🌐',
    dietPlanRegenerated: 'New diet plan generated! 🥗',
    
    // Motivational Messages
    motivationalMessages: [
      "You're doing great! Every small step counts towards better health. 💪",
      "Remember to drink water and take your supplements today! 💧",
      "Your body is strong and capable. Trust the process. 🌸",
      "Consistency is key! Keep tracking your progress. 📊",
      "Take a moment to breathe and relax. You deserve it. 🧘‍♀️",
      "Celebrate small wins! You logged your cycle today. 🎉",
      "Healthy eating is self-care. Your body thanks you! 🥗",
      "Exercise is a celebration of what your body can do! 💃",
      "You're not alone in this journey. We're here for you. 🤗",
      "Rest is productive. Listen to your body's needs. 😴",
    ],
  },
  hi: {
    // Common
    home: 'होम',
    cycle: 'साइकिल',
    weight: 'वजन',
    ai: 'AI',
    profile: 'प्रोफाइल',
    
    // Home Screen
    hiThere: 'नमस्ते',
    howFeelingToday: 'आज आप कैसा महसूस कर रही हैं?',
    pcosRiskScore: 'PCOS जोखिम स्कोर',
    notAssessed: 'मूल्यांकन नहीं किया गया',
    takeAssessment: 'मूल्यांकन करें',
    lastPeriod: 'अंतिम माहवारी',
    notTracked: 'ट्रैक नहीं किया गया',
    daysAgo: 'दिन पहले',
    todaysMood: 'आज का मूड',
    notLogged: 'लॉग नहीं किया गया',
    currentWeight: 'वर्तमान वजन',
    quickActions: 'त्वरित कार्य',
    assessment: 'मूल्यांकन',
    askAI: 'AI से पूछें',
    reports: 'रिपोर्ट',
    todaysAITip: 'आज की AI टिप',
    personalized: 'व्यक्तिगत',
    learnMore: 'और जानें',
    upcoming: 'आगामी',
    expectedPeriod: 'अपेक्षित माहवारी',
    inDays: 'में',
    healthInsights: 'स्वास्थ्य अंतर्दृष्टि',
    
    // Profile
    manageAccount: 'अपनी खाता सेटिंग्स प्रबंधित करें',
    editProfile: 'प्रोफाइल संपादित करें',
    daysTracked: 'ट्रैक किए गए दिन',
    aiChats: 'AI चैट',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    darkMode: 'डार्क मोड',
    enabled: 'सक्षम',
    disabled: 'अक्षम',
    notifications: 'सूचनाएं',
    periodReminders: 'माहवारी अनुस्मारक, टिप्स',
    dataPrivacy: 'डेटा और गोपनीयता',
    exportData: 'डेटा निर्यात करें',
    downloadData: 'अपना सभी डेटा डाउनलोड करें',
    researchConsent: 'अनुसंधान सहमति',
    helpResearch: 'PCOS अनुसंधान में मदद करें (गुमनाम)',
    about: 'के बारे में',
    termsOfService: 'सेवा की शर्तें',
    privacyPolicy: 'गोपनीयता नीति',
    aboutSakhi: 'सखी के बारे में',
    version: 'संस्करण',
    logout: 'लॉग आउट',
    
    // Notifications & Reminders
    motivationalNudges: 'प्रेरक संदेश',
    wellnessReminders: 'स्वास्थ्य अनुस्मारक',
    customizeReminders: 'अपने दैनिक अनुस्मारक को अनुकूलित करें',
    morningReminder: 'सुबह का अनुस्मारक',
    afternoonReminder: 'दोपहर का अनुस्मारक',
    eveningReminder: 'शाम का अनुस्मारक',
    
    // Assessment
    pcosAssessment: 'PCOS मूल्यांकन',
    question: 'प्रश्न',
    of: 'का',
    complete: 'पूर्ण',
    selectOption: 'वह विकल्प चुनें जो आपकी स्थिति का सबसे अच्छा वर्णन करता है',
    previous: 'पिछला',
    next: 'अगला',
    viewResults: 'परिणाम देखें',
    yourPCOSRisk: 'आपका PCOS जोखिम मूल्यांकन',
    lowRisk: 'कम जोखिम',
    moderateRisk: 'मध्यम जोखिम',
    highRisk: 'उच्च जोखिम',
    riskScore: 'जोखिम स्कोर',
    points: 'अंक',
    categoryAnalysis: 'श्रेणी विश्लेषण',
    menstrualHealth: 'माहवारी स्वास्थ्य',
    physicalSymptoms: 'शारीरिक लक्षण',
    metabolicMarkers: 'चयापचय मार्कर',
    lifestyleFactors: 'जीवनशैली कारक',
    personalizedRecommendations: 'व्यक्तिगत सिफारिशें',
    importantNote: 'महत्वपूर्ण नोट',
    disclaimer: 'यह मूल्यांकन केवल सूचनात्मक उद्देश्यों के लिए है और पेशेवर चिकित्सा सलाह का स्थान नहीं लेता है।',
    takeAgain: 'फिर से मूल्यांकन करें',
    backToHome: 'होम पर वापस जाएं',
    
    // Plans
    personalizedPlans: 'व्यक्तिगत योजनाएं',
    aiCuratedPlans: 'AI-क्यूरेटेड आहार और कसरत योजनाएं',
    yourPlans: 'आपकी योजनाएं',
    tailoredForPCOS: 'विशेष रूप से PCOS प्रबंधन और आपकी जीवनशैली के लिए तैयार',
    dietPlan: 'आहार योजना',
    workoutPlan: 'कसरत योजना',
    mealsPlanned: 'भोजन योजनाबद्ध',
    breakfast: 'नाश्ता',
    lunch: 'दोपहर का खाना',
    dinner: 'रात का खाना',
    regenerateDietPlan: 'आहार योजना पुनर्जीवित करें',
    generateWorkoutPlan: 'नई कसरत योजना बनाएं',
    
    // Toast messages
    welcomeMessage: 'सखी में आपका स्वागत है! अपने चक्र या वजन को ट्रैक करके शुरू करें 🌸',
    darkModeEnabled: 'डार्क मोड सक्षम किया गया 🌙',
    lightModeEnabled: 'लाइट मोड सक्षम किया गया ☀️',
    notificationsEnabled: 'सूचनाएं सक्षम की गईं 🔔',
    notificationsDisabled: 'सूचनाएं अक्षम की गईं',
    researchConsentThanks: 'PCOS अनुसंधान का समर्थन करने के लिए धन्यवाद! 🙏',
    researchConsentDisabled: 'अनुसंधान सहमति अक्षम की गई',
    dataExportedSuccess: 'डेटा सफलतापूर्वक निर्यात किया गया! 📥',
    logoutSuccess: 'सफलतापूर्वक लॉग आउट हो गया। ध्यान रखें! 🌸',
    languageChanged: 'भाषा सफलतापूर्वक बदल दी गई! 🌐',
    dietPlanRegenerated: 'नई आहार योजना बनाई गई! 🥗',
    
    // Motivational Messages
    motivationalMessages: [
      "आप बहुत अच्छा कर रही हैं! हर छोटा कदम बेहतर स्वास्थ्य की ओर मायने रखता है। 💪",
      "आज पानी पीना और अपनी दवाएं लेना याद रखें! 💧",
      "आपका शरीर मजबूत और सक्षम है। प्रक्रिया पर विश्वास करें। 🌸",
      "निरंतरता ही कुंजी है! अपनी प्रगति को ट्रैक करते रहें। 📊",
      "सांस लेने और आराम करने के लिए एक पल निकालें। आप इसके लायक हैं। 🧘‍♀️",
      "छोटी जीत का जश्न मनाएं! आपने आज अपना चक्र लॉग किया। 🎉",
      "स्वस्थ खाना आत्म-देखभाल है। आपका शरीर आपको धन्यवाद देता है! 🥗",
      "व्यायाम इस बात का उत्सव है कि आपका शरीर क्या कर सकता है! 💃",
      "आप इस यात्रा में अकेली नहीं हैं। हम आपके लिए यहाँ हैं। 🤗",
      "आराम उत्पादक है। अपने शरीर की जरूरतों को सुनें। 😴",
    ],
  },
};

export function getTranslation(language: Language): Translations {
  return translations[language] || translations.en;
}

export function getLanguageName(language: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    hi: 'हिंदी (Hindi)',
  };
  return names[language] || 'English';
}
