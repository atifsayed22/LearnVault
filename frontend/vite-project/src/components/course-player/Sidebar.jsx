import LessonItem from "./LessonItem";

export default function Sidebar({ course, currentLesson, onLessonSelect, completion, progressMap }) {
  const percentage = completion?.completionPercentage || 0;
  const completed = completion?.completedLessons || 0;
  const total = completion?.totalLessons || 0;

  return (
    <div className="w-full md:w-80 bg-white/5 border-r border-white/10 p-4 overflow-y-auto h-[calc(100vh-129px)] md:h-[calc(100vh-64px)]">

      <h2 className="text-xl font-bold mb-4">{course.title}</h2>

      {/* Progress Bar */}
      <div className="mb-6 bg-white/10 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Progress</span>
          <span className="text-sm font-semibold text-white">{percentage}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{completed} of {total} lessons completed</p>
      </div>

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
