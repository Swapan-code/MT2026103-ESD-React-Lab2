# Prompt log — React Lab 2

Part of what you submit. It shows _how_ you used AI: did you hand it the contract and the
rules, or type "make it work"? Fill it in **as you go**, not from memory at the end.

- Name and roll number: Swapan, MT2026103
- AI tool and plan (e.g. ChatGPT free, Gemini, Claude free, Copilot): Claude free

**Log every prompt you send, in order — including the ones that didn't help.** Paste each
prompt in full. One exception: if you pasted CONTRACT.md's prompt 1 unchanged, write
"CONTRACT.md prompt 1, unchanged". Summarise each reply; don't paste whole files.

---

## Prompt 1 — generate

**Sent:**

```text
CONTRACT.md prompt 1, unchanged
```

**What came back:** (which files; which hooks it used; anything from the "not yet" list;
anything it did that the contract didn't ask for)

```text
Three files: useCourses.js, CoursesView.jsx, CoursesPage.jsx. It used only useState and useEffect, with nothing from the "not yet" list. The hook holds the course list plus all the form state (the six input values, submitting, submit error, field errors) and returns changeField and submit. CoursesView renders the list and the whole form, and has an inner CourseList component and a FIELDS array. CoursesPage passes nine props from the hook into the View. It did not create a separate AddCourseForm. It used Number() for credits and capacity but sends null for an empty number field. It added "1 credit" singular wording that the contract didn't ask for.
```

**Did it run?** (`npm run dev`: list loads? add works? 409 shown? fieldErrors shown?
`npm test`: ** passed / ** failed)

```text
Yes, it runs. The list loads, a valid add appears in code order, a duplicate code shows "Course code already exists", and bad input shows the reasons under the fields (the 4 CoursesPage tests check these four behaviours and pass 4/4). npm test: 31 passed / 31 failed. Failing: useCourses (the hook returns loading/loadError instead of status/error, and has no addCourse), CoursesView (it contains the form and crashes without the form props), AddCourseForm and fieldErrors (the AI made no AddCourseForm, so the placeholder still throws). CoursesPage passes 4/4. It works, but its shape does not match the contract.
```

**What I did with it:** I committed it unchanged as the first draft, then audited it
against the Part A / Part B sheet before asking for any change (see AUDIT.md sections 0–4).
The audit found the form's state in the wrong place (inside the page hook), no single
`status`, a stored `fieldErrors` that duplicates `error.fieldErrors`, a swallowed error in
`submit`, an inner `CourseList` component, and missing `aria-describedby`. None of the "not
yet" hooks were used.

---

## Prompt 2 — fix, from my audit

**Why I sent it:** To carry out the decisions in AUDIT.md section 4: cut `loading` /
`loadError` (one `status` plus `error`), cut the stored `fieldErrors`, cut `CourseList`,
`creditsText` and `toNumber`; move all form state and JSX into a new `AddCourseForm` that
raises `onAdd`; add `aria-describedby`; keep the `ignore` cleanup, `key={course.id}` and no
reload after add. I sent it in the same chat as prompt 1, together with CONTRACT.md §4 (the
shape the tests check).

**Sent:**

```text
Here is my audit of your first version. Please restructure it to the shape below.
Cut: the separate `loading` and `loadError` states (use one `status` of `"loading"`, `"ready"` or `"error"` plus an `error` message string), the stored `fieldErrors` state (read it from the stored error), the inner `CourseList` component (fold it into `CoursesView`), `creditsText` (just render `{credits} credits`), and `toNumber` (use `Number(...)`).
Move: all form state and the form JSX into a new `AddCourseForm`, which raises one `onAdd(courseRequest)`.
Add: `aria-describedby` linking each invalid input to its message's `id`.
Keep: the `ignore` cleanup, `key={course.id}`, and no reload after add.

[CONTRACT.md §4 pasted in full: the four files useCourses.js, CoursesView.jsx, AddCourseForm.jsx and CoursesPage.jsx, with their names, props and rules]

Keep the rules from prompt 1: only useState and useEffect, no other hooks, and always apiFetch, never fetch.
Headings: <h1>Courses</h1> goes in CoursesPage, and the <h2>Add a course</h2> goes inside AddCourseForm. The View renders only the list.
Reply with each file in full, its path on the first line.
```

**What came back:**

```text
Four files in src/courses/. useCourses.js: one status ("loading" | "ready" | "error") plus an error string, an effect with [] and an ignore flag, and addCourse that POSTs with apiFetch, inserts the 201 body into a new sorted array and does not catch errors. CoursesView.jsx: renders only (loading / error / empty / list, key={course.id}), with a small seatsText helper and no inner component. AddCourseForm.jsx: owns values, submitting and error; Number() for credits and capacity; description null when empty; fieldErrors read from the stored error; aria-invalid and aria-describedby with a matching id; role="alert" on the form message; never calls fetch. CoursesPage.jsx: calls the hook, renders the h1, the View and the form. It used only useState and useEffect. It kept the FIELDS array that generates the six inputs.
```

I ran it: **npm test 62 passed / 0 failed** (9 test files), and the stretch test 4 passed.

**What I kept, and what I rejected:**

```text
Kept: all four files as written, because every decision in my audit is in them and the tests pass. I kept seatsText in the view because it is a plain function and not a component, and the contract defines the "Full" / "1 seat left" wording. Not changed, but noted: AddCourseForm still uses a FIELDS array to generate the inputs; I decided to keep it because it removes six copies of the same label/input/error block, and it is small enough to read. onChange uses setValues({ ...values, [name]: ... }) instead of the functional form (setValues((v) => ...)); it works here because each keystroke renders before the next, but the functional form would be safer.
Rejected: nothing needed rejecting; no extra hooks, files or libraries were added.
```

---

## Afterwards

- How many prompts did the whole feature take? **2** (prompt 1: the first draft, prompt 2: the fix from my audit). No prompt had to be repeated.
- Which of your prompts would you write differently now, and how? In prompt 2 I added a line saying where each heading goes, because the first draft had both headings in the View and the tests expect them in different places. I would have put that in prompt 1's rules from the start, so the first draft would not have needed it.
- One thing the rules in prompt 1 prevented (or failed to prevent): They prevented every "not yet" hook: the AI used only useState and useEffect, no useMemo, useCallback or useRef. They failed to prevent the wrong shape: "one View component that only renders" was ignored, because the form ended up inside the View and the form's state in the page hook.
