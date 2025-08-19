import { useEffect } from "react";

export default function SpotifyCallback() {
  useEffect(() => {
    // Spotify sends back token in the URL hash (#)
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // remove #
      const token = params.get("access_token");

      if (token) {
        localStorage.setItem("spotify_token", token);
        // Redirect back to home page
        window.location.href = "/";
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
      Logging you in with Spotify…
    </div>
  );
}
