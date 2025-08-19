import axios from 'axios';
import { moodQuery } from '../utils/moodMap';


const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';


export async function fetchVideoIdForMood(mood) {
const q = moodQuery[mood] || moodQuery.Focused;


try {
const { data } = await axios.get(BASE_URL, {
params: {
part: 'snippet',
q,
type: 'video',
maxResults: 1,
videoEmbeddable: 'true',
key: API_KEY,
},
});


return data?.items?.[0]?.id?.videoId || null;
} catch (err) {
console.error('YouTube API error:', err);
return null;
}
}