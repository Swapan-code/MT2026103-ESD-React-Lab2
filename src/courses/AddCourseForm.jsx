import { useState } from "react";

const EMPTY_FORM = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

const FIELDS = [
  { name: "code", label: "Code", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "department", label: "Department", type: "text" },
  { name: "credits", label: "Credits", type: "number" },
  { name: "capacity", label: "Capacity", type: "number" },
  { name: "description", label: "Description", type: "textarea" },
];

export function AddCourseForm({ onAdd }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fieldErrors = error?.fieldErrors ?? {};

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onAdd({
        code: values.code,
        title: values.title,
        department: values.department,
        credits: Number(values.credits),
        capacity: Number(values.capacity),
        description: values.description === "" ? null : values.description,
      });
      setValues(EMPTY_FORM);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Add a course</h2>
      <form onSubmit={handleSubmit}>
        {FIELDS.map(({ name, label, type }) => {
          const inputId = `course-${name}`;
          const errorId = `course-${name}-error`;
          const fieldError = fieldErrors[name];
          const props = {
            id: inputId,
            name,
            value: values[name],
            onChange: (event) =>
              setValues({ ...values, [name]: event.target.value }),
            "aria-invalid": fieldError ? "true" : undefined,
            "aria-describedby": fieldError ? errorId : undefined,
          };
          return (
            <div key={name} className="field">
              <label htmlFor={inputId}>{label}</label>
              {type === "textarea" ? (
                <textarea {...props} />
              ) : (
                <input type={type} {...props} />
              )}
              {fieldError && (
                <div id={errorId} className="field-error">
                  {fieldError}
                </div>
              )}
            </div>
          );
        })}
        {error && (
          <p role="alert" className="form-error">
            {error.message}
          </p>
        )}
        <button type="submit" disabled={submitting}>
          Add course
        </button>
      </form>
    </section>
  );
}