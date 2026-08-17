export default function PageHeader({
  title,
  lede,
}: {
  title: string;
  lede?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-3xl px-6 pt-16 pb-10 sm:pt-20">
      <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
      {lede && (
        <div className="mt-6 space-y-4 leading-relaxed text-muted">{lede}</div>
      )}
    </header>
  );
}
