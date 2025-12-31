'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const LOGIN_MODAL_ID = 'login-modal';

export default function LoginModal() {
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

      router.refresh();
      // Close the modal on successful login
      (document.getElementById(LOGIN_MODAL_ID) as HTMLDialogElement)?.close();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog id={LOGIN_MODAL_ID} className="modal">
      <div className="modal-box">
        <form onSubmit={onSubmit} className="space-y-4">
          <h3 className="font-bold text-lg text-center">Welcome back</h3>
          <p className="text-xs text-base-content/70">
            Use any mock user id or username with password &quot;password&quot;.
          </p>

          <label className="form-control flex flex-col">
            <div className="label">
              <span className="label-text text-sm">Username or User ID</span>
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
              <span className="label-text text-sm">Password</span>
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

          <div className="modal-action">
            <button type="submit" className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
      {/* Modal backdrop - clicking it will close */}
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close">close</button>
      </form>
    </dialog>
  );
}
