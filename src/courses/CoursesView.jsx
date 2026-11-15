const FIELDS = [
  { name: "code", label: "Code", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "department", label: "Department", type: "text" },
  { name: "credits", label: "Credits", type: "number" },
  { name: "capacity", label: "Capacity", type: "number" },
  { name: "description", label: "Description", type: "textarea" },
];

function seatsText(seatsLeft) {
  if (seatsLeft === 0) return "Full";
  if (seatsLeft === 1) return "1 seat left";
  return `${seatsLeft} seats left`;
}

function creditsText(credits) {
  return credits === 1 ? "1 credit" : `${credits} credits`;
}

function CourseList({ courses, loading, loadError }) {
  if (loading) return <p>Loading courses…</p>;
  if (loadError) return <p>Couldn't load courses: {loadError}</p>;
  if (courses.length === 0) return <p>No courses yet.</p>;
  return (
    <ul className="course-list">
      {courses.map((course) => (
        <li key={course.id}>
          <div>
            {course.code} · {course.title}
          </div>
          <div>
            {creditsText(course.credits)} · {course.department} ·{" "}
            {seatsText(course.seatsLeft)}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CoursesView({
  courses,
  loading,
  loadError,
  values,
  submitting,
  submitError,
  fieldErrors,
  onChangeField,
  onSubmit,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <main>
      <h1>Courses</h1>
      <CourseList courses={courses} loading={loading} loadError={loadError} />

      <h2>Add a course</h2>
      <form onSubmit={handleSubmit}>
        {FIELDS.map(({ name, label, type }) => {
          const id = `course-${name}`;
          const error = fieldErrors[name];
          const common = {
            id,
            name,
            value: values[name],
            onChange: (event) => onChangeField(name, event.target.value),
            "aria-invalid": error ? true : undefined,
          };
          return (
            <div key={name} className="field">
              <label htmlFor={id}>{label}</label>
              {type === "textarea" ? (
                <textarea {...common} />
              ) : (
                <input type={type} {...common} />
              )}
              {error && <div className="field-error">{error}</div>}
            </div>
          );
        })}
        {submitError && (
          <p role="alert" className="form-error">
            {submitError}
          </p>
        )}
        <button type="submit" disabled={submitting}>
          Add course
        </button>
      </form>
    </main>
  );
}