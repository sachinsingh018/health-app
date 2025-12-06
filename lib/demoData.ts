// Demo data for testing UI during development
// Enable with USE_DEMO_MODE=true environment variable

export const demoPatientTimeline = {
    events: [
        {
            date: "2024-01-15",
            title: "Hypertension Diagnosis",
            description: "Diagnosed with stage 2 hypertension during annual checkup",
            category: "diagnosis",
        },
        {
            date: "2024-02-20",
            title: "Cardiology Consultation",
            description: "Initial consultation with cardiologist for elevated BP",
            category: "consultation",
        },
        {
            date: "2024-03-10",
            title: "Echocardiogram",
            description: "Echocardiogram performed to assess heart function",
            category: "procedure",
        },
    ],
    labs: [
        {
            date: "2024-01-15",
            name: "LDL Cholesterol",
            value: "145",
            unit: "mg/dL",
            status: "abnormal",
        },
        {
            date: "2024-01-15",
            name: "HDL Cholesterol",
            value: "38",
            unit: "mg/dL",
            status: "abnormal",
        },
        {
            date: "2024-01-15",
            name: "HbA1c",
            value: "6.2",
            unit: "%",
            status: "abnormal",
        },
        {
            date: "2024-03-10",
            name: "Troponin",
            value: "0.01",
            unit: "ng/mL",
            status: "normal",
        },
        {
            date: "2024-03-10",
            name: "BNP",
            value: "85",
            unit: "pg/mL",
            status: "normal",
        },
    ],
    vitals: [
        {
            date: "2024-01-15",
            type: "blood_pressure",
            value: "148/92",
            unit: "mmHg",
        },
        {
            date: "2024-02-20",
            type: "blood_pressure",
            value: "142/88",
            unit: "mmHg",
        },
        {
            date: "2024-03-10",
            type: "blood_pressure",
            value: "138/85",
            unit: "mmHg",
        },
        {
            date: "2024-01-15",
            type: "heart_rate",
            value: "78",
            unit: "bpm",
        },
        {
            date: "2024-02-20",
            type: "heart_rate",
            value: "82",
            unit: "bpm",
        },
    ],
    symptoms: [
        {
            date: "2024-01-10",
            symptom: "Chest pain",
            severity: "mild",
            notes: "Occasional chest discomfort, especially during exercise",
        },
        {
            date: "2024-02-05",
            symptom: "Shortness of breath",
            severity: "moderate",
            notes: "Experienced during climbing stairs",
        },
        {
            date: "2024-02-15",
            symptom: "Palpitations",
            severity: "mild",
            notes: "Noticed irregular heartbeat occasionally",
        },
    ],
    medications: [
        {
            name: "Lisinopril",
            dosage: "10mg",
            startDate: "2024-01-20",
            status: "current",
        },
        {
            name: "Atorvastatin",
            dosage: "20mg",
            startDate: "2024-01-20",
            status: "current",
        },
        {
            name: "Metformin",
            dosage: "500mg",
            startDate: "2024-02-01",
            status: "current",
        },
    ],
    lifestyle: [
        {
            date: "2024-01-15",
            type: "exercise" as const,
            value: "Sedentary lifestyle, minimal physical activity",
            notes: "Works desk job, no regular exercise routine",
        },
        {
            date: "2024-01-15",
            type: "diet" as const,
            value: "High sodium diet",
            notes: "Frequent fast food consumption",
        },
        {
            date: "2024-01-15",
            type: "stress" as const,
            value: "High stress levels",
            notes: "Work-related stress, long hours",
        },
    ],
};

