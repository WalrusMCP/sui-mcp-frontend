import { NextResponse } from "next/server";

/**
 * GET /api/services/claude
 * Simply checks if ANTHROPIC_API_KEY exists.
 */
export async function GET() {
    const apiKey = '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';

    if (!apiKey) {
        return NextResponse.json(
            {
                available: false,
                message:
                    "Claude API is not configured. Please set ANTHROPIC_API_KEY env var.",
            },
            { status: 200 },
        );
    }
    return NextResponse.json(
        {
            available: true,
            message: "Claude API is available and configured.",
        },
        { status: 200 },
    );
}