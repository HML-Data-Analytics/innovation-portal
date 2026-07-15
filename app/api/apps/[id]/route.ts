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

  const app = await updateApp(params.id, update);
  if (!app) {
    return NextResponse.json({ error: 'App not found' }, { status: 404 });
  }
  return NextResponse.json({ app });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const ok = await deleteApp(params.id);
  if (!ok) {
    return NextResponse.json({ error: 'App not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
