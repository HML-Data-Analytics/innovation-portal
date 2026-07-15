import { StarIcon } from './icons';

export function Header() {
  return (
    <header className="bg-heineken-green">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-heineken-green shadow">
          <StarIcon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-heineken-gold">
            Heineken
          </p>
          <h1 className="text-2xl font-bold text-white">Innovation Apps Portal</h1>
        </div>
      </div>
    </header>
  );
}
