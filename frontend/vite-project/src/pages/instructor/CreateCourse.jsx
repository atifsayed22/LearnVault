import { useState } from "react";
import StepBasicInfo from "../../components/instructor/course-builder/StepBasicInfo";
import StepSections from "../../components/instructor/course-builder/StepSections";
import StepLessons from "../../components/instructor/course-builder/StepLessons";
import PublishCourse from "../../components/instructor/course-builder/PublishCourse";

export default function CreateCourse() {
  
  const [step, setStep] = useState(1);

  // Step 1 state — persists user inputs even if they navigate away
  const [courseForm, setCourseForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    price: "",
  });

  // Stores saved course returned from backend
  const [course, setCourse] = useState(null);

  const next = () => setStep((prev) => prev + 1);

  return (
    <div className="w-full">

      {step === 1 && (
        <StepBasicInfo
          next={next}
          courseForm={courseForm}
          setCourseForm={setCourseForm}
          course={course}
          setCourse={setCourse}
        />
      )}

      {step === 2 && (
        <StepSections
          next={next}
          course={course}
        />
      )}

      {step === 3 && (
        <StepLessons
          next={next}
          course={course}
        />
      )}

      {step === 4 && (
        <PublishCourse 
          course={course} 
        />
      )}

    </div>
  );
}
