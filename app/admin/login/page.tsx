'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Login failed');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-heineken-cream px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-xl font-bold text-heineken-green">Admin Sign In</h1>
        <p className="mb-6 text-sm text-gray-500">Heineken Innovation Apps Portal</p>

        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-heineken-green focus:outline-none focus:ring-1 focus:ring-heineken-green"
          required
          autoFocus
        />

        {error && <p className="mb-4 text-sm text-heineken-red">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-heineken-green py-2 font-semibold text-white transition hover:bg-heineken-dark disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
