import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { history, message, timeline, snapshot, cardiology } = body;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Build context from structured health data
        let healthContext = "STRUCTURED HEALTH DATA:\n\n";

        if (timeline && Object.keys(timeline).length > 0) {
            healthContext += "TIMELINE:\n";
            healthContext += JSON.stringify(timeline, null, 2);
            healthContext += "\n\n";
        }

        if (snapshot && Object.keys(snapshot).length > 0) {
            healthContext += "DOCTOR SNAPSHOT:\n";
            healthContext += JSON.stringify(snapshot, null, 2);
            healthContext += "\n\n";
        }

        if (cardiology && Object.keys(cardiology).length > 0) {
            healthContext += "CARDIOLOGY INSIGHTS:\n";
            healthContext += JSON.stringify(cardiology, null, 2);
            healthContext += "\n\n";
        }

        // Build conversation history
        let conversationHistory = "";
        if (history && Array.isArray(history) && history.length > 0) {
            conversationHistory = "CONVERSATION HISTORY:\n";
            history.slice(-6).forEach((msg: any) => {
                const role = msg.role || "user";
                const content = msg.content || msg.message || "";
                conversationHistory += `${role.toUpperCase()}: ${content}\n`;
            });
            conversationHistory += "\n";
        }

        // System prompt
        const systemPrompt = `You are a cardiology-aware conversational health assistant. You do NOT diagnose. You help users understand their data based only on the provided structured information. If the user reports red-flag symptoms, advise them to seek urgent care.

Rules:
- NEVER invent new medical facts.
- Base responses exclusively on structured data.
- Provide calm, clear, clinically safe explanations.

The assistant should:
- Explain lab results
- Explain symptom relevance
- Interpret risk profile
- Give actionable but safe lifestyle advice
- Prepare the user for a doctor visit`;

        // User prompt
        const userPrompt = `${healthContext}${conversationHistory}USER MESSAGE: ${message}

Respond to the user's message based on the structured health data provided above. Return your response as a JSON object with a "reply" field containing your response text.`;

        try {
            const ai = getGeminiClient();
            const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: fullPrompt,
            });
            const responseText = response.text;

            // Parse the JSON response
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(responseText);
            } catch (parseError) {
                // If parsing fails, wrap the text in the expected format
                parsedResponse = { reply: responseText };
            }

            // Ensure we have a reply field
            if (!parsedResponse.reply) {
                parsedResponse = { reply: responseText };
            }

            return NextResponse.json(parsedResponse);
        } catch (error) {
            console.error("Error calling Gemini:", error);

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
                    reply: "I apologize, but I'm having trouble processing your request right now. Please try again later or consult with your healthcare provider for immediate medical questions.",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error in chat route:", error);
        return NextResponse.json(
            {
                error: "Failed to process chat message",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// Helper function to get Gemini client
// The client gets the API key from the environment variable `GEMINI_API_KEY`
function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    return new GoogleGenAI({});
}
