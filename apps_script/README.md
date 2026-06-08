# Apps Script — study-logging endpoint

The Google Apps Script that receives `sendBeacon` / `fetch` POSTs from the
website and writes each event as a row to the logging Google Sheet.

The script itself lives on Google's servers (Extensions → Apps Script from
the Sheet). [`Code.gs`](Code.gs) is the local source of truth for
diffs / review / history. The two are kept in sync by hand for now.

## Schema (one column per field, in order)

| col | name | source | notes |
| --- | --- | --- | --- |
| A | `server_timestamp` | written by Apps Script | authoritative |
| B | `timestamp` | client | ISO-8601; may drift if client clock is wrong |
| C | `event_type` | client | e.g. `condition_assignment`, `survey_response`, `page_view` |
| D | `prolific_id` | client | empty for pre-PID events (`study_visit`, `irb_consent`, consent `page_timing`) |
| E | `assigned_condition` | client | e.g. `verbatim / A,B,C,D` |
| F | `latin_square_order` | client | A / B / C / D (added Pilot 2) |
| G | `session_id` | client | per-tab UUID injected by `docs/logging.js` (added Pilot 2) |
| H | `question_id` | client | varies per event |
| I | `question_text` | client | |
| J | `response` | client | |
| K | `extra` | client | JSON blob for everything else |

The first row of the Sheet should have those headers in this order so
exports look right. The script writes by position, not by header name.

## Deploy / update

1. Open the linked Google Sheet.
2. **Extensions → Apps Script**.
3. Paste the contents of [`Code.gs`](Code.gs) into the editor.
4. Save (⌘S / Ctrl-S).
5. **Deploy → Manage deployments → Edit (pencil) → New version → Deploy**.
   The public URL stays the same.

The `LockService.getScriptLock()` wrapper serialises concurrent writes —
without it, two simultaneous beacons can race on `appendRow` and one row
gets silently dropped. This was the cause of the missing `study_complete`
in Pilot 1.

## Schema changes — how to add a column

1. Add the column header to the Sheet (and confirm everything to its right
   still makes sense, since the script writes by position).
2. Add the field to the `appendRow([...])` array in `Code.gs`, in the same
   position.
3. Paste into the Apps Script editor and redeploy.

## Optional — use `clasp` instead of copy-paste

```bash
npm install -g @google/clasp
clasp login
cd apps_script
clasp clone <SCRIPT_ID>     # one-time, replaces this README's source with the live one
# edit Code.gs locally
clasp push                  # push to Google
```

Where `<SCRIPT_ID>` is the long string between `/d/` and `/edit` in the
Apps Script URL.
