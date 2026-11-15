import { CoursesView } from "./CoursesView.jsx";
import { useCourses } from "./useCourses.js";

export function CoursesPage() {
  const state = useCourses();

  return (
    <CoursesView
      courses={state.courses}
      loading={state.loading}
      loadError={state.loadError}
      values={state.values}
      submitting={state.submitting}
      submitError={state.submitError}
      fieldErrors={state.fieldErrors}
      onChangeField={state.changeField}
      onSubmit={state.submit}
    />
  );
}