import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

function byCode(a, b) {
  if (a.code < b.code) return -1;
  if (a.code > b.code) return 1;
  return 0;
}

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    apiFetch("/api/courses")
      .then((list) => {
        if (ignore) return;
        setCourses(list);
        setStatus("ready");
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function addCourse(courseRequest) {
    const created = await apiFetch("/api/courses", {
      method: "POST",
      body: courseRequest,
    });
    setCourses((current) => [...current, created].sort(byCode));
    return created;
  }

  return { courses, status, error, addCourse };
}
