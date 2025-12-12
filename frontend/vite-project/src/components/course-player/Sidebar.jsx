import LessonItem from "./LessonItem";

export default function Sidebar({ course, currentLesson, onLessonSelect }) {
  return (
    <div className="w-80 bg-white/5 border-r border-white/10 p-4 overflow-y-auto h-screen">

      <h2 className="text-xl font-bold mb-6">{course.title}</h2>

      {course.sections.map((sec) => (
        <div key={sec._id} className="mb-4">
          <h3 className="font-semibold mb-2">{sec.title}</h3>

          <div className="space-y-1">
            {sec.lessons.map((les) => (
              <LessonItem
                key={les._id}
                lesson={les}
                active={currentLesson?._id === les._id}
                onClick={() => onLessonSelect(les)}
              />
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}
