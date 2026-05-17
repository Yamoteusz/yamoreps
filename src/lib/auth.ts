/**
 * Edge-compatible auth using Web Crypto API (works on Cloudflare Workers,
 * Vercel Edge, and Node.js without polyfills).
 */

import { cookies } from 'next/headers';

const COOKIE_NAME = 'yamo_admin';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function secret(): string {
  return process.env.SESSION_SECRET || 'dev-secret-do-not-use-in-prod';
}

function adminPasswordRaw(): string {
  return process.env.ADMIN_PASSWORD || 'yamoreps2026';
}

const enc = new TextEncoder();

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return bufToHex(sig);
}

function bufToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
}

/** Constant-time comparison for two equal-length hex strings. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const issued = Date.now().toString();
  const sig = await hmac(issued);
  return `${issued}.${sig}`;
}

export async function verifySessionToken(token?: string): Promise<boolean> {
  if (!token) return false;
  const [issued, sig] = token.split('.');
  if (!issued || !sig) return false;
  const expected = await hmac(issued);
  if (!safeEqual(expected, sig)) return false;
  const age = Date.now() - Number(issued);
  return age >= 0 && age < SESSION_TTL_MS;
}

export async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function passwordMatches(input: string): Promise<boolean> {
  if (!input) return false;
  // Constant-time compare on byte level.
  const a = enc.encode(input);
  const b = enc.encode(adminPasswordRaw());
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export const SESSION_COOKIE = COOKIE_NAME;
