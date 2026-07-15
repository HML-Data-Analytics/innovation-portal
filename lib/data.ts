import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';
import type { AppItem } from './types';

const KV_KEY = 'innovation-apps:list';
const LOCAL_FILE = path.join(process.cwd(), '.data', 'apps.json');

// Uses Vercel KV in production. Falls back to a local JSON file so the app
// runs out of the box in local dev without any KV store configured.
const useKv = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

function readLocal(): AppItem[] {
  try {
    if (!fs.existsSync(LOCAL_FILE)) return [];
    return JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeLocal(apps: AppItem[]): void {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(apps, null, 2));
}

function assertLocalFallbackIsUsable(): void {
  // Vercel's serverless functions have a read-only filesystem outside /tmp,
  // so the local-JSON fallback can't work there. Fail with a clear message
  // instead of throwing a confusing fs error deep in a write call.
  if (process.env.VERCEL) {
    throw new Error(
      'No data store configured: attach a Vercel KV store to this project (Storage tab) ' +
        'and redeploy. The local JSON file fallback only works in local development.'
    );
  }
}

export async function getApps(): Promise<AppItem[]> {
  if (useKv) {
    return (await kv.get<AppItem[]>(KV_KEY)) ?? [];
  }
  assertLocalFallbackIsUsable();
  return readLocal();
}

export async function saveApps(apps: AppItem[]): Promise<void> {
  if (useKv) {
    await kv.set(KV_KEY, apps);
    return;
  }
  assertLocalFallbackIsUsable();
  writeLocal(apps);
}

export async function addApp(
  input: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AppItem> {
  const apps = await getApps();
  const now = Date.now();
  const app: AppItem = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, ...input };
  apps.push(app);
  await saveApps(apps);
  return app;
}

export async function updateApp(
  id: string,
  input: Partial<Omit<AppItem, 'id' | 'createdAt'>>
): Promise<AppItem | null> {
  const apps = await getApps();
  const index = apps.findIndex((app) => app.id === id);
  if (index === -1) return null;
  apps[index] = { ...apps[index], ...input, updatedAt: Date.now() };
  await saveApps(apps);
  return apps[index];
}

export async function deleteApp(id: string): Promise<boolean> {
  const apps = await getApps();
  const next = apps.filter((app) => app.id !== id);
  if (next.length === apps.length) return false;
  await saveApps(next);
  return true;
}
