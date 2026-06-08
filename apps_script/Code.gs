/**
 * SpeechSpectrum study-logging endpoint.
 *
 * Lives at:
 *   https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
 *
 * Receives POSTs from docs/logging.js, docs/study.html, docs/task.html and
 * appends one row per event to the active sheet.
 *
 * Active target tab is controlled by ACTIVE_TAB below — bump it when moving
 * between study phases so historical pilots stay frozen on their own tabs.
 * Current tabs: Main, Pilot1, Pilot2.
 *
 * Column order in the sheet (left → right):
 *   server_timestamp | timestamp | event_type | prolific_id |
 *   assigned_condition | latin_square_order | session_id |
 *   question_id | question_text | response | extra
 *
 * The script writes the header row automatically the first time it
 * receives a POST for a fresh tab.
 *
 * Updates this file? Open the Google Sheet → Extensions → Apps Script,
 * paste the contents, save, then Deploy → Manage deployments → Edit
 * → New version → Deploy. The webhook URL stays the same.
 */

// --- Which tab receives new rows ---------------------------------------
// Bump this when moving between study phases. Past pilots live on their
// own (frozen) tabs and are not written to by this endpoint.
var ACTIVE_TAB = 'Pilot2';
// -----------------------------------------------------------------------

// Column order. The script writes by position; the headers below are also
// written to row 1 automatically the first time a fresh tab is written to.
var HEADERS = [
  'server_timestamp', 'timestamp', 'event_type', 'prolific_id',
  'assigned_condition', 'latin_square_order', 'session_id',
  'question_id', 'question_text', 'response', 'extra'
];

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
}

function doPost(e) {
  // Serialize concurrent requests so we don't race on appendRow.
  // Without this lock, two simultaneous beacons can overwrite each other.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);  // wait up to 10 seconds

    // Explicit sheet target — don't rely on getActiveSheet() (its default is
    // brittle in webapp context).
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(ACTIVE_TAB);
    if (!sheet) {
      throw new Error('Tab "' + ACTIVE_TAB + '" not found. Available: ' +
        ss.getSheets().map(function(s){ return s.getName(); }).join(', '));
    }
    ensureHeaders(sheet);
    var data = JSON.parse(e.postData.contents);

    // Handle batch requests (logBatchToSheets in task.html sends these)
    var rows = data.batch ? data.batch : [data];
    var now = new Date().toISOString();

    rows.forEach(function (row) {
      sheet.appendRow([
        now,                              // server_timestamp (authoritative)
        row.timestamp || '',              // client timestamp
        row.event_type || '',
        row.prolific_id || '',
        row.assigned_condition || '',
        row.latin_square_order || '',     // NEW (Pilot 2)
        row.session_id || '',             // NEW (Pilot 2)
        row.question_id || '',
        row.question_text || '',
        row.response || '',
        row.extra || ''
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', n: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Log to the script's execution log so failures aren't invisible.
    console.error('doPost failed:', err && err.stack || err);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}
