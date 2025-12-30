'use client';

import React, { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/logout', { method: 'POST' });
      // refresh the page to update server components
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? 'Logging out…' : 'Logout'}
    </button>
  );
}
