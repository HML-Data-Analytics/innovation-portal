'use client';

import { useEffect, useState, type FormEvent } from 'react';
import type { AppItem } from '@/lib/types';

export default function AdminPage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadApps();
  }, []);

  async function loadApps() {
    setLoading(true);
    const res = await fetch('/api/apps');
    const data = await res.json();
    setApps(data.apps ?? []);
    setLoading(false);
  }

  function resetForm() {
    setName('');
    setUrl('');
    setIconFile(null);
    setIconPreview('');
    setEditingId(null);
    setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      let uploadedIconUrl: string | undefined;
      if (iconFile) {
        const form = new FormData();
        form.append('file', iconFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: form });
        if (!uploadRes.ok) {
          const data = await uploadRes.json().catch(() => ({}));
          throw new Error(data.error || 'Icon upload failed');
        }
        const uploadData = await uploadRes.json();
        uploadedIconUrl = uploadData.url;
      }

      if (editingId) {
        const res = await fetch(`/api/apps/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            url,
            ...(uploadedIconUrl ? { iconUrl: uploadedIconUrl } : {}),
          }),
        });
        if (!res.ok) throw new Error('Failed to update app');
      } else {
        const res = await fetch('/api/apps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, url, iconUrl: uploadedIconUrl || '' }),
        });
        if (!res.ok) throw new Error('Failed to add app');
      }

      resetForm();
      await loadApps();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(app: AppItem) {
    setEditingId(app.id);
    setName(app.name);
    setUrl(app.url);
    setIconPreview(app.iconUrl);
    setIconFile(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this app shortcut?')) return;
    await fetch(`/api/apps/${id}`, { method: 'DELETE' });
    await loadApps();
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <main className="min-h-screen bg-heineken-cream">
      <header className="flex items-center justify-between bg-heineken-green px-6 py-5">
        <h1 className="text-xl font-bold text-white">Innovation Apps Portal — Admin</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-white/10 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/20"
        >
          Log out
        </button>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-heineken-green">
            {editingId ? 'Edit app shortcut' : 'Add a new app shortcut'}
          </h2>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">App name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-heineken-green focus:outline-none focus:ring-1 focus:ring-heineken-green"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">App URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="url"
                required
                placeholder="https://…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-heineken-green focus:outline-none focus:ring-1 focus:ring-heineken-green"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Icon</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setIconFile(file);
                if (file) setIconPreview(URL.createObjectURL(file));
              }}
              className="block text-sm"
            />
            {iconPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={iconPreview} alt="" className="mt-2 h-12 w-12 rounded object-contain" />
            )}
          </div>

          {error && <p className="mb-4 text-sm text-heineken-red">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-heineken-green px-5 py-2 font-semibold text-white hover:bg-heineken-dark disabled:opacity-60"
            >
              {submitting ? 'Saving…' : editingId ? 'Save changes' : 'Add app'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-5 py-2 font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-heineken-green">
            Current shortcuts ({apps.length})
          </h2>

          {loading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : apps.length === 0 ? (
            <p className="text-sm text-gray-500">No app shortcuts yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {apps.map((app) => (
                <li key={app.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    {app.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={app.iconUrl} alt="" className="h-10 w-10 rounded object-contain" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-heineken-green/10 font-bold text-heineken-green">
                        {app.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{app.name}</p>
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-500 hover:underline"
                      >
                        {app.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(app)}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="rounded-lg border border-heineken-red/30 px-3 py-1 text-sm text-heineken-red hover:bg-heineken-red/5"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
