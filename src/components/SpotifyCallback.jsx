import { useEffect, useState } from "react";

export default function SpotifyCallback() {
  const [status, setStatus] = useState("Logging you in with Spotify…");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");

      if (token) {
        localStorage.setItem("spotify_token", token);
        setStatus("✅ Login successful! Fetching your profile…");

        // Fetch user profile from Spotify
        fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data && data.id) {
              setUser(data);
              setStatus("🎉 Welcome, " + data.display_name);
              // Redirect after 2 seconds
              setTimeout(() => {
                window.location.replace("/");
              }, 2000);
            } else {
              setStatus("❌ Failed to fetch user profile.");
            }
          })
          .catch(() => setStatus("❌ Error fetching user profile."));
      } else {
        setStatus("❌ No access token found. Login failed.");
      }
    } else {
      setStatus("❌ Invalid login callback.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-lg font-semibold gap-4">
      <div>{status}</div>
      {user && (
        <div className="bg-white shadow-lg rounded-xl p-4 text-center">
          <img
            src={user.images?.[0]?.url || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto mb-2"
          />
          <p className="font-bold">{user.display_name}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
      )}
    </div>
  );
}
