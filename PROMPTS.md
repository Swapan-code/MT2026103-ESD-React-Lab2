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
Three files: useCourses.js, CoursesView.jsx, CoursesPage.jsx. It used only useState and useEffect, with nothing from the “not yet” list. The hook holds the course list plus all the form state (the six input values, submitting, submit error, field errors) and returns changeField and submit. CoursesView renders the list and the whole form, and has an inner CourseList component and a FIELDS array. CoursesPage passes nine props from the hook into the View. It did not create a separate AddCourseForm. It used Number() for credits and capacity but sends null for an empty number field. It added “1 credit” singular wording that the contract didn’t ask for.
```

**Did it run?** (`npm run dev`: list loads? add works? 409 shown? fieldErrors shown?
`npm test`: ** passed / ** failed)

```text
npm run dev: list loads: yes/no; valid add (CS350) appears in order: yes/no; duplicate CS501 shows “Course code already exists”: yes/no; bad input (cs350, credits 9) shows reasons under the fields: yes/no. npm test: 31 passed / 31 failed. Failing: useCourses (hook returns loading/loadError instead of status/error), CoursesView (it contains the form and crashes without the form props), AddCourseForm and fieldErrors (the AI made no AddCourseForm, so the placeholder still throws). CoursesPage passes 4/4.
```

**What I did with it:**

---

## Prompt 2 —

**Why I sent it:** (for a fix prompt: which decision in AUDIT.md it carries out)

**Sent:**

```text

```

**What came back:**

**What I kept, and what I rejected:**

---

<!-- Copy the "Prompt 2" block for each further prompt. -->

## Afterwards

- How many prompts did the whole feature take?
- Which of your prompts would you write differently now, and how?
- One thing the rules in prompt 1 prevented (or failed to prevent):
