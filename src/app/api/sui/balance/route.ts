import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  const coinType = searchParams.get('coinType') || '0x2::sui::SUI';

  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 });
  }

  const payload = {
    jsonrpc: '2.0',
    id: 1,
    method: 'suix_getBalance',
    params: [address, coinType],
  };

  try {
    const res = await fetch('https://fullnode.testnet.sui.io:443', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const json = await res.json();
    const balance = json.result?.totalBalance ?? null;

    return NextResponse.json({ balance }, { status: 200 });
  } catch (e) {
    console.error('Failed to fetch balance', e);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 },
    );
  }
}