export const demoDoctorSnapshot = {
    // Using old structure for compatibility with existing UI components
    activeProblems: [
        {
            problem: "Hypertension (Stage 2)",
            category: "cardiology",
            status: "active",
            notes: "BP readings consistently elevated, responding to medication",
        },
        {
            problem: "Hyperlipidemia",
            category: "cardiology",
            status: "active",
            notes: "Elevated LDL, low HDL",
        },
        {
            problem: "Prediabetes",
            category: "other",
            status: "active",
            notes: "HbA1c 6.2%, borderline",
        },
    ],
    medications: [
        {
            name: "Lisinopril",
            dosage: "10mg once daily",
            frequency: "Daily",
            indication: "Hypertension management",
        },
        {
            name: "Atorvastatin",
            dosage: "20mg once daily",
            frequency: "Daily",
            indication: "Cholesterol management",
        },
        {
            name: "Metformin",
            dosage: "500mg twice daily",
            frequency: "Twice daily",
            indication: "Blood sugar control",
        },
    ],
    keyLabs: {
        LDL: {
            value: "145",
            unit: "mg/dL",
            date: "2024-01-15",
            status: "abnormal",
        },
        HDL: {
            value: "38",
            unit: "mg/dL",
            date: "2024-01-15",
            status: "abnormal",
        },
        HbA1c: {
            value: "6.2",
            unit: "%",
            date: "2024-01-15",
            status: "abnormal",
        },
        Troponin: {
            value: "0.01",
            unit: "ng/mL",
            date: "2024-03-10",
            status: "normal",
        },
        BNP: {
            value: "85",
            unit: "pg/mL",
            date: "2024-03-10",
            status: "normal",
        },
    },
    keyEvents: [
        {
            date: "2024-02-20",
            type: "consultation" as const,
            description: "Initial cardiology consultation for hypertension management",
        },
        {
            date: "2024-03-10",
            type: "procedure" as const,
            description: "Echocardiogram to assess cardiac structure and function",
        },
    ],
    visitPrep: [
        "Patient presents with stage 2 hypertension, elevated cholesterol (LDL 145, HDL 38), and prediabetes (HbA1c 6.2%)",
        "Currently on Lisinopril 10mg, Atorvastatin 20mg, and Metformin 500mg BID",
        "Reports occasional chest discomfort and SOB with exertion. Echocardiogram scheduled. Discuss medication adherence, lifestyle modifications (diet, exercise), and follow-up plan.",
    ],
};

export const demoCardiologyInsights = {
    riskProfile: {
        hypertension: "High",
        tachycardiaBradycardia: "Low",
        cholesterolIssues: "High",
        diabetes: "Moderate",
        obesity: "Not Mentioned",
        smoking: "Not Mentioned",
        familyHistory: "Not Mentioned",
    },
    possibleConditions: [
        {
            condition: "Hypertensive Heart Disease",
            confidence: "medium" as const,
            evidence: "Persistent elevated BP readings, chest discomfort with exertion",
        },
        {
            condition: "Dyslipidemia",
            confidence: "high" as const,
            evidence: "Elevated LDL (145 mg/dL), low HDL (38 mg/dL)",
        },
    ],
    redFlags: [
        {
            flag: "Chest Pain with Exertion",
            severity: "high" as const,
            description: "Chest discomfort during physical activity may indicate cardiac ischemia",
            action: "Urgent cardiology evaluation recommended, consider stress test",
        },
        {
            flag: "Elevated LDL Cholesterol",
            severity: "medium" as const,
            description: "LDL of 145 mg/dL significantly above target (<100 mg/dL)",
            action: "Continue statin therapy, consider dose adjustment, dietary counseling",
        },
        {
            flag: "Shortness of Breath",
            severity: "medium" as const,
            description: "SOB with minimal exertion (climbing stairs)",
            action: "Monitor closely, consider further cardiac workup if persists",
        },
    ],
    advice: [
        {
            category: "Diet",
            recommendation: "Reduce sodium intake to <2g/day, adopt DASH diet principles, limit processed foods",
        },
        {
            category: "Exercise",
            recommendation: "Start with 30 minutes of moderate exercise 5 days/week (walking, swimming), gradually increase intensity",
        },
        {
            category: "Medication Adherence",
            recommendation: "Take all medications as prescribed, monitor BP at home, report any side effects",
        },
        {
            category: "Stress Management",
            recommendation: "Practice relaxation techniques, consider mindfulness or meditation, ensure adequate sleep",
        },
    ],
    questionsForDoctor: [
        "What is my target blood pressure goal, and how often should I check it at home?",
        "Should I be concerned about my chest discomfort during exercise?",
        "Are my current medications the best option, or should we consider alternatives?",
        "What lifestyle changes will have the biggest impact on my heart health?",
        "When should I schedule my next follow-up appointment?",
    ],
};

// Combined demo data object
export const demoHealthData = {
    timeline: demoPatientTimeline,
    snapshot: demoDoctorSnapshot,
    cardiology: demoCardiologyInsights,
};

