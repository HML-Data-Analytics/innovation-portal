import { NextRequest, NextResponse } from 'next/server';
import { addApp, getApps } from '@/lib/data';

export async function GET() {
  try {
    const apps = await getApps();
    return NextResponse.json({ apps });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to load apps' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();
  const url = body?.url?.trim();
  const iconUrl = body?.iconUrl?.trim() ?? '';

  if (!name || !url) {
    return NextResponse.json({ error: 'name and url are required' }, { status: 400 });
  }

  try {
    const app = await addApp({ name, url, iconUrl });
    return NextResponse.json({ app }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to add app' },
      { status: 500 }
    );
  }
}
