# SpeechSpectrum Website

SpeechSpectrum demonstrates how the same speech can be transcribed in four different styles: **Verbatim**, **Non-Verbatim**, **Enhanced**, and **Bullet Points** — across three transcripts (TranscrA, TranscrB, TranscrC).

## Hub Page

The root page links to everything — the interactive demos and all standalone transcripts:

- https://speechspectrum.org/

## Interactive Demo (Full SpeechSpectrum)

The demo lets you click between all four transcription styles for each transcript:

- **TranscrA**: https://speechspectrum.org/demo.html#TranscrA/0
- **TranscrB**: https://speechspectrum.org/demo.html#TranscrB/0
- **TranscrC**: https://speechspectrum.org/demo.html#TranscrC/0

## Standalone Transcript Pages

Each standalone page shows a single transcript with survey questions side by side.

### TranscrA

| Style | URL |
|-------|-----|
| Verbatim | https://speechspectrum.org/standalone/TranscrA-verbatim.html |
| Non-Verbatim | https://speechspectrum.org/standalone/TranscrA-non-verbatim.html |
| Enhanced | https://speechspectrum.org/standalone/TranscrA-enhanced.html |
| Bullet Points | https://speechspectrum.org/standalone/TranscrA-bullet-points.html |

### TranscrB

| Style | URL |
|-------|-----|
| Verbatim | https://speechspectrum.org/standalone/TranscrB-verbatim.html |
| Non-Verbatim | https://speechspectrum.org/standalone/TranscrB-non-verbatim.html |
| Enhanced | https://speechspectrum.org/standalone/TranscrB-enhanced.html |
| Bullet Points | https://speechspectrum.org/standalone/TranscrB-bullet-points.html |

### TranscrC

| Style | URL |
|-------|-----|
| Verbatim | https://speechspectrum.org/standalone/TranscrC-verbatim.html |
| Non-Verbatim | https://speechspectrum.org/standalone/TranscrC-non-verbatim.html |
| Enhanced | https://speechspectrum.org/standalone/TranscrC-enhanced.html |
| Bullet Points | https://speechspectrum.org/standalone/TranscrC-bullet-points.html |

## Research Study

Participants enter via the study page, provide demographics, then get randomly assigned to one of 15 conditions:

- https://speechspectrum.org/study.html

## File Structure

```
docs/
  index.html            # Hub page linking to everything
  demo.html             # Interactive SpeechSpectrum demo
  study.html            # Prolific study entry + demographics
  content.js            # All transcript texts (edit texts here)
  questions.js          # Survey questions (edit questions here)
  demographics.js       # Demographic questions (edit here)
  survey.js             # Survey rendering + Google Sheets logging
  main.css              # Global styles
  standalone/
    standalone.css      # Styles for standalone pages
    TranscrA-verbatim.html
    TranscrA-non-verbatim.html
    TranscrA-enhanced.html
    TranscrA-bullet-points.html
    TranscrB-verbatim.html
    TranscrB-non-verbatim.html
    TranscrB-enhanced.html
    TranscrB-bullet-points.html
    TranscrC-verbatim.html
    TranscrC-non-verbatim.html
    TranscrC-enhanced.html
    TranscrC-bullet-points.html
```

## Editing Content

All transcript texts live in `docs/content.js`. Edit that single file and both the interactive demo and all standalone pages update automatically. Survey questions are in `docs/questions.js` and demographics in `docs/demographics.js`.
