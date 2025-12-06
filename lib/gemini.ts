// Helper function to call Gemini API directly
async function callGeminiAPI(prompt: string, model: string = "gemini-2.5-pro"): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Generate patient timeline with detailed structure
export async function generatePatientTimeline(
  text: string
): Promise<{
  events: Array<{
    date: string;
    title: string;
    description: string;
    category: string;
  }>;
  labs: Array<{
    date: string;
    name: string;
    value: string;
    unit?: string;
    status?: string;
  }>;
  vitals: Array<{
    date: string;
    type: string;
    value: string;
    unit?: string;
  }>;
  symptoms: Array<{
    date: string;
    symptom: string;
    severity?: string;
    notes?: string;
  }>;
  medications: Array<{
    name: string;
    dosage?: string;
    startDate?: string;
    endDate?: string;
    status: string;
  }>;
  lifestyle: Array<{
    date: string;
    type: "exercise" | "sleep" | "stress" | "diet";
    value: string;
    notes?: string;
  }>;
}> {
  try {
    const prompt = `You are analyzing a health document. Extract ALL information ONLY from the provided text below. Do NOT use any external knowledge, medical databases, or general medical information. Do NOT make up, infer, or assume any data that isn't explicitly stated in the text.

CRITICAL: All output must be derived exclusively from the user-provided text. Do not reference external data sources.

Health Document Text:
${text}

Return a JSON object with the following structure. Extract only information that is explicitly stated in the text:
{
  "events": [
    {
      "date": "YYYY-MM-DD or approximate date or 'not mentioned'",
      "title": "Event title (e.g., diagnosis name, procedure name)",
      "description": "Event description",
      "category": "diagnosis|procedure|hospitalization|consultation|other"
    }
  ],
  "labs": [
    {
      "date": "YYYY-MM-DD or approximate date or 'not mentioned'",
      "name": "Lab test name",
      "value": "Result value or 'not mentioned'",
      "unit": "Unit if mentioned",
      "status": "normal|abnormal|not mentioned"
    }
  ],
  "vitals": [
    {
      "date": "YYYY-MM-DD or approximate date or 'not mentioned'",
      "type": "blood_pressure|heart_rate|temperature|weight|other",
      "value": "Measurement value or 'not mentioned'",
      "unit": "Unit if mentioned"
    }
  ],
  "symptoms": [
    {
      "date": "YYYY-MM-DD or approximate date or 'not mentioned'",
      "symptom": "Symptom name",
      "severity": "mild|moderate|severe|not mentioned",
      "notes": "Additional notes if mentioned"
    }
  ],
  "medications": [
    {
      "name": "Medication name",
      "dosage": "Dosage if mentioned, otherwise 'not mentioned'",
      "startDate": "Start date if mentioned, otherwise 'not mentioned'",
      "endDate": "End date if mentioned, otherwise 'not mentioned'",
      "status": "current|past|not mentioned"
    }
  ],
  "lifestyle": [
    {
      "date": "YYYY-MM-DD or approximate date or 'not mentioned'",
      "type": "exercise|sleep|stress|diet",
      "value": "Description or value or 'not mentioned'",
      "notes": "Additional notes if mentioned"
    }
  ]
}

REQUIREMENTS:
1. EVENTS: Must include a chronological list of all events. Specifically extract:
   - All diagnoses mentioned (use category "diagnosis")
   - Procedures, hospitalizations, consultations
   - Order events chronologically by date

2. SYMPTOMS: Extract all symptoms mentioned, with special attention to cardiology-relevant markers:
   - Chest pain (if mentioned)
   - Shortness of breath (if mentioned)
   - Palpitations (if mentioned)
   - Any other symptoms described
   - If a cardiology symptom is NOT mentioned, do not include it (empty array is fine)

3. MEDICATIONS: Extract complete medication history including:
   - All medications mentioned
   - Dosages if provided
   - Start/end dates if provided
   - Current vs past status

4. LIFESTYLE: Extract lifestyle indicators if mentioned:
   - Exercise patterns/activities
   - Sleep patterns/issues
   - Stress levels/indicators
   - Diet information
   - If not mentioned, return empty array

5. VITALS: Extract all vital signs, with special attention to:
   - Blood pressure readings (high BP if mentioned)
   - Heart rate patterns (HR patterns if mentioned)
   - Temperature, weight, other vitals
   - If not mentioned, return empty array

6. LABS: Extract all lab results mentioned

IMPORTANT RULES:
- If something is NOT mentioned in the text, use "not mentioned" as the value, OR return an empty array for that category
- For cardiology markers: Only include chest pain, shortness of breath, palpitations, high BP, or HR patterns if they are EXPLICITLY mentioned in the text
- Events must be in chronological order (earliest to latest)
- All dates should be extracted from the text or marked as "not mentioned"
- Do not invent, infer, or assume any data that isn't explicitly in the text
- Return empty arrays [] for categories with no data, rather than omitting them`;

    const responseText = await callGeminiAPI(prompt, "gemini-2.5-pro");

    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Return empty structure if parsing fails
    return {
      events: [],
      labs: [],
      vitals: [],
      symptoms: [],
      medications: [],
      lifestyle: [],
    };
  } catch (error) {
    console.error("Error generating patient timeline with Gemini:", error);
    throw new Error("Failed to generate patient timeline with Gemini");
  }
}

