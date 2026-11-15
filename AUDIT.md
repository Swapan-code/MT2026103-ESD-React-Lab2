# Audit — React Lab 2

Part of what you submit. Fill in sections 0–4 **before** you ask the AI to change anything:
deciding what's wrong is your job, not the AI's. The sheet you audit against is "The Shape
of a Good React Slice" — section 08 of the lab doc.

Point at code as `file:line`, e.g. `CoursesPage.jsx:14`.

---

## 0. What came back

| File the AI gave you        | What's in it (components, hooks)                                                                    | Lines |
| --------------------------- | --------------------------------------------------------------------------------------------------- | ----- |
| src/courses/useCourses.js   | hook `useCourses`: course list, load state, all form state, `changeField`, `submit`                 | 98    |
| src/courses/CoursesView.jsx | `CoursesView` (list + the whole form), an inner `CourseList` component, a `FIELDS` array, 2 helpers | 97    |
| src/courses/CoursesPage.jsx | `CoursesPage`: calls the hook and passes 9 props to the View                                        | 20    |

- Does it run? List loads / valid add appears in order / duplicate code shows the 409
  message / bad input shows fieldErrors under the inputs: **Yes to all four.** The end-to-end
  `CoursesPage` tests (4 of 4) pass, and they check exactly these four behaviours. It works; the
  problem is its shape, not its behaviour.
- Requests in the Network tab — on page load: **2 `GET /api/courses`** (`main.jsx` uses
  `StrictMode`, which runs the effect twice in development; the `ignore` flag at
  `useCourses.js:45-58` drops the first answer) ; per add: **1** (the `POST` only: the 201 body is
  inserted into the list at `useCourses.js:75`, with no reload).
- `npm test` before any fix: **31 passed / 31 failed.** Which test files fail? `useCourses`
  (10/10), `CoursesView` (8/8), `AddCourseForm` (11/11) and `fieldErrors` (2/2). Passing:
  `CoursesPage` (4/4), the search tests and `client.test.js`.
  - `useCourses`: the hook returns `loading` / `loadError`, not `status` / `error`, and no `addCourse`.
  - `CoursesView`: it crashes at `CoursesView.jsx:66` (`fieldErrors` is undefined) because it
    expects form props that the tests don't pass: the form is inside the View.
  - `AddCourseForm` and `fieldErrors`: the AI never created `AddCourseForm`, so the placeholder
    still throws "TODO".

## 1. Part A — walk the allowed list

Is each element present, and in the right place?

| Element (the sheet, Part A)                                  | Where it is in the AI's code (`file:line`, or "missing")                                                                        | Right place? If not, where should it be?                                                                                                                                                                                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One View component that only renders                         | `CoursesView.jsx:41` (`CoursesView`)                                                                                            | **Partly.** It renders, but it also contains the whole form: controlled inputs (`:64-85`), `handleSubmit` (`:52-55`), the error message and button (`:86-93`). The form should be its own component, `AddCourseForm`, and the View should only render the list. |
| Fetch + logic in a separate hook or module                   | `useCourses.js:34` (`useCourses`), `apiFetch` calls at `:46` and `:71`                                                          | **Yes** for the fetch. But the hook also carries form logic: `changeField` (`:62-64`), `submit` (`:66-86`), `toCourseRequest` (`:23-32`). That belongs to the form.                                                                                             |
| `useState` for the course list, at the right level           | `useCourses.js:35`                                                                                                              | **Yes.** The list is shared by the page, so it lives in the hook.                                                                                                                                                                                               |
| `useState` for the form's inputs, at the right level         | `useCourses.js:39` (`values`)                                                                                                   | **No.** Only the form uses the inputs, so they belong inside `AddCourseForm`, not in the page-level hook.                                                                                                                                                       |
| `useEffect` — for the initial fetch only (with a cleanup)    | `useCourses.js:44-60` (`[]` at `:60`, `ignore` flag at `:45`, `:48`, `:53`, cleanup at `:57-59`)                                | **Yes.** Loads once, drops a stale answer. Correct and needs no change.                                                                                                                                                                                         |
| Props down, callbacks up (the form raises "add this course") | `CoursesPage.jsx:7-17` (9 props); callbacks `onChangeField` (`:15`) and `onSubmit` (`:16`)                                      | **No.** The callbacks are keystroke-level (`onChangeField`) and the form has no `onAdd`. The form should raise one `onAdd(courseRequest)`; the page should pass the View `courses`/`status`/`error` and the form `addCourse`.                                   |
| `.map` to render the list, with a stable `key`               | `CoursesView.jsx:26-27` (`key={course.id}`); `:64`/`:75` (`key={name}` on the fields)                                           | **Yes.** `course.id` is stable and unique; no `key={index}`.                                                                                                                                                                                                    |
| Loading / error / empty states, from one `status`            | empty: `CoursesView.jsx:23`; loading: `useCourses.js:36`, `CoursesView.jsx:21`; error: `useCourses.js:37`, `CoursesView.jsx:22` | **No.** There is no single `status`: two separate fields (`loading` boolean, `loadError` string) can disagree. Should be one `status` (`"loading" \| "ready" \| "error"`) plus `error`.                                                                         |

