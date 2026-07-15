// Uses the Web Crypto API only (no `node:crypto` import) so this file works
// unmodified in both the Node.js API routes and the Edge middleware runtime.

export const COOKIE_NAME = 'ia_admin_session';
const SESSION_MESSAGE = 'ia-admin-session';

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function computeSignature(secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(SESSION_MESSAGE));
  return bufferToHex(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function isValidSession(
  cookieValue: string | undefined,
  secret: string | undefined
): Promise<boolean> {
  if (!cookieValue || !secret) return false;
  const expected = await computeSignature(secret);
  return timingSafeEqual(cookieValue, expected);
}
