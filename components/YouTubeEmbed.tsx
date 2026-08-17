export default function YouTubeEmbed({
  id,
  title,
  playlistId,
}: {
  id: string;
  title: string;
  playlistId?: string;
}) {
  const src = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
  if (playlistId) src.searchParams.set("list", playlistId);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-surface">
      <iframe
        src={src.toString()}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
