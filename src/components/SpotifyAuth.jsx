import { useEffect, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

export default function SpotifyAuth({ onToken }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    let localToken = window.localStorage.getItem("spotify_token");

    if (!localToken && hash) {
      const _token = hash
        .substring(1)
        .split("&")
        .find((el) => el.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("spotify_token", _token);
      localToken = _token;
    }

    setToken(localToken);
    if (localToken) onToken(localToken);
  }, [onToken]);

  const login = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}`;
  };

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem("spotify_token");
    onToken(null);
  };

  return (
    <div className="mt-2">
      {!token ? (
        <button
          onClick={login}
          className="bg-green-600 text-white px-4 py-2 rounded-xl"
        >
          Login Spotify
        </button>
      ) : (
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      )}
    </div>
  );
}
