import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./index.css";

import MoodDetector from "./components/MoodDetector.jsx";
import MoodSelector from "./components/MoodSelector.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";

import { moodQuery } from "./utils/moodMap"; 
import SpotifyAuth from "./components/SpotifyAuth.jsx";
import { fetchSpotifyTrack } from "./utils/spotify.js";

// 🔴 Fetch YouTube video dynamically
async function fetchVideoIdForMood(mood) {
  try {
    const query = moodQuery[mood] || mood;
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
        query
      )}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
    );
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    } else {
      console.warn("No YouTube results for mood:", mood);
      return null;
    }
  } catch (err) {
    console.error("YouTube fetch error:", err);
    return null;
  }
}

export default function App() {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [spotifyUser, setSpotifyUser] = useState(null);
  const [mood, setMood] = useState(null);
  const [trackId, setTrackId] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [platform, setPlatform] = useState("youtube");

  // 🔄 Restore Spotify session
  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      setSpotifyToken(token);
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.id) {
            setSpotifyUser(data);
          } else {
            setSpotifyToken(null);
            localStorage.removeItem("spotify_token");
          }
        })
        .catch(() => {
          setSpotifyToken(null);
          localStorage.removeItem("spotify_token");
        });
    }
  }, []);

  const playForMood = async (m) => {
    setMood(m);
    setLoading(true);
    setError(null);

    if (platform === "youtube") {
      const id = await fetchVideoIdForMood(m);
      if (!id) setError("Could not find a playable track.");
      setTrackId(id);
    }

    if (platform === "spotify") {
      if (!spotifyToken) {
        setError("⚠️ Please log in to Spotify first.");
      } else {
        const trackId = await fetchSpotifyTrack(m, spotifyToken);
        if (!trackId) setError("Could not find a Spotify track.");
        setTrackId(trackId);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.header
        className="max-w-5xl mx-auto px-4 py-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl font-extrabold text-purple-700 drop-shadow-md">
          🎶 MoodTunes
        </h1>
        <p className="text-gray-600 mt-2">
          Detect your mood and play music automatically with YouTube or Spotify.
        </p>

        {/* ✅ Platform Selector */}
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => setPlatform("youtube")}
            className={`px-4 py-2 rounded-xl ${
              platform === "youtube" ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => setPlatform("spotify")}
            className={`px-4 py-2 rounded-xl ${
              platform === "spotify" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Spotify
          </button>
        </div>

        {/* ✅ Spotify Auth / User Info */}
        {platform === "spotify" && (
          <div className="mt-4">
            {spotifyUser ? (
              <div className="flex items-center justify-center gap-3 bg-white shadow-md rounded-xl px-4 py-2">
                <img
                  src={spotifyUser.images?.[0]?.url || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{spotifyUser.display_name}</span>
              </div>
            ) : (
              <SpotifyAuth
                onToken={(token) => {
                  localStorage.setItem("spotify_token", token);
                  setSpotifyToken(token);
                  // fetch profile right away
                  fetch("https://api.spotify.com/v1/me", {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                    .then((res) => res.json())
                    .then((data) => setSpotifyUser(data));
                }}
              />
            )}
          </div>
        )}
      </motion.header>

      <main className="max-w-5xl mx-auto px-4">
        <motion.section
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-3">Quick Detect</h2>
          <MoodDetector onDetect={playForMood} />
        </motion.section>

        <motion.section
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-3">Pick a Mood</h2>
          <MoodSelector onSelect={playForMood} current={mood} />
        </motion.section>

        <motion.section
          className="bg-white rounded-2xl shadow-lg p-6 mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-3">Player</h2>
          {loading && <div className="animate-pulse text-gray-500">Fetching song…</div>}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <MusicPlayer
            videoId={platform === "youtube" ? trackId : null}
            spotifyId={platform === "spotify" ? trackId : null}
            platform={platform}
          />
        </motion.section>

        <footer className="text-center text-xs text-gray-500 pb-8">
          Built with React + Vite · YouTube API · Spotify · Face-API.js
        </footer>
      </main>
    </div>
  );
}
