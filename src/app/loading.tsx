export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse bg-background">
      <div className="h-[68vh] bg-[linear-gradient(110deg,#08101f,#0d1628,#08101f)]" />
      <div className="space-y-10 px-[clamp(1.25rem,4vw,4.5rem)] py-10">
        {Array.from({ length: 2 }, (_, row) => (
          <div key={row}>
            <span className="mb-4 block h-7 w-44 rounded bg-surface" />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
              {Array.from({ length: 7 }, (_, card) => (
                <span key={card} className="aspect-2/3 rounded-lg bg-surface" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
