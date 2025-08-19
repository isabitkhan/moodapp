import { moodSpotifyQuery } from "./moodMap";

export async function fetchSpotifyTrack(mood, token) {
  if (!token) return null;

  const query = moodSpotifyQuery[mood] || mood;

  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    return data?.tracks?.items?.[0]?.id || null;
  } catch (err) {
    console.error("Spotify search error:", err);
    return null;
  }
}
