import { NextResponse } from "next/server";

export async function GET() {
    const useDemoMode = process.env.USE_DEMO_MODE === "true";
    return NextResponse.json({ useDemoMode });
}

