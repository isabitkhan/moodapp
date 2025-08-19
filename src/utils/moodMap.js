// src/utils/moodMapping.js

// Query terms to feed YouTube search per mood
export const moodQuery = {
  Happy: "happy upbeat songs",
  Sad: "sad emotional songs",
  Relaxed: "chill lofi beats",
  Angry: "angry rock metal songs",
  Focused: "focus study instrumental"
};

// Query terms for Spotify (can be playlists or tracks)
export const moodSpotifyQuery = {
  Happy: "Happy Hits",
  Sad: "Sad Songs",
  Relaxed: "Chill Lofi",
  Angry: "Rock Hard",
  Focused: "Focus Music"
};

// Map raw face-api expression labels to our moods
export function mapExpressionToMood(expressions = {}) {
  // expressions example: { happy: 0.8, sad: 0.02, neutral: 0.1, angry: 0.05, ... }
  const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);

  const top = sorted[0]?.[0] || 'neutral';

  switch (top) {
    case 'happy':
      return 'Happy';
    case 'sad':
    case 'fearful':
      return 'Sad';
    case 'angry':
    case 'disgusted':
      return 'Angry';
    case 'surprised':
      return 'Relaxed';
    case 'neutral':
    default:
      // pick Focused on neutral by default
      return 'Focused';
  }
}
