// src/app/api/services/claude/ask/route.ts
import { NextRequest, NextResponse } from 'next/server';


// 可选：支持 GET 方法用于健康检查
export async function GET() {
  return NextResponse.json({ message: "Claude ask API is up." });
}