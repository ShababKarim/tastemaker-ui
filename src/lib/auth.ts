import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { MOCK_USERS } from '@/lib/mocks';
import { User } from '@/lib/types';

// Very lightweight mock JWT utilities (NOT for production)
export const AUTH_COOKIE = 'tm_auth';
export const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 1; // 1 day
const SECRET = process.env.AUTH_SECRET || 'dev-secret';

export type SessionPayload = {
  sub: string; // user id
  username: string;
  iat: number; // issued at (unix seconds)
  exp: number; // expiry (unix seconds)
};

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function sign(payload: SessionPayload): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encHeader = base64url(JSON.stringify(header));
  const encPayload = base64url(JSON.stringify(payload));
  const data = `${encHeader}.${encPayload}`;
  const signature = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verify(token: string): SessionPayload | null {
  try {
    const [encHeader, encPayload, signature] = token.split('.');
    if (!encHeader || !encPayload || !signature) return null;
    const data = `${encHeader}.${encPayload}`;
    const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
    if (expected !== signature) return null;
    const json = Buffer.from(encPayload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
    const payload = JSON.parse(json) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createTokenForUser(user: User): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: user.id,
    username: user.username,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };
  return sign(payload);
}

export function getUserFromToken(token: string | undefined | null): User | null {
  if (!token) return null;
  const payload = verify(token);
  if (!payload) return null;
  const user = MOCK_USERS[payload.sub];
  return user ?? null;
}

// Server-only: read user from request cookies
export function getSessionUserFromRequest(req: NextRequest): User | null {
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  return getUserFromToken(token);
}

// Server-only: read user from headers cookies API (for Server Components)
export async function getSessionUserFromCookies(): Promise<User | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  return getUserFromToken(token);
}

// Mock credential validation
// For demo: any username that matches an existing MOCK_USERS user.id or user.username with password "password"
export function validateCredentials(username: string, password: string): User | null {
  if (password !== 'password') return null;
  const byId = MOCK_USERS[username];
  if (byId) return byId;
  const user = Object.values(MOCK_USERS).find((u) => u.username === username);
  return user ?? null;
}