## 2. Part B — scan for "not yet"

Search the files (VS Code: Ctrl/Cmd+Shift+F) for each one.

| Not yet                                                                   | Found? (`file:line`)                                                                                                                                                                                       | What it does in _this_ slice                                                                                                                                                                    | Cut, or keep — and why |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `useMemo`                                                                 | No                                                                                                                                                                                                         | —                                                                                                                                                                                               | —                      |
| `useCallback`                                                             | No                                                                                                                                                                                                         | —                                                                                                                                                                                               | —                      |
| `useReducer`                                                              | No                                                                                                                                                                                                         | —                                                                                                                                                                                               | —                      |
| `useRef`                                                                  | No                                                                                                                                                                                                         | —                                                                                                                                                                                               | —                      |
| Context (`createContext`, `useContext`)                                   | No                                                                                                                                                                                                         | —                                                                                                                                                                                               | —                      |
| A data-fetching library, or `axios`, or raw `fetch` instead of `apiFetch` | No (`apiFetch` is used at `useCourses.js:46` and `:71`; imported at `:2`)                                                                                                                                  | —                                                                                                                                                                                               | —                      |
| TypeScript (types, interfaces, `.ts`/`.tsx`)                              | No                                                                                                                                                                                                         | —                                                                                                                                                                                               | —                      |
| Anything else nobody taught you (name it)                                 | Not a hook, but extra abstraction: `CourseList` (`CoursesView.jsx:20`), `FIELDS` array + `{...common}` spread (`CoursesView.jsx:1-8`, `:64-85`), `creditsText` (`:16`), `toNumber` (`useCourses.js:19-21`) | `CourseList`: splits the list from the page for no reuse. `FIELDS`: generates the six inputs from config. `creditsText`: writes "1 credit". `toNumber`: sends `null` for an empty number field. | See section 3 and 4.   |

None of the listed "not yet" hooks appear: the AI used only `useState` and `useEffect`.

## 3. The rule — every hook and every component split

One row for **each** `useState`, `useEffect` and custom hook call, and for **each**
component. Say what it does _in this slice_. "The AI added it" and "just in case" are not
answers — if you can't name its job, the decision is "cut".

