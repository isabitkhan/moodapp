import React from "react";

export default function SpotifyAuth() {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = "https://moodapp-sigma.vercel.app/callback"; // must match Dashboard
  const SCOPES = [
    "user-read-email",
    "user-read-private",
  ];

  const login = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPES.join("%20")}&response_type=token&show_dialog=true`;

    window.location.href = authUrl;
  };

  return (
    <button
      onClick={login}
      className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
    >
      Login with Spotify
    </button>
  );
}
