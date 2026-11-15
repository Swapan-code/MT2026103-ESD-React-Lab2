import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

const EMPTY_FORM = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

function byCode(a, b) {
  if (a.code < b.code) return -1;
  if (a.code > b.code) return 1;
  return 0;
}

function toNumber(text) {
  return text === "" ? null : Number(text);
}

function toCourseRequest(values) {
  return {
    code: values.code,
    title: values.title,
    department: values.department,
    credits: toNumber(values.credits),
    capacity: toNumber(values.capacity),
    description: values.description === "" ? null : values.description,
  };
}

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [values, setValues] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let ignore = false;
    apiFetch("/api/courses")
      .then((list) => {
        if (ignore) return;
        setCourses(list);
        setLoading(false);
      })
      .catch((error) => {
        if (ignore) return;
        setLoadError(error.message);
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  function changeField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});
    try {
      const created = await apiFetch("/api/courses", {
        method: "POST",
        body: toCourseRequest(values),
      });
      setCourses((current) => [...current, created].sort(byCode));
      setValues(EMPTY_FORM);
    } catch (error) {
      setSubmitError(error.message);
      if (error.status === 400 && error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return {
    courses,
    loading,
    loadError,
    values,
    submitting,
    submitError,
    fieldErrors,
    changeField,
    submit,
  };
}
