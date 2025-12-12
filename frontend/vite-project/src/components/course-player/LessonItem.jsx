export default function LessonItem({ lesson, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition 
        ${active ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-white/10"}
      `}
    >
      {lesson.title}
    </button>
  );
}


