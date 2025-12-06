# Testing Guide for Health Intelligence App

## Quick Start: Testing with Demo Mode

The easiest way to test the app is using **Demo Mode**, which loads pre-configured sample data.

### Enable Demo Mode

1. Add to your `.env.local` file:
```env
USE_DEMO_MODE=true
GEMINI_API_KEY=AIzaSyAZDaSCCNBlvn4bqjScyADz497PZPl0F10
```

2. Restart your dev server:
```bash
npm run dev
```

3. Open the app - demo data will automatically load!

---

## Complete Testing Flow

### Method 1: Demo Mode (Fastest - No API calls)

**Steps:**
1. ✅ Enable demo mode (see above)
2. ✅ Visit `http://localhost:3000`
3. ✅ Navigate through all pages - data is already loaded
4. ✅ Test all features without uploading anything

**What to Test:**
- ✅ Home page navigation
- ✅ Timeline page (charts, events, labs, vitals)
- ✅ Doctor Snapshot page (PDF download)
- ✅ Cardiology Insights page (risk profiles, red flags, advice)
- ✅ AI Assistant chat

---

### Method 2: Real Document Upload (Full Flow)

**Step 1: Start the App**
```bash
# Make sure demo mode is OFF (remove USE_DEMO_MODE or set to false)
npm run dev
```

**Step 2: Prepare Test Document**

Create a sample health document (or use the sample below):

**Sample Health Document Text** (save as `test-health.txt`):
```
PATIENT HEALTH SUMMARY

Patient: John Doe, Age 45, Male

MEDICAL HISTORY:
- Diagnosed with hypertension in January 2024
- Family history of heart disease (father had heart attack at 60)
- Current smoker, 1 pack per day for 20 years
- Sedentary lifestyle, minimal exercise

CURRENT MEDICATIONS:
- Lisinopril 10mg once daily (started January 2024)
- Atorvastatin 20mg once daily (started January 2024)
- Aspirin 81mg once daily

LAB RESULTS (January 15, 2024):
- Total Cholesterol: 220 mg/dL (High)
- LDL: 145 mg/dL (High)
- HDL: 38 mg/dL (Low)
- Triglycerides: 180 mg/dL (High)
- HbA1c: 6.2% (Prediabetes)
- Blood Pressure: 148/92 mmHg (Stage 2 Hypertension)
- Heart Rate: 78 bpm (Normal)

SYMPTOMS:
- Occasional chest discomfort during exercise (noted January 10, 2024)
- Shortness of breath when climbing stairs (noted February 5, 2024)
- Palpitations occasionally (noted February 15, 2024)

RECENT EVENTS:
- January 15, 2024: Annual physical exam, hypertension diagnosed
- February 20, 2024: Cardiology consultation
- March 10, 2024: Echocardiogram performed - results normal
- March 10, 2024: Troponin: 0.01 ng/mL (Normal), BNP: 85 pg/mL (Normal)

LIFESTYLE:
- Exercise: Sedentary, no regular exercise routine
- Diet: High sodium, frequent fast food
- Stress: High work-related stress
- Sleep: 6-7 hours per night
```

**Step 3: Test Upload Flow**

1. **Go to Upload Page** (`/upload`)
   - ✅ Click "Upload" or drag and drop the test document
   - ✅ Wait for text extraction
   - ✅ Review extracted text preview
   - ✅ Click "Analyze Health Data"
   - ✅ Wait for AI analysis (30-60 seconds)

2. **Verify Redirect**
   - ✅ Should automatically redirect to `/timeline` after analysis

**Step 4: Test Timeline Page** (`/timeline`)
   - ✅ Check that events are displayed chronologically
   - ✅ Verify lab results show with charts (if numeric values)
   - ✅ Check vitals are displayed
   - ✅ Verify symptoms are listed
   - ✅ Check medications are shown
   - ✅ Test navigation buttons to other pages

**Step 5: Test Doctor Snapshot** (`/doctor`)
   - ✅ Verify active problems list
   - ✅ Check medications with dosages
   - ✅ Verify key labs display
   - ✅ Check visit prep summary
   - ✅ Test "Download as PDF" button

**Step 6: Test Cardiology Insights** (`/cardiology`)
   - ✅ Check risk profile gauges (should show High/Moderate/Low)
   - ✅ Verify possible conditions listed
   - ✅ Check red flags section (should have warnings)
   - ✅ Review lifestyle recommendations
   - ✅ Expand/collapse questions for doctor

**Step 7: Test AI Assistant** (`/assistant`)
   - ✅ Try quick actions:
     - "Interpret my labs"
     - "Summarize my heart risks"
     - "Prepare my next visit"
     - "Explain my chest pain"
   - ✅ Type custom questions:
     - "What do my cholesterol numbers mean?"
     - "Should I be worried about my blood pressure?"
     - "What lifestyle changes should I make?"
   - ✅ Verify responses are relevant and helpful

**Step 8: Test Navigation**
   - ✅ Use floating assistant button (bottom right)
   - ✅ Test navigation menu at top
   - ✅ Verify active page highlighting
   - ✅ Test all page links

---

## Testing Checklist

### Home Page (`/`)
- [ ] Hero section displays correctly
- [ ] All 5 quick link cards show icons (not emojis)
- [ ] Cards are clickable and navigate correctly
- [ ] Hover effects work on cards

### Upload Page (`/upload`)
- [ ] Drag and drop works
- [ ] File selection works
- [ ] Text extraction works for PDF/TXT/DOCX
- [ ] Manual text input works
- [ ] Analysis button triggers API call
- [ ] Loading states display correctly
- [ ] Error handling works (try invalid file)

### Timeline Page (`/timeline`)
- [ ] Events display chronologically
- [ ] Lab charts render (if numeric data)
- [ ] Vitals display correctly
- [ ] Symptoms show with severity
- [ ] Medications list correctly
- [ ] Navigation buttons work
- [ ] Empty state shows if no data

### Doctor Snapshot (`/doctor`)
- [ ] Active problems list displays
- [ ] Medications show with details
- [ ] Key labs display with status
- [ ] Visit prep summary shows
- [ ] PDF download works
- [ ] Doctor portrait image loads

### Cardiology Insights (`/cardiology`)
- [ ] Risk profile gauges animate
- [ ] Possible conditions show confidence badges
- [ ] Red flags display with severity
- [ ] Advice cards show recommendations
- [ ] Questions expand/collapse
- [ ] Icons display (not emojis)
- [ ] Empty state works

### AI Assistant (`/assistant`)
- [ ] Quick actions work
- [ ] Chat messages send/receive
- [ ] Loading indicator shows
- [ ] Error handling works
- [ ] Conversation history persists
- [ ] Send button works
- [ ] Enter key sends message

### General UI
- [ ] All icons use AppIcon (no emojis)
- [ ] Neon mint colors (#4EFFD2) display
- [ ] Gold accents (#D4B77D) on doctor page
- [ ] Hover effects work
- [ ] Animations are smooth
- [ ] Responsive on mobile/tablet
- [ ] Navigation menu works

---

## Sample Test Scenarios

### Scenario 1: New User Flow
1. Visit home page
2. Click "Upload"
3. Upload test document
4. Wait for analysis
5. Explore all pages
6. Chat with assistant

### Scenario 2: Returning User
1. Visit app (data should load from localStorage)
2. Navigate directly to any page
3. Verify data persists

### Scenario 3: Error Handling
1. Try uploading invalid file type
2. Try analyzing empty text
3. Disconnect internet and try chat
4. Verify error messages display

### Scenario 4: Mobile Testing
1. Open on mobile device
2. Test all pages
3. Verify responsive design
4. Test touch interactions

---

## Troubleshooting

### Issue: Demo mode not working
- Check `.env.local` has `USE_DEMO_MODE=true`
- Restart dev server
- Clear browser localStorage

### Issue: API calls failing
- Verify `GEMINI_API_KEY` is set
- Check API key is valid
- Check network tab for errors

### Issue: No data after upload
- Check browser console for errors
- Verify API response in Network tab
- Check localStorage has data

### Issue: Icons not showing
- Verify `react-icons` is installed
- Check AppIcon component imports
- Clear browser cache

---

## Performance Testing

- [ ] Page load times < 2 seconds
- [ ] Analysis completes in < 60 seconds
- [ ] Charts render smoothly
- [ ] No console errors
- [ ] No memory leaks

---

## Browser Testing

Test on:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Next Steps After Testing

1. Fix any bugs found
2. Optimize slow operations
3. Improve error messages
4. Add loading states where needed
5. Enhance mobile experience

