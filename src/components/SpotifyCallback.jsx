import { useEffect, useState } from "react";

export default function SpotifyCallback() {
  const [status, setStatus] = useState("🔄 Logging you in with Spotify…");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      setStatus("❌ Invalid login callback.");
      return;
    }

    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");
    const error = params.get("error");

    if (error) {
      setStatus("❌ Login failed: " + error);
      return;
    }

    if (!token) {
      setStatus("❌ No access token found. Login failed.");
      return;
    }

    // ✅ Store token
    localStorage.setItem("spotify_token", token);
    setStatus("✅ Login successful! Fetching your profile…");

    // ✅ Fetch user profile
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Profile fetch failed");
        return res.json();
      })
      .then((data) => {
        if (data && data.id) {
          setUser(data);
          setStatus(`🎉 Welcome, ${data.display_name}`);
          // Redirect after short delay
          setTimeout(() => {
            window.location.replace("/");
          }, 2500);
        } else {
          setStatus("❌ Could not load user profile.");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("❌ Error fetching user profile.");
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-lg font-semibold gap-4">
      <div>{status}</div>

      {user && (
        <div className="bg-white shadow-xl rounded-2xl p-5 text-center w-72">
          <img
            src={user.images?.[0]?.url || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-green-500"
          />
          <p className="font-bold text-xl">{user.display_name}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      )}
    </div>
  );
}
