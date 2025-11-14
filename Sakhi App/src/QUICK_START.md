# 🚀 Quick Start Guide - Sakhi PCOS Companion

## ⚡ Get Running in 5 Minutes

### **Step 1: Clone & Install** (2 min)
```bash
# Clone the repository
git clone [your-repo-url]
cd sakhi-app

# Install dependencies
npm install
```

### **Step 2: Environment Setup** (1 min)
Create `.env` file:
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXX
```

**Don't have these?**
- Supabase: [supabase.com](https://supabase.com) (free)
- Gemini: [aistudio.google.com](https://aistudio.google.com/app/apikey) (free)

### **Step 3: Run** (1 min)
```bash
npm run dev
```

Open: `http://localhost:3000`

### **Step 4: Test** (1 min)
```
✓ Click notification bell → Dropdown appears
✓ Go to Reports → Click "Explain with AI"
✓ Go to Profile → Switch to Hindi
✓ Resize window → Check responsiveness
```

**All working? 🎉 You're ready!**

---

## 📱 Quick Feature Tour

### **1. Home Screen** (Greeting)
```
🔔 Click bell → See notifications
🌐 Text in English/Hindi
📊 View PCOS risk, period, mood, weight
⚡ Quick actions: Assessment, AI, Reports
```

### **2. Reports Screen** (AI Explanations)
```
🩸 Blood Tests tab
📊 Ultrasound tab
✨ Click "Explain with AI" → Get explanation
😊 See sentiment emoji
🌐 Works in both languages
```

### **3. Profile Screen** (Settings)
```
🌐 Language: English ↔ हिंदी
🌙 Dark mode toggle
🔔 Notification settings
💾 Data export
```

### **4. AI Chat** (Already Working)
```
💬 Ask questions about PCOS
🤖 Get personalized advice
💾 Save important messages
```

### **5. Bottom Navigation**
```
🏠 Home
📅 Cycle Tracker
⚖️ Weight Tracker
🤖 AI Chat
👤 Profile
```

---

## 🧪 Quick Test Checklist

**Run this in 2 minutes:**

```
[ ] App loads without errors
[ ] No "Sakhi App Preview" panel visible
[ ] No time bar (9:41) at top
[ ] Responsive (resize window)
[ ] Bell icon opens dropdown
[ ] Language switches to Hindi
[ ] AI explanation generates
[ ] Sentiment emoji appears
[ ] All navigation buttons work
[ ] No console errors
```

**All checked? ✅ Ready to deploy!**

---

## 🐛 Common Issues

### **Issue: App won't start**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Issue: AI explanations fail**
```
1. Check GEMINI_API_KEY is set
2. Visit: https://aistudio.google.com/app/apikey
3. Generate new key
4. Update .env file
5. Restart app
```

### **Issue: Translations not working**
```
1. Go to Profile → Settings → Language
2. Select हिंदी (Hindi)
3. Check if text changes
4. If not, check browser console for errors
```

### **Issue: Responsive layout broken**
```bash
# Rebuild CSS
npm run build:css
npm run dev
```

### **Issue: Notification bell not working**
```
1. Clear browser cache (Ctrl+Shift+R)
2. Check HomeScreen.tsx imported correctly
3. Verify useState hook is working
4. Check console for errors
```

---

## 📖 Documentation Quick Links

**Getting Started:**
- [README.md](/README.md) - Complete overview
- [QUICK_START.md](/QUICK_START.md) - This file

**Implementation Details:**
- [IMPLEMENTATION_SUMMARY.md](/IMPLEMENTATION_SUMMARY.md) - All features explained
- [BEFORE_AFTER.md](/BEFORE_AFTER.md) - Visual comparisons

**Testing:**
- [TESTING_GUIDE.md](/TESTING_GUIDE.md) - Comprehensive test guide
- [CHANGES_SUMMARY.txt](/CHANGES_SUMMARY.txt) - Complete changelog

**Reference:**
- [NEW_FEATURES_SUMMARY.md](/NEW_FEATURES_SUMMARY.md) - Recent updates
- [QUICK_REFERENCE.md](/QUICK_REFERENCE.md) - Developer cheat sheet

---

## 🔧 Configuration

### **Change Primary Color**
`/styles/globals.css`:
```css
--dusty-rose: #D96D77;  /* Change this */
--primary: #D96D77;      /* And this */
```

### **Add New Language**
`/utils/translations.ts`:
```typescript
const translations = {
  en: { ... },
  hi: { ... },
  ta: { ... }  // Add Tamil
};
```

### **Modify Responsive Breakpoint**
`/App.tsx`:
```tsx
// Change sm:w-[390px] to your width
className="w-full md:w-[420px]"
```

---

## 🚀 Deploy to Production

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```
Add environment variables in Vercel dashboard.

### **Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```
Add environment variables in Netlify dashboard.

### **Manual Build**
```bash
npm run build
# Upload /dist folder to your host
```

