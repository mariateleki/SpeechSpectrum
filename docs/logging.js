/* SpeechSpectrum study telemetry helper.
 *
 * Provides:
 *   - window.ssSessionId           : stable per-tab UUID; injected into every event
 *   - patched navigator.sendBeacon : adds session_id, queues failures, opportunistically flushes
 *   - window.ssLogStudyVisit()     : log a study_visit event on initial page load
 *   - window.ssLogPageView(page)   : log a page_view event when a step is entered
 *   - window.ssLogTerminal(payload): fetch+keepalive for terminal events (more reliable than sendBeacon)
 *
 * Failed sends are stashed in localStorage and re-tried on the next event,
 * on each page load, and every 30s while a page is open.
 */
(function () {
  var SHEETS_WEBHOOK_URL =
    'https://script.google.com/macros/s/AKfycbzfwr4PmlCy5MWiQB1Lk52V2eq61QKkiSU9x74LC9C5m8SzeBEKrRiu1Vnb-vD1ovlRkA/exec';
  var QUEUE_KEY = 'ss_log_queue';
  var SESSION_KEY = 'ss_session_id';

  function uuid() {
    return 'sxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/x/g, function () {
      return Math.floor(Math.random() * 16).toString(16);
    });
  }

  var sessionId;
  try {
    sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = uuid();
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
  } catch (e) {
    sessionId = uuid();
  }
  window.ssSessionId = sessionId;

  function readQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function writeQueue(arr) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(arr.slice(-500))); }
    catch (e) {}
  }
  function enqueue(payloadString) {
    var q = readQueue();
    q.push({ data: payloadString, queued_at: new Date().toISOString() });
    writeQueue(q);
  }
  function flushQueue() {
    var q = readQueue();
    if (!q.length) return;
    var remaining = [];
    q.forEach(function (item) {
      var ok = false;
      try { ok = origSendBeacon(SHEETS_WEBHOOK_URL, item.data); }
      catch (e) {}
      if (!ok) remaining.push(item);
    });
    writeQueue(remaining);
  }
  window.ssFlushQueue = flushQueue;
  window.ssQueueSize = function () { return readQueue().length; };

  // Monkey-patch sendBeacon to inject session_id and queue on failure.
  var origSendBeacon = navigator.sendBeacon.bind(navigator);
  navigator.sendBeacon = function (url, data) {
    var augmented = data;
    if (typeof data === 'string') {
      try {
        var parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          if (!parsed.session_id) parsed.session_id = sessionId;
          augmented = JSON.stringify(parsed);
        }
      } catch (e) { /* not JSON — leave as-is */ }
    }
    var ok = false;
    try { ok = origSendBeacon(url, augmented); } catch (e) {}
    if (!ok) {
      enqueue(typeof augmented === 'string' ? augmented : JSON.stringify(augmented));
    }
    // Opportunistic flush whenever any event fires
    try { flushQueue(); } catch (e) {}
    return ok;
  };

  // Terminal events — fetch + keepalive returns a real promise so we know it
  // hit the server. Falls back to the queue on failure.
  window.ssLogTerminal = function (payload) {
    var body = JSON.stringify(Object.assign({ session_id: sessionId }, payload));
    try {
      return fetch(SHEETS_WEBHOOK_URL, {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: body
      }).catch(function () { enqueue(body); });
    } catch (e) {
      enqueue(body);
      return Promise.resolve();
    }
  };

  // study_visit: fired on initial page load, before any user action.
  window.ssLogStudyVisit = function () {
    var params = {};
    try {
      new URLSearchParams(window.location.search).forEach(function (v, k) { params[k] = v; });
    } catch (e) {}
    var prolificFromUrl = params.PROLIFIC_PID || params.pid || '';
    navigator.sendBeacon(SHEETS_WEBHOOK_URL, JSON.stringify({
      timestamp: new Date().toISOString(),
      event_type: 'study_visit',
      prolific_id: prolificFromUrl,
      assigned_condition: '',
      question_id: 'study_visit',
      question_text: 'initial page load',
      response: window.location.pathname,
      extra: JSON.stringify({
        url_params: params,
        referrer: document.referrer,
        ua: navigator.userAgent.slice(0, 200),
        viewport: window.innerWidth + 'x' + window.innerHeight,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      })
    }));
  };

  // page_view: fired when a study step is entered (entry-side complement to
  // the existing exit-side page_timing).
  window.ssLogPageView = function (page, extra) {
    var pid = (typeof window.__ssPid === 'string') ? window.__ssPid : '';
    var cond = (typeof window.__ssCondition === 'string') ? window.__ssCondition : '';
    navigator.sendBeacon(SHEETS_WEBHOOK_URL, JSON.stringify({
      timestamp: new Date().toISOString(),
      event_type: 'page_view',
      prolific_id: pid,
      assigned_condition: cond,
      question_id: page,
      question_text: 'page entered: ' + page,
      response: '',
      extra: extra ? JSON.stringify(extra) : ''
    }));
  };

  // Flush whatever's stuck in the queue on every page load.
  try { flushQueue(); } catch (e) {}
  setInterval(flushQueue, 30000);
})();