| Hook call or component (`file:line`)               | What earns it here? (one sentence)                                                                                               | Keep / cut / move (to where)                                                                                     |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `useState` `courses` (`useCourses.js:35`)          | Holds the list that is shown and that a successful add inserts into.                                                             | **Keep** (in the hook).                                                                                          |
| `useState` `loading` (`useCourses.js:36`)          | Says "still waiting", but only one half of the load state.                                                                       | **Cut**: merge with `loadError` into a single `status` (`"loading" \| "ready" \| "error"`).                      |
| `useState` `loadError` (`useCourses.js:37`)        | Holds the message when the load fails, but is separate from `loading`, so the two can disagree.                                  | **Cut / rename**: becomes `error` (a string or `null`), alongside `status`.                                      |
| `useState` `values` (`useCourses.js:39`)           | The six controlled inputs. Only the form reads them.                                                                             | **Move** to `AddCourseForm.jsx`.                                                                                 |
| `useState` `submitting` (`useCourses.js:40`)       | Disables the button while the POST is running. Only the form needs it.                                                           | **Move** to `AddCourseForm.jsx`.                                                                                 |
| `useState` `submitError` (`useCourses.js:41`)      | Holds the message shown above the button. Only the form shows it.                                                                | **Move** to `AddCourseForm.jsx`, and keep the whole `ApiError` (not just its message).                           |
| `useState` `fieldErrors` (`useCourses.js:42`)      | Holds per-field reasons, but they are already inside the error (`error.fieldErrors`), so this is a copy of data we already have. | **Cut**: compute it from the stored error in `AddCourseForm`.                                                    |
| `useEffect` (`useCourses.js:44-60`)                | Loads the list once when the page appears; cleanup drops a stale answer (StrictMode runs it twice).                              | **Keep** (in the hook); change it to set one `status`.                                                           |
| Custom hook `useCourses` (`useCourses.js:34`)      | Keeps fetch and list logic out of the View so the View only renders.                                                             | **Keep**, but slim it to `{ courses, status, error, addCourse }`.                                                |
| `changeField` (`useCourses.js:62-64`)              | Updates one input's value. It's the form's job, not the page's.                                                                  | **Move** (the form's own `onChange` handler).                                                                    |
| `submit` (`useCourses.js:66-86`)                   | Does the POST, but also owns the form's pending/error/clear logic and swallows the error at `:77-81`.                            | **Move** the form part into `AddCourseForm`; **keep** only the POST + list insert as `addCourse` that re-throws. |
| Component `CoursesPage` (`CoursesPage.jsx:4`)      | Wires the hook to the View: one hook call, props down.                                                                           | **Keep**, wiring only: `courses/status/error` → View, `addCourse` → form.                                        |
| Component `CoursesView` (`CoursesView.jsx:41`)     | Renders the list states. Today it also renders the form.                                                                         | **Keep**, but shrink to `{ courses, status, error }` and list-only.                                              |
| Component `CourseList` (`CoursesView.jsx:20`)      | Renders the loading / error / empty / list states. Used once, directly inside `CoursesView`, so it adds a layer with no reuse.   | **Cut**: fold its body into `CoursesView` once the form has moved out.                                           |
| New component `AddCourseForm` (does not exist yet) | Owns the six inputs, submitting and error, and raises one `onAdd(courseRequest)`.                                                | **Add** (`AddCourseForm.jsx`).                                                                                   |

## 4. Decisions — before any fix prompt

- I will **cut**:
  - the separate `loading` and `loadError` booleans → one `status` plus `error` (`useCourses.js:36-37`)
  - the stored `fieldErrors` state (`useCourses.js:42`) → read `error.fieldErrors` from the stored error
  - the inner `CourseList` component (`CoursesView.jsx:20-39`), folded into `CoursesView`
  - `creditsText` (`CoursesView.jsx:16-18`): prompt 1 only defines "N credits" and the "Full" / "1 seat left" wording for seats, so I'll render `{credits} credits`
  - `toNumber` returning `null` for empty fields (`useCourses.js:19-21`): prompt 1 says send what was typed as numbers and let the server decide, so use `Number(...)`
- I will **move** (from → to):
  - `values`, `submitting`, `submitError`, `changeField`, `handleSubmit` and the form JSX (`useCourses.js:39-42`, `:62-86`; `CoursesView.jsx:52-55`, `:57-94`) → a new `AddCourseForm.jsx` with its own state
  - `toCourseRequest` (`useCourses.js:23-32`) → into the form's submit (it builds the request it hands to `onAdd`)
  - the POST + list insert (`useCourses.js:70-76`) → stays in the hook as `addCourse(courseRequest)`
- I will **add** (missing from the AI's version):
  - `src/courses/AddCourseForm.jsx` with `onAdd`
  - a single `status` and an `error` string from the hook, and `addCourse` that re-throws the `ApiError`
  - `aria-describedby` on each invalid input, pointing to its message's `id` (the AI only set `aria-invalid`, `CoursesView.jsx:72`; the message at `:79` has no `id`)
  - `CoursesPage` that passes `courses`/`status`/`error` to the View and `addCourse` to the form
- Other smells I found (state stored that could be computed, a reload after add, browser
  validation, `key={index}`, swallowed errors…):
  - **Swallowed error:** `submit` catches the `ApiError` (`useCourses.js:77-81`) instead of re-throwing it for the form to show; the contract says `addCourse` must throw the same `ApiError`.
  - **Stored state that could be computed:** `fieldErrors` (`useCourses.js:42`) duplicates `error.fieldErrors`.
  - **Nine props from page to View** (`CoursesPage.jsx:7-17`) because the form's state lives in the wrong place.
  - **Extra behaviour not in the spec:** `toNumber` sends `null` (`useCourses.js:20`) and `creditsText` writes "1 credit" (`CoursesView.jsx:17`).
  - **Config-driven fields:** the `FIELDS` array and `{...common}` spread (`CoursesView.jsx:1-8`, `:64-85`) generate the form from data. It works, but it is harder to read than six labelled inputs.
  - **Good, to keep:** `key={course.id}` (`:27`), no reload after add (`useCourses.js:75`), `ignore` cleanup (`useCourses.js:45-59`), no "not yet" hooks, and `apiFetch` used instead of raw `fetch`.

---

## 5. Strip check (section 14 of the doc)

For each "not yet" item you removed — one at a time:

| Removed | `npm test` after | The app after (loads / adds / shows errors) |
| ------- | ---------------- | ------------------------------------------- |
|         |                  |                                             |

If the AI used none, say so here, and say which rule in prompt 1 you think prevented it.

The AI used none of the "not yet" items, so there was nothing to strip. I think this rule in
prompt 1 prevented it: "Use only useState and useEffect. Do not use useMemo, useCallback,
useReducer, useRef, or context."

## 6. Before / after

|                              | Before (the AI's first version)                                                        | After (yours)                                                                                                                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Files and components         | 3 files: `CoursesPage`, `CoursesView` (list + form), inner `CourseList`, plus the hook | 4 files: `useCourses.js` (43 lines), `CoursesView.jsx` (27), `AddCourseForm.jsx` (93), `CoursesPage.jsx` (15); 3 components (`CoursesPage`, `CoursesView`, `AddCourseForm`) plus the hook; no inner `CourseList` |
| `useState` calls (and where) | 7, all in `useCourses.js` (`:35`, `:36`, `:37`, `:39`, `:40`, `:41`, `:42`)            | 6: 3 in `useCourses.js` (`courses`, `status`, `error`) and 3 in `AddCourseForm.jsx` (`values`, `submitting`, `error`)                                                                                            |
| `useEffect` calls            | 1 (`useCourses.js:44`)                                                                 | 1 (in `useCourses.js`, with `[]` and an `ignore` cleanup)                                                                                                                                                        |
| "Not yet" items              | 0                                                                                      | 0                                                                                                                                                                                                                |
| Requests: on load / per add  | 2 (StrictMode) / 1                                                                     | 2 (StrictMode) / 1 (unchanged: the same effect, and the 201 body is still inserted with no reload)                                                                                                               |
| `npm test`                   | 31 passed / 31 failed                                                                  | 62 passed / 0 failed (stretch: 4 passed)                                                                                                                                                                         |

## 7. Two sentences

- One thing the AI got right that you might not have thought of: The AI's first version already inserted the 201 response into a new sorted array instead of reloading the whole list after an add, and it had an `ignore` flag in the effect cleanup, so the page made only one POST per add and a stale answer from StrictMode's second effect run was dropped.
- One thing you will never accept from an AI without checking again: A draft that passes its end-to-end test can still have the wrong shape, because the first version passed all 4 `CoursesPage` tests while the form's state sat in the page hook and the form was inside the View, even though prompt 1 said the View only renders, so I will always audit the structure and not just run the app.
