import { NextRequest, NextResponse } from 'next/server';
import { deleteApp, updateApp } from '@/lib/data';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const update: Record<string, string> = {};
  if (typeof body.name === 'string') update.name = body.name.trim();
  if (typeof body.url === 'string') update.url = body.url.trim();
  if (typeof body.iconUrl === 'string') update.iconUrl = body.iconUrl.trim();

  try {
    const app = await updateApp(params.id, update);
    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }
    return NextResponse.json({ app });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update app' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ok = await deleteApp(params.id);
    if (!ok) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete app' },
      { status: 500 }
    );
  }
}
