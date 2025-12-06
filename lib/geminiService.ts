// Helper function to call Gemini API directly
async function callGeminiAPI(prompt: string, model: string = "gemini-2.5-flash"): Promise<string> {
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

// Helper function to call Gemini with system and user prompts
export async function callGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    return await callGeminiAPI(fullPrompt, "gemini-2.5-flash");
  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw new Error(
      `Failed to call Gemini: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
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
  if (!text || text.trim().length === 0) {
    return {
      events: [],
      labs: [],
      vitals: [],
      symptoms: [],
      medications: [],
      lifestyle: [],
    };
  }

  const systemPrompt = `You are a structured medical records intelligence engine. Your role is to convert unstructured health text into a chronological, clinically meaningful timeline. Prioritize cardiology-related information including symptoms (chest pain, SOB, palpitations), vitals (HR, BP), labs (lipids, HbA1c, troponin, BNP), medications, lifestyle patterns, and risk factors.

Rules:
- Do not hallucinate. If data is not present, state 'Not mentioned'.
- Maintain strict chronology.
- Extract medications with dose and frequency when available.
- Identify lifestyle indicators: exercise, sleep, stress, smoking, alcohol.
- Extract cardiology-specific red flags explicitly.`;

  const userPrompt = `Analyze the following health text and output a structured Patient Timeline JSON. Input: ${text}

Return JSON only:
{
  "events": [],
  "labs": [],
  "vitals": [],
  "symptoms": [],
  "medications": [],
  "lifestyle": []
}`;

  try {
    const responseText = await callGemini(systemPrompt, userPrompt);
    const parsed = JSON.parse(responseText);
    return parsed;
  } catch (error) {
    console.error("Error generating patient timeline:", error);
    // Return empty structure on failure
    return {
      events: [],
      labs: [],
      vitals: [],
      symptoms: [],
      medications: [],
      lifestyle: [],
    };
  }
}

// Generate doctor snapshot with structured output
export async function generateDoctorSnapshot(
  text: string
): Promise<{
  problems: Array<any>;
  medications: Array<any>;
  labs_summary: Array<any>;
  key_events: Array<any>;
  visit_prep: string;
}> {
  if (!text || text.trim().length === 0) {
    return {
      problems: [],
      medications: [],
      labs_summary: [],
      key_events: [],
      visit_prep: "",
    };
  }

  const systemPrompt = `You generate a clinically concise doctor-ready snapshot from unstructured health text. Focus first on cardiology problems. Never speculate beyond the data.

Rules:
- Active problem list: Include only conditions supported directly by the text.
- Medications: Include dose/frequency if mentioned; otherwise say 'unknown'.
- Labs: Extract LDL, HDL, triglycerides, HbA1c, troponin, BNP, kidney markers.
- Key Events: Hospitalizations, ER visits, imaging, surgeries.
- Visit Preparation: Summarize 3–5 high-impact points for the doctor.`;

  const userPrompt = `Create a structured Doctor Snapshot JSON from this text: ${text}

Output JSON:
{
  "problems": [],
  "medications": [],
  "labs_summary": [],
  "key_events": [],
  "visit_prep": ""
}`;

  try {
    const responseText = await callGemini(systemPrompt, userPrompt);
    const parsed = JSON.parse(responseText);
    return parsed;
  } catch (error) {
    console.error("Error generating doctor snapshot:", error);
    // Return empty structure on failure
    return {
      problems: [],
      medications: [],
      labs_summary: [],
      key_events: [],
      visit_prep: "",
    };
  }
}

// Generate cardiology insights
export async function generateCardiologyInsights(
  text: string
): Promise<{
  riskProfile: Record<string, any>;
  possibleConditions: Array<any>;
  redFlags: Array<any>;
  advice: Array<any>;
  questionsForDoctor: string[];
}> {
  if (!text || text.trim().length === 0) {
    return {
      riskProfile: {},
      possibleConditions: [],
      redFlags: [],
      advice: [],
      questionsForDoctor: [],
    };
  }

  const systemPrompt = `You are a cardiology intelligence model. Extract all cardiology-specific risk factors, symptoms, and possible conditions without hallucination. Categorize risks into: High, Moderate, Low, or Not Mentioned.

Rules:
- Identify red flag symptoms immediately.
- Identify metabolic risk factors (diabetes, obesity, lipids).
- Identify BP and HR abnormalities.
- Produce evidence-based advice.
- Suggest focused questions for a cardiologist.`;

  const userPrompt = `Generate structured cardiology insights JSONObject from this health text: ${text}

Output JSON:
{
  "riskProfile": {},
  "possibleConditions": [],
  "redFlags": [],
  "advice": [],
  "questionsForDoctor": []
}`;

  try {
    const responseText = await callGemini(systemPrompt, userPrompt);
    const parsed = JSON.parse(responseText);
    return parsed;
  } catch (error) {
    console.error("Error generating cardiology insights:", error);
    // Return empty structure on failure
    return {
      riskProfile: {},
      possibleConditions: [],
      redFlags: [],
      advice: [],
      questionsForDoctor: [],
    };
  }
}

// Run general chat with conversation history
export async function runGeneralChat(
  history: Array<{ role: "user" | "assistant"; content: string }>,
  userMsg: string,
  context?: string
): Promise<string> {
  if (!userMsg || userMsg.trim().length === 0) {
    return "I'd be happy to help! Could you please provide more details in your question?";
  }

  const systemPrompt = `You are a specialized cardiology health assistant. Your role is to help patients understand their cardiovascular health data, interpret lab results, assess heart risks, and prepare for doctor visits.

CRITICAL RULES:
1. Focus on CARDIOLOGY and cardiovascular health - this is your specialty.
2. Use ONLY the patient health data provided in context - do not make up or infer data that isn't there.
3. Provide clear, empathetic, and actionable responses.
4. If information is not available in the data, say so clearly.
5. Always emphasize consulting with a cardiologist for medical decisions.

SAFETY DISCLAIMER: This conversation is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals, especially cardiologists, for medical decisions. This AI assistant should not replace professional medical evaluation.`;

  let userPrompt = "";

  if (context) {
    userPrompt += `PATIENT HEALTH DATA CONTEXT:\n${context}\n\n`;
  }

  if (history && history.length > 0) {
    userPrompt += "CONVERSATION HISTORY:\n";
    history.slice(-6).forEach((msg) => {
      userPrompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    });
    userPrompt += "\n";
  }

  userPrompt += `CURRENT USER QUESTION: ${userMsg}\n\n`;
  userPrompt += `INSTRUCTIONS:
- Respond naturally and helpfully to the user's question
- Focus on cardiology and cardiovascular health
- Reference the health data context if provided
- If asked about labs, interpret them in the context of cardiovascular health
- If asked about risks, reference the risk profile and red flags
- If asked about visit preparation, use the visit prep summary and active problems
- Be conversational but professional
- If information is not available, say so clearly
- Always emphasize consulting with a cardiologist for medical decisions`;

  try {
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    return await callGeminiAPI(fullPrompt, "gemini-2.5-flash");
  } catch (error) {
    console.error("Error in general chat:", error);
    return "I apologize, but I'm having trouble processing your request right now. Please try again later or consult with your healthcare provider for immediate medical questions.";
  }
}

