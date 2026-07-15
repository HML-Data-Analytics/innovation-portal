interface AppCardProps {
  name: string;
  url: string;
  iconUrl?: string;
}

export function AppCard({ name, url, iconUrl }: AppCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-3 rounded-2xl border border-heineken-green/10 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-heineken-green/30 hover:shadow-lg"
    >
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-heineken-green/5">
        {iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconUrl} alt="" className="h-12 w-12 object-contain" />
        ) : (
          <span className="text-2xl font-bold text-heineken-green">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <span className="font-semibold text-gray-800 group-hover:text-heineken-green">{name}</span>
    </a>
  );
}
