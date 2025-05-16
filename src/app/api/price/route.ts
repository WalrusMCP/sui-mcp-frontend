// src/app/api/price/route.ts  (Next.js App Router)
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get('symbol') || 'sui').toLowerCase();

  const r = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`
  );
  const json = await r.json();
  const price = json[symbol]?.usd;

  return NextResponse.json({ price });
}