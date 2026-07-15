import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Image must be under 2MB' }, { status: 400 });
  }

  const blob = await put(`icons/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
