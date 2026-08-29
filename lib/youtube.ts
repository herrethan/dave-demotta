/** Extract a YouTube video id (and playlist id, if any) from most URL shapes. */
export function parseYouTubeUrl(
  input: string,
): { videoId: string; playlistId?: string } | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m)\./, "");
  let videoId: string | null = null;

  if (host === "youtu.be") {
    videoId = url.pathname.slice(1).split("/")[0] || null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/);
    videoId = url.searchParams.get("v") ?? (m ? m[1] : null);
  }
  if (!videoId) return null;

  const playlistId = url.searchParams.get("list") ?? undefined;
  return { videoId, playlistId };
}
