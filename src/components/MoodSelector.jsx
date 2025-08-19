export default function MoodSelector({ onSelect, current }) {
const moods = ['Happy', 'Sad', 'Relaxed', 'Angry', 'Focused'];


return (
<div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
{moods.map((m) => (
<button
key={m}
onClick={() => onSelect(m)}
className={`px-4 py-2 rounded-2xl shadow transition border
${current === m ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50'}`}
>
{m}
</button>
))}
</div>
);
}