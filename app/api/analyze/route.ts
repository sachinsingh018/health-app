import { NextRequest, NextResponse } from "next/server";
import {
    generatePatientTimeline,
    generateDoctorSnapshot,
    generateCardiologyInsights,
} from "@/lib/gemini";
import { demoHealthData } from "@/lib/demoData";

export async function POST(request: NextRequest) {
    try {
        // Check if demo mode is enabled
        const useDemoMode = process.env.USE_DEMO_MODE === "true";

        if (useDemoMode) {
            console.log("DEMO MODE: Returning demo data");
            return NextResponse.json({
                success: true,
                timeline: demoHealthData.timeline,
                snapshot: demoHealthData.snapshot,
                cardiology: demoHealthData.cardiology,
                message: "Demo health data loaded successfully",
            });
        }

        const body = await request.json();
        const { text } = body;

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        if (text.trim().length === 0) {
            return NextResponse.json(
                { error: "Text cannot be empty" },
                { status: 400 }
            );
        }

        // TODO: Replace analysis with structured Apple Health parsers later.
        // For now, we analyze the raw text with Gemini

        // Call all three Gemini functions in parallel
        const [timeline, snapshot, cardiology] = await Promise.all([
            generatePatientTimeline(text),
            generateDoctorSnapshot(text),
            generateCardiologyInsights(text),
        ]);

        return NextResponse.json({
            success: true,
            timeline,
            snapshot,
            cardiology,
            message: "Health data analyzed successfully",
        });
    } catch (error) {
        console.error("Error in analyze route:", error);

        // Check if it's a missing API key error
        if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
            return NextResponse.json(
                {
                    error: "Gemini API key not configured",
                    message: "Please set GEMINI_API_KEY environment variable",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                error: "Failed to analyze text",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