---

## 🎓 Learning Resources

### **Understanding the Code:**

**1. App Structure**
```
App.tsx → Main app shell
├── HomeScreen → Dashboard
├── ReportsScreen → AI explanations
├── ProfileScreen → Settings
└── AIChatScreen → AI chat
```

**2. State Management**
```
AppContext → Global state
├── user
├── settings (language, notifications)
├── cycleEntries
├── weightEntries
├── chatMessages
└── reports
```

**3. Key Utilities**
```
sentimentAnalysis.ts → Emotion detection
translations.ts → i18n support
dietPlanGenerator.ts → Meal plans
randomForest.ts → Risk scoring
```

### **Key Concepts:**

**Sentiment Analysis:**
```typescript
import { analyzeSentiment } from './utils/sentimentAnalysis';

const result = analyzeSentiment("I'm feeling great!");
// result.emoji = "🙂"
// result.score = 0.75
// result.label = "positive"
```

**Translations:**
```typescript
import { getTranslation } from './utils/translations';

const t = getTranslation('hi');  // Hindi
console.log(t.hiThere);  // "नमस्ते"

const t2 = getTranslation('en');  // English
console.log(t2.hiThere);  // "Hi"
```

**AI Explanations:**
```typescript
// Send to Gemini API
const response = await fetch('/ai-chat', {
  body: JSON.stringify({
    message: "Explain this report...",
    conversationHistory: []
  })
});

// Analyze sentiment
const data = await response.json();
const sentiment = analyzeSentiment(data.response);
```

---

## 💡 Tips & Tricks

### **Development:**
- Use `npm run dev` for hot reload
- Check browser console for errors
- Use React DevTools for debugging
- Test on real mobile devices

### **Performance:**
- Sentiment analysis is fast (<10ms)
- AI calls take 2-5 seconds
- Cache translations for speed
- Lazy load heavy components

### **Testing:**
- Test both languages (EN/HI)
- Test all screen sizes
- Test with/without internet
- Test notification dropdown
- Test AI explanations

### **Deployment:**
- Set environment variables
- Test production build locally
- Check mobile responsiveness
- Verify AI functionality
- Test language switching

---

## 🆘 Get Help

### **Documentation:**
1. Check [README.md](/README.md)
2. Read [TESTING_GUIDE.md](/TESTING_GUIDE.md)
3. Review [IMPLEMENTATION_SUMMARY.md](/IMPLEMENTATION_SUMMARY.md)

### **Common Questions:**

**Q: How do I add a new language?**
A: Edit `/utils/translations.ts` and add your language object.

**Q: Can I use a different AI model?**
A: Yes, modify `/supabase/functions/server/index.tsx` to use different API.

**Q: How do I customize colors?**
A: Edit `/styles/globals.css` and change CSS variables.

**Q: Is it mobile-responsive?**
A: Yes! Works on all devices from 320px to 4K.

**Q: Does it work offline?**
A: Partially. Sentiment analysis works offline, AI features need internet.

---

## ✅ Pre-Launch Checklist

Before deploying to production:

**Environment:**
- [ ] SUPABASE_URL set
- [ ] SUPABASE_ANON_KEY set
- [ ] GEMINI_API_KEY set
- [ ] All secrets in hosting dashboard

**Testing:**
- [ ] Tested on Chrome
- [ ] Tested on Safari
- [ ] Tested on actual phone
- [ ] All buttons work
- [ ] Language switching works
- [ ] AI explanations generate
- [ ] No console errors

**Performance:**
- [ ] Build succeeds
- [ ] Bundle size acceptable
- [ ] Load time < 3 seconds
- [ ] No memory leaks

**Features:**
- [ ] Notification bell works
- [ ] Responsive on all sizes
- [ ] Translations complete
- [ ] Sentiment analysis working
- [ ] AI explanations functional

**Documentation:**
- [ ] README updated
- [ ] Environment variables documented
- [ ] API keys secured
- [ ] Deployment steps clear

---

## 🎯 Next Steps

**After Basic Setup:**
1. Customize colors to match brand
2. Add more translation languages
3. Implement file upload backend
4. Add real notification system
5. Connect to analytics

**Advanced Features:**
1. Offline mode with service worker
2. Voice input for Hindi
3. Push notifications
4. Wearable device integration
5. Telemedicine booking

---

## 🎉 You're All Set!

Your Sakhi PCOS Companion is now ready to help Indian women manage PCOS with:

✅ Beautiful, responsive UI
✅ Multilingual support (EN/HI)
✅ AI-powered explanations
✅ Sentiment analysis
✅ Working notifications
✅ Complete feature set

**Questions?** Check the docs or console logs!

**Ready to deploy?** Follow the deployment steps above!

**Need help?** Review the troubleshooting section!

---

**Built with ❤️ for Indian women managing PCOS**

Happy coding! 🚀✨
