import { useEffect } from "react";

export default function SpotifyCallback() {
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");

      if (token) {
        // Save token in localStorage
        localStorage.setItem("spotify_token", token);

        // ✅ Clear hash from URL
        window.history.replaceState({}, document.title, "/");

        // ✅ Redirect to home
        window.location.replace("/");
      } else {
        // If no token found, redirect home anyway
        window.location.replace("/");
      }
    } else {
      // If no hash at all
      window.location.replace("/");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
      Logging you in with Spotify…
    </div>
  );
}
