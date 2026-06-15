// Google Sheets webhook URL — replace with your deployed Apps Script URL
var SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzfwr4PmlCy5MWiQB1Lk52V2eq61QKkiSU9x74LC9C5m8SzeBEKrRiu1Vnb-vD1ovlRkA/exec';

(function() {
  // Read Prolific ID and condition from URL params or sessionStorage
  var params = new URLSearchParams(window.location.search);
  var prolificId = params.get('pid') || sessionStorage.getItem('ss_prolific_id') || '';
  var condition = sessionStorage.getItem('ss_condition') || '';

  // Log to Google Sheets
  function logToSheets(eventType, data) {
    var payload = Object.assign({
      timestamp: new Date().toISOString(),
      event_type: eventType,
      prolific_id: prolificId,
      assigned_condition: condition
    }, data || {});

    if (SHEETS_WEBHOOK_URL && SHEETS_WEBHOOK_URL !== 'YOUR_APPS_SCRIPT_URL_HERE') {
      navigator.sendBeacon(SHEETS_WEBHOOK_URL, JSON.stringify(payload));
    } else {
      console.log('[SpeechSpectrum log]', payload);
    }
  }

  // Make logToSheets available globally for demo.html style tracking
  window.ssLog = logToSheets;

  // Render survey questions into a container element
  function renderSurvey(containerId) {
    var container = document.getElementById(containerId);
    if (!container || typeof QUESTIONS === 'undefined') return;

    var html = '<form id="ss-survey-form">';
    html += '<h2 class="survey-title">Survey</h2>';

    QUESTIONS.forEach(function(q, idx) {
      html += '<div class="survey-question">';
      html += '<p class="question-text"><span class="question-num">' + (idx + 1) + '.</span> ' + q.text + '</p>';

      if (q.type === 'multiple_choice') {
        q.options.forEach(function(opt) {
          var inputId = q.id + '_' + opt.replace(/\s+/g, '_').toLowerCase();
          html += '<label class="option-label" for="' + inputId + '">';
          html += '<input type="radio" id="' + inputId + '" name="' + q.id + '" value="' + opt + '" required>';
          html += '<span class="option-text">' + opt + '</span>';
          html += '</label>';
        });
      } else if (q.type === 'free_response') {
        html += '<textarea name="' + q.id + '" rows="3" placeholder="Type your answer here..."></textarea>';
      }

      html += '</div>';
    });

    html += '<button type="submit" class="submit-btn" id="ss-submit-btn">Submit Survey</button>';
    html += '</form>';
    html += '<div id="ss-thank-you" style="display:none;">';
    html += '<div class="thank-you-msg">';
    html += '<h2>Thank you!</h2>';
    html += '<p>Your responses have been recorded. You may now return to Prolific and mark your submission as complete.</p>';
    html += '</div>';
    html += '</div>';

    container.innerHTML = html;

    // Handle form submission
    document.getElementById('ss-survey-form').addEventListener('submit', function(e) {
      e.preventDefault();

      var form = e.target;
      var allAnswered = true;

      // Check required multiple choice questions
      QUESTIONS.forEach(function(q) {
        if (q.type === 'multiple_choice') {
          var selected = form.querySelector('input[name="' + q.id + '"]:checked');
          if (!selected) allAnswered = false;
        }
      });

      if (!allAnswered) {
        alert('Please answer all multiple choice questions before submitting.');
        return;
      }

      // Collect and log each response
      QUESTIONS.forEach(function(q) {
        var response = '';
        if (q.type === 'multiple_choice') {
          var selected = form.querySelector('input[name="' + q.id + '"]:checked');
          response = selected ? selected.value : '';
        } else if (q.type === 'free_response') {
          response = form.querySelector('textarea[name="' + q.id + '"]').value.trim();
        }

        logToSheets('survey_response', {
          question_id: q.id,
          question_text: q.text,
          response: response
        });
      });

      // Log survey completion
      logToSheets('survey_complete', {
        total_questions: QUESTIONS.length
      });

      // Show thank you, hide form
      document.getElementById('ss-survey-form').style.display = 'none';
      document.getElementById('ss-thank-you').style.display = 'block';
    });
  }

  // Auto-render if survey container exists (skip in view-only mode)
  var isViewOnly = new URLSearchParams(window.location.search).get('view') === 'true';
  if (!isViewOnly) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() { renderSurvey('survey-container'); });
    } else {
      renderSurvey('survey-container');
    }
  } else {
    // Hide survey side in view-only mode
    var surveyEl = document.querySelector('.survey-side');
    if (surveyEl) surveyEl.style.display = 'none';
    // Constrain transcript to readable width
    var layoutEl = document.querySelector('.page-layout');
    if (layoutEl) layoutEl.style.maxWidth = '800px';
    var transcriptEl = document.querySelector('.transcript-side');
    if (transcriptEl) { transcriptEl.style.flex = 'none'; transcriptEl.style.width = '100%'; }
    // Hide instructions banner and column header
    var instrEl = document.querySelector('.instructions');
    if (instrEl) instrEl.style.display = 'none';
    var colHeader = document.querySelector('.column-header');
    if (colHeader) colHeader.style.display = 'none';
  }
})();
