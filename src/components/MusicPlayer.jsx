import { useState, useEffect } from "react";
import YouTube from "react-youtube";

export default function MusicPlayer({ videoId, spotifyId }) {
  const [platform, setPlatform] = useState("youtube");

  // Pick default platform automatically based on available data
  useEffect(() => {
    if (!videoId && spotifyId) {
      setPlatform("spotify");
    }
  }, [videoId, spotifyId]);

  if (!videoId && !spotifyId) {
    return (
      <div className="text-gray-500 text-center mt-6">
        🎵 No song playing yet…
      </div>
    );
  }

  const youtubeOpts = {
    width: "100%",
    height: "360",
    playerVars: { autoplay: 1 },
  };

  return (
    <div className="flex flex-col items-center mt-6 w-full max-w-2xl mx-auto">
      {/* Platform Selector */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setPlatform("youtube")}
          className={`px-4 py-2 rounded-lg transition ${
            platform === "youtube"
              ? "bg-red-500 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          disabled={!videoId}
        >
          YouTube
        </button>
        <button
          onClick={() => setPlatform("spotify")}
          className={`px-4 py-2 rounded-lg transition ${
            platform === "spotify"
              ? "bg-green-500 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          disabled={!spotifyId}
        >
          Spotify
        </button>
      </div>

      {/* Player */}
      <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
        {platform === "youtube" && videoId ? (
          <YouTube videoId={videoId} opts={youtubeOpts} />
        ) : platform === "spotify" && spotifyId ? (
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyId}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
        ) : (
          <div className="text-gray-500 text-center py-12">
            🚫 No valid {platform} track available
          </div>
        )}
      </div>
    </div>
  );
}