// Generate doctor snapshot with structured output
export async function generateDoctorSnapshot(
  text: string
): Promise<{
  activeProblems: Array<{
    problem: string;
    category: string;
    status: string;
    notes?: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    frequency?: string;
    indication?: string;
  }>;
  keyLabs: {
    LDL?: { value: string; unit: string; date?: string; status: string };
    HDL?: { value: string; unit: string; date?: string; status: string };
    HbA1c?: { value: string; unit: string; date?: string; status: string };
    Troponin?: { value: string; unit: string; date?: string; status: string };
    BNP?: { value: string; unit: string; date?: string; status: string };
  };
  keyEvents: Array<{
    date: string;
    type: "procedure" | "hospitalization" | "consultation" | "other";
    description: string;
  }>;
  visitPrep: string[];
}> {
  try {
    const prompt = `You are analyzing a health document to create a doctor snapshot. Extract ALL information ONLY from the provided text below. Do NOT use any external knowledge, medical databases, or general medical information. Do NOT make up, infer, or assume any data that isn't explicitly stated in the text.

CRITICAL: All output must be derived exclusively from the user-provided text. Do not reference external data sources.

Health Document Text:
${text}

Return a JSON object with the following EXACT structure:
{
  "activeProblems": [
    {
      "problem": "Problem name",
      "category": "cardiology|other",
      "status": "active|resolved|chronic",
      "notes": "Additional notes if mentioned"
    }
  ],
  "medications": [
    {
      "name": "Medication name",
      "dosage": "Dosage and strength (extract from text, use 'not mentioned' if absent)",
      "frequency": "Frequency if mentioned",
      "indication": "Reason for medication if mentioned"
    }
  ],
  "keyLabs": {
    "LDL": {
      "value": "Value if mentioned, otherwise 'not mentioned'",
      "unit": "mg/dL or unit if mentioned",
      "date": "Date if mentioned, otherwise 'not mentioned'",
      "status": "normal|abnormal|not mentioned"
    },
    "HDL": {
      "value": "Value if mentioned, otherwise 'not mentioned'",
      "unit": "mg/dL or unit if mentioned",
      "date": "Date if mentioned, otherwise 'not mentioned'",
      "status": "normal|abnormal|not mentioned"
    },
    "HbA1c": {
      "value": "Value if mentioned, otherwise 'not mentioned'",
      "unit": "% or unit if mentioned",
      "date": "Date if mentioned, otherwise 'not mentioned'",
      "status": "normal|abnormal|not mentioned"
    },
    "Troponin": {
      "value": "Value if mentioned, otherwise 'not mentioned'",
      "unit": "ng/mL or unit if mentioned",
      "date": "Date if mentioned, otherwise 'not mentioned'",
      "status": "normal|abnormal|not mentioned"
    },
    "BNP": {
      "value": "Value if mentioned, otherwise 'not mentioned'",
      "unit": "pg/mL or unit if mentioned",
      "date": "Date if mentioned, otherwise 'not mentioned'",
      "status": "normal|abnormal|not mentioned"
    }
  },
  "keyEvents": [
    {
      "date": "YYYY-MM-DD or approximate date or 'not mentioned'",
      "type": "procedure|hospitalization|consultation|other",
      "description": "Event description"
    }
  ],
  "visitPrep": [
    "First bullet point summary",
    "Second bullet point summary",
    "Third bullet point summary"
  ]
}

REQUIREMENTS:

1. ACTIVE PROBLEM LIST:
   - Extract all active health problems mentioned in the text
   - CRITICAL: List cardiology problems FIRST, then other problems
   - Include problem name, category (cardiology or other), status, and notes if available
   - If no problems mentioned, return empty array []

2. MEDICATIONS WITH DOSES:
   - Extract ALL medications mentioned in the text
   - MUST include dosage information if mentioned (e.g., "10mg", "50mg twice daily")
   - If dosage is not mentioned, use "not mentioned" for dosage field
   - Include frequency and indication if available
   - Extract medication names exactly as stated in text

3. KEY LABS:
   - Extract ONLY these specific labs if mentioned: LDL, HDL, HbA1c, Troponin, BNP
   - For each lab, include: value, unit, date, and status (normal/abnormal/not mentioned)
   - If a lab is NOT mentioned in the text, set value to "not mentioned" and status to "not mentioned"
   - Do NOT include other labs - only these 5 key labs

4. KEY EVENTS:
   - Extract procedures and hospitalizations mentioned in the text
   - Focus on: procedures, hospitalizations, and significant consultations
   - Include date, type (procedure|hospitalization|consultation|other), and description
   - If no key events mentioned, return empty array []

5. VISIT PREP SUMMARY:
   - MUST be exactly 3 bullet points
   - Each bullet point should summarize the most important information for a doctor visit
   - Focus on: active problems, recent changes, medications, key concerns
   - Keep each bullet point concise and actionable
   - Extract information only from the provided text

IMPORTANT RULES:
- Active problems MUST be ordered: cardiology problems first, then others
- Medications MUST include dosage extracted from text (use "not mentioned" if absent)
- Key labs: Only include LDL, HDL, HbA1c, Troponin, BNP - use "not mentioned" if not in text
- Key events: Focus on procedures and hospitalizations
- Visit prep: Exactly 3 bullet points, no more, no less
- All data must come from the provided text - do not invent or infer
- Use "not mentioned" for missing values rather than omitting fields`;

    const responseText = await callGeminiAPI(prompt, "gemini-2.5-pro");

    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Return empty structure if parsing fails
    return {
      activeProblems: [],
      medications: [],
      keyLabs: {},
      keyEvents: [],
      visitPrep: ["Unable to generate visit prep summary"],
    };
  } catch (error) {
    console.error("Error generating doctor snapshot with Gemini:", error);
    throw new Error("Failed to generate doctor snapshot with Gemini");
  }
}

// Generate cardiology insights
export async function generateCardiologyInsights(
  text: string
): Promise<{
  riskProfile: {
    hypertension: string;
    tachycardiaBradycardia: string;
    cholesterolIssues: string;
    diabetes: string;
    obesity: string;
    smoking: string;
    familyHistory: string;
  };
  possibleConditions: Array<{
    condition: string;
    confidence: "low" | "medium" | "high";
    evidence: string;
  }>;
  redFlags: Array<{
    flag: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    action: string;
  }>;
  advice: Array<{
    category: string;
    recommendation: string;
  }>;
  questionsForDoctor: string[];
}> {
  try {
    const prompt = `You are analyzing a health document for cardiology insights. Extract ALL information ONLY from the provided text below. Do NOT use any external knowledge, medical databases, or general medical information. Do NOT make up, infer, or assume any data that isn't explicitly stated in the text.

CRITICAL: All output must be derived exclusively from the user-provided text. Do not reference external data sources.

Health Document Text:
${text}

Return a JSON object with the following EXACT structure:
{
  "riskProfile": {
    "hypertension": "present|not mentioned|absent",
    "tachycardiaBradycardia": "present|not mentioned|absent",
    "cholesterolIssues": "present|not mentioned|absent",
    "diabetes": "present|not mentioned|absent",
    "obesity": "present|not mentioned|absent",
    "smoking": "present|not mentioned|absent",
    "familyHistory": "present|not mentioned|absent"
  },
  "possibleConditions": [
    {
      "condition": "Condition name if indicated in text",
      "confidence": "low|medium|high",
      "evidence": "Evidence from text supporting this condition"
    }
  ],
  "redFlags": [
    {
      "flag": "Red flag description",
      "severity": "low|medium|high|critical",
      "description": "What this flag means based on text",
      "action": "Recommended action based on text"
    }
  ],
  "advice": [
    {
      "category": "lifestyle category (e.g., exercise, diet, stress management)",
      "recommendation": "Specific recommendation based on text"
    }
  ],
  "questionsForDoctor": [
    "Question 1 based on findings in text",
    "Question 2 based on findings in text",
    "Question 3 based on findings in text"
  ]
}

REQUIREMENTS:

1. RISK FACTORS SUMMARY:
   Extract information about these specific risk factors from the text:
   - hypertension: Check for high blood pressure, hypertension, elevated BP mentioned
   - tachycardiaBradycardia: Check for fast/slow heart rate, tachycardia, bradycardia mentioned
   - cholesterolIssues: Check for high cholesterol, LDL, HDL, lipid issues mentioned
   - diabetes: Check for diabetes, high blood sugar, HbA1c, glucose issues mentioned
   - obesity: Check for obesity, BMI, weight issues mentioned
   - smoking: Check for smoking, tobacco use mentioned
   - familyHistory: Check for family history of cardiac conditions mentioned
   For each factor, use: "present" if mentioned in text, "not mentioned" if not found, "absent" if explicitly stated as not present

2. PROBABLE CARDIAC CONDITIONS:
   - Only include conditions if there is evidence in the text suggesting them
   - Include condition name, confidence level (low/medium/high), and evidence from text
   - If no conditions are indicated, return empty array []
   - Do NOT invent conditions - only include if text suggests them

3. RED FLAGS (Decision-tree style):
   - Identify concerning findings from the text that require attention
   - Each red flag should have: flag description, severity (low/medium/high/critical), description, and recommended action
   - Examples: chest pain, abnormal EKG, high troponin, severe hypertension, etc.
   - Base severity and actions on what's mentioned in the text
   - If no red flags found, return empty array []

4. LIFESTYLE RECOMMENDATIONS:
   - Provide lifestyle advice based on information in the text
   - Categories: exercise, diet, stress management, sleep, medication adherence, etc.
   - Each recommendation should be based on findings in the text
   - If no lifestyle recommendations can be derived, return empty array []

5. QUESTIONS FOR DOCTOR:
   - Generate 3-5 questions the patient should ask their cardiologist
   - Questions should be based on findings, concerns, or gaps in information from the text
   - Make questions specific and actionable
   - If no questions can be generated, return empty array []

IMPORTANT RULES:
- All information must come from the provided text - do not use general medical knowledge
- Use "not mentioned" for risk factors not found in text
- Only include possible conditions if text provides evidence
- Red flags must be based on concerning findings in the text
- Lifestyle advice must be relevant to information in the text
- Questions should address specific concerns or findings from the text
- Do not invent, infer, or assume data that isn't explicitly in the text`;

    const responseText = await callGeminiAPI(prompt, "gemini-2.5-pro");

    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Return empty structure if parsing fails
    return {
      riskProfile: {
        hypertension: "not mentioned",
        tachycardiaBradycardia: "not mentioned",
        cholesterolIssues: "not mentioned",
        diabetes: "not mentioned",
        obesity: "not mentioned",
        smoking: "not mentioned",
        familyHistory: "not mentioned",
      },
      possibleConditions: [],
      redFlags: [],
      advice: [],
      questionsForDoctor: [],
    };
  } catch (error) {
    console.error("Error generating cardiology insights with Gemini:", error);
    throw new Error("Failed to generate cardiology insights with Gemini");
  }
}

