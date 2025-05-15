import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

/**
 * POST /api/services/claude/ask
 * Body: { "message": "your question" }
 */
export async function POST(req: Request) {
    // 1. parse body
    let body: { message?: string };
    try {
        body = await req.json();
    } catch (_) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const message = body?.message?.trim();
    if (!message) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 2. check api key
    const apiKey = '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';

    if (!apiKey) {
        return NextResponse.json(
            { error: "ANTHROPIC_API_KEY not set" },
            { status: 500 },
        );
    }

    // 3. call Claude
    const anthropic = new Anthropic({ apiKey });

    try {
        const claudeRes = await anthropic.messages.create({
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 256,
            messages: [{ role: "user", content: message }],
        });

        const text = claudeRes.content[0].type === "text"
            ? claudeRes.content[0].text
            : "";

        return NextResponse.json({ answer: text }, { status: 200 });
    } catch (e: any) {
        console.error("Claude API error:", e);
        return NextResponse.json(
            { error: "Claude request failed" },
            { status: 500 },
        );
    }
}