import { getApps } from '@/lib/data';
import { AppCard } from '@/components/AppCard';
import { Header } from '@/components/Header';

// Always read the current list from the store rather than a build-time cache,
// since admins can add/edit/remove apps at any time.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const apps = await getApps();
  const sorted = [...apps].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-heineken-cream">
      <Header />
      <section className="mx-auto max-w-6xl px-6 py-10">
        {sorted.length === 0 ? (
          <p className="text-center text-gray-500">No apps have been added yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sorted.map((app) => (
              <AppCard key={app.id} name={app.name} url={app.url} iconUrl={app.iconUrl} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
