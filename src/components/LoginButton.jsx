// components/LoginButton.jsx
import React from "react";

export default function LoginButton() {
  const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID"; // Replace with your actual client ID
  const REDIRECT_URI = "https://moodapp-sigma.vercel.app/callback"; // Must match your Spotify Dashboard
  const SCOPES = ["user-read-email", "user-read-private"];

  const loginUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${SCOPES.join("%20")}&response_type=token&show_dialog=true`;

  return (
    <a
      href={loginUrl}
      className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-lg hover:bg-green-700 transition-all"
    >
      Login with Spotify
    </a>
  );
}