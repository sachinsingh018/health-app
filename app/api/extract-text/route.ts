import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/text-extractor-server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const text = await extractTextFromFile(file);

        return NextResponse.json({
            success: true,
            text,
        });
    } catch (error) {
        console.error("Error extracting text:", error);
        return NextResponse.json(
            {
                error: "Failed to extract text",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

