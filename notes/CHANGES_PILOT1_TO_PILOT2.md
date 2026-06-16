# Pilot 1 → Pilot 2 changelog

Summary of what changed between the two pilots: bugs we found, fixes we
shipped, new logging, and study-flow updates.

---

## Bugs we hit in Pilot 1 (and how Pilot 2 avoids them)

### Bug A: answers containing `"` got silently truncated

Each multiple-choice option was written into an HTML radio button like this:

```html
<input value="<option text here>">
```

If the option text contained a `"` character, the browser closed the value
attribute at that quote — so a participant who clicked an option like
`Both of them: Palmieri provides the word "recommended" and ...` had only
the prefix `Both of them: Palmieri provides the word ` saved. **Worse:**
on two questions, every option started with `"`, so saved values were
empty strings — we couldn't tell which option they picked at all.

**Pilot 1 impact:**
- 22 truncated responses recovered via prefix matching against the answer key
- 23 unrecoverable empty responses (all on `TranscrB_q6` + `TranscrC_q8`) →
  those two questions dropped from Pilot 1 accuracy analysis

**Fix:** all `"` in option text rewritten to `'` in `questions_raw/*.txt`,
and `docs/questions.js` rebuilt. Verified zero embedded `"` remain.

---

### Bug B: events sometimes never reached the spreadsheet

The website sends events to a Google Apps Script webhook. Two separate
problems made events disappear:

1. **The browser couldn't tell if the send failed.**
   `navigator.sendBeacon()` is fire-and-forget — it returns immediately
   without waiting for the server. If the network blip happened, the event
   was lost and we'd never know. One Pilot 1 participant reached the post-
   survey but their `study_complete` event never made it to the sheet.

2. **The server could overwrite its own rows.**
   When two beacons arrived at the same millisecond, both Apps Script
   invocations called `sheet.appendRow()` simultaneously. Google doesn't
   serialize these — one row would clobber the other. Same end result as #1
   (an event vanishes), but the cause is on Google's side, not the
   participant's.

**Fixes:**

- **Client-side retry queue** (`docs/logging.js`): if `sendBeacon` fails,
  the payload gets stashed in `localStorage` and re-sent on every
  subsequent event plus a 30-second timer.
- **`fetch(url, {keepalive: true})` for the critical `study_complete`
  event** — this actually returns a promise, so we know whether it
  succeeded.
- **`LockService` in the Apps Script** (`apps_script/Code.gs`): serializes
  concurrent `appendRow` calls so they can't clobber each other.

---

## What we now log that we didn't before

Pilot 1 had a black hole at the top of the funnel — consent events
weren't tied to any Prolific ID, so we couldn't see who consented but
then bailed. Several other useful signals were also missing.

| New field/event | What it answers |
|---|---|
| `session_id` (per-tab UUID, in every event) | Lets us link pre-PID rows (consent, page views) to a participant once they enter their ID later. |
| `study_visit` event on initial page load | Did the participant *ever* see the consent page? Captures URL params, referrer, user-agent, viewport, timezone. |
| `page_view` event on entry to each screen | Who reached this page, even if they didn't finish it? (Pilot 1 only logged exits.) |
| `transcript_scroll_summary`  | How far through the transcript did they read, and when? Includes max scroll depth + a progress timeline. |
| `latin_square_order` as a top-level column | Which of the 4 conversation orders did they get? Was nested in JSON, now a real column. |
| `server_timestamp` (written by Apps Script) | Authoritative timestamp — doesn't rely on the participant's clock being correct. |

---

## Study-flow changes

### Demographics page

- **Q4 (occupation)**: replaced our home-grown 5-option list with Prolific's
  21-option `employment-sector` taxonomy, so we can join self-reports with
  the Prolific demographic export.
- **Q5 (transcripts at work)**: reworded to "In your work, do you ever
  read written records of conversations or spoken exchanges in order to
  make a judgment or decision about what happened or what was said?"
- **Q6 (voice tech)**: added concrete examples — Siri, Google Assistant,
  Zoom auto-captions.

### Post-task pages

Pilot 1 had a single "Final Questions" page with both the realism ratings
and the required comprehension free-text. Pilot 2 splits it:

- **Page 5a — Last Transcript Recall**: the required comprehension
  free-text on its own screen, logged immediately. Captures the answer
  even if the participant abandons before the realism page.
- **Page 5b — A Few Final Questions**: the four realism ratings + an
  optional "what felt off" textarea.

### New completion code

Reusing **`CJ1Y2CQG`** (same as Pilot 1). Make sure Prolific is set to
the same code so completion submissions get matched.

---

## Payment

Pilot 1's $9 / 40-min estimate was based on a guess; the actual median
completion time was **51 minutes**, so the implied rate was only $10.50/hr.

Pilot 2:

| | Pilot 1 | Pilot 2 |
|---|---|---|
| Reward on Prolific | $9 | **$13** |
| Estimated time on Prolific | 40 min | **50 min** |
| Implied rate at median (51 min) | $10.50/hr | **$15.29/hr** |
| Implied rate at 75th pct (63 min) | $8.63/hr | $12.38/hr |

The Pilot 2 numbers stay above Prolific's $12/hr fair-pay threshold for
the median and 75th-percentile participant. The very slowest still dip
below, but that's hard to avoid with a long study.

---

## Pilot 1 data — flags for re-analysis

Things to know when reading the Pilot 1 EDA notebook:

1. **`TranscrB_q6` and `TranscrC_q8` dropped** from accuracy analysis
   (Bug A above — every option started with `"`, so saved values were
   empty strings, no recovery possible).
2. **22 responses recovered via prefix matching** in the scoring cell.
3. **7 participants who didn't reach the end** are filtered out at the
   top of the notebook (those whose data ends before `study_complete`
   or `post_survey`).
4. **3 manual exclusions** in Section 3 for rushed or low-accuracy
   participants (the table in Section 2 shows the speed-vs-accuracy
   case for each).

None of this applies to Pilot 2 — the bugs are fixed upstream.

---

## Small content fixes for Pilot 2

- **`TranscrA_q8`** (Davis — Cizauskas interrupting the church/volunteer
  section) now has its level explicitly set to **L4**. It was accidentally
  left off in Pilot 1: the raw file had a `-` placeholder where the L4
  marker should have been, so the question shows up with `level = '-'` in
  the Pilot 1 EDA tables. Cosmetic only — accuracy scoring was unaffected.
