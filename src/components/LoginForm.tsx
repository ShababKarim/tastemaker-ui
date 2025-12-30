'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState('user_1');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Login failed');
        return;
      }
      const next = params.get('next');
      if (next) {
        router.replace(next);
      } else {
        router.replace(`/profile/${data.user.id}`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card bg-base-200 max-w-md w-full shadow">
      <div className="card-body gap-4">
        <h1 className="card-title text-2xl">Log in</h1>
        <p className="text-sm text-base-content/70">
          Use any mock user id or username with password &quot;password&quot;.
        </p>

        <label className="form-control flex flex-col">
          <div className="label">
            <span className="label-text">Username or User ID</span>
          </div>
          <input
            className="input input-bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="e.g., user_1 or alex"
          />
        </label>

        <label className="form-control flex flex-col">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input
            type="password"
            className="input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="password"
          />
        </label>

        <Link href="/" className="text-sm text-base-content/70 mt-0 color-blue">
          Forgot password?
        </Link>

        {error ? <div className="text-error text-sm">{error}</div> : null}

        <button type="submit" className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}
