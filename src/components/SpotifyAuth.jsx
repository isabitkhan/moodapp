// import { useEffect, useState } from "react";

// export default function SpotifyAuth() {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("spotify_token");
//     if (token) {
//       fetchUserProfile(token);
//     }
//   }, []);

//   const fetchUserProfile = async (token) => {
//     try {
//       const res = await fetch("https://api.spotify.com/v1/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();
//       setUser(data);
//     } catch (err) {
//       console.error("Spotify user fetch error:", err);
//       setError("❌ Could not load Spotify profile.");
//     }
//   };

//   const login = () => {
//     const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
//     const redirectUri = "https://moodapp-sigma.vercel.app/callback"; // ✅ change for local: http://localhost:5173/callback
//     const scope = "user-read-email user-read-private";

//     const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
//       redirectUri
//     )}&response_type=token&scope=${encodeURIComponent(scope)}`;

//     window.location.href = authUrl;
//   };

//   return (
//     <div className="text-center mt-6">
//       {!user ? (
//         <button
//           onClick={login}
//           className="px-6 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700"
//         >
//           Login with Spotify
//         </button>
//       ) : (
//         <div className="flex items-center justify-center gap-3 mt-4 p-3 bg-gray-100 rounded-xl shadow">
//           {user.images?.length > 0 && (
//             <img
//               src={user.images[0].url}
//               alt="Profile"
//               className="w-12 h-12 rounded-full border border-gray-300"
//             />
//           )}
//           <div className="text-left">
//             <p className="font-semibold">{user.display_name}</p>
//             <p className="text-sm text-gray-500">{user.email}</p>
//           </div>
//         </div>
//       )}
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//     </div>
//   );
// }
export default function SpotifyAuth({ onToken }) {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // 👈 make sure you set this in .env
  const redirectUri = "https://moodapp-sigma.vercel.app/callback"; // 👈 must match Spotify dashboard exactly
  const scopes = ["user-read-email", "user-read-private"];

  const loginUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}&show_dialog=true`;

  return (
    <button
      onClick={() => (window.location.href = loginUrl)}
      className="px-4 py-2 bg-green-500 text-white rounded-lg"
    >
      Login with Spotify
    </button>
  );
}
