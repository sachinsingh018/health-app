"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { demoHealthData } from "@/lib/demoData";

interface TimelineData {
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
}

interface DoctorSnapshot {
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
}

interface CardiologyInsights {
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
}

interface HealthData {
    timeline: TimelineData | null;
    snapshot: DoctorSnapshot | null;
    cardiology: CardiologyInsights | null;
}

interface HealthDataContextType {
    healthData: HealthData;
    setHealthData: (data: HealthData) => void;
    isLoading: boolean;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export function HealthDataProvider({ children }: { children: ReactNode }) {
    const [healthData, setHealthDataState] = useState<HealthData>({
        timeline: null,
        snapshot: null,
        cardiology: null,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load from localStorage or demo mode on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Check if demo mode is enabled
            const checkDemoMode = async () => {
                try {
                    const response = await fetch("/api/demo-mode");
                    const { useDemoMode } = await response.json();

                    if (useDemoMode) {
                        console.log("DEMO MODE: Loading demo data");
                        setHealthDataState({
                            timeline: demoHealthData.timeline,
                            snapshot: demoHealthData.snapshot,
                            cardiology: demoHealthData.cardiology,
                        });
                        setIsLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error("Error checking demo mode:", error);
                }

                // Load from localStorage if not in demo mode
                const stored = localStorage.getItem("healthAnalysis");
                if (stored) {
                    try {
                        const data = JSON.parse(stored);
                        setHealthDataState({
                            timeline: data.timeline || null,
                            snapshot: data.snapshot || null,
                            cardiology: data.cardiology || null,
                        });
                    } catch (e) {
                        console.error("Error parsing stored health data:", e);
                    }
                }
                setIsLoading(false);
            };

            checkDemoMode();
        }
    }, []);

    // Save to localStorage whenever healthData changes
    useEffect(() => {
        if (typeof window !== "undefined" && !isLoading) {
            if (healthData.timeline || healthData.snapshot || healthData.cardiology) {
                localStorage.setItem("healthAnalysis", JSON.stringify(healthData));
            }
        }
    }, [healthData, isLoading]);

    const setHealthData = (data: HealthData) => {
        setHealthDataState(data);
    };

    return (
        <HealthDataContext.Provider value={{ healthData, setHealthData, isLoading }}>
            {children}
        </HealthDataContext.Provider>
    );
}

export function useHealthData() {
    const context = useContext(HealthDataContext);
    if (context === undefined) {
        throw new Error("useHealthData must be used within a HealthDataProvider");
    }
    return context;
}

