import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, createTokenForUser, TOKEN_TTL_SECONDS, validateCredentials } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = (await req.json()) as { username?: string; password?: string };
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
    }

    const user = validateCredentials(username, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createTokenForUser(user);
    // simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const res = NextResponse.json(
      { user: { id: user.id, name: user.name, username: user.username, avatarUrl: user.avatarUrl } },
      { status: 200 },
    );
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: TOKEN_TTL_SECONDS,
    });

    revalidatePath('/');

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
