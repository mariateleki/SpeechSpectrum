# SpeechSpectrum Website

SpeechSpectrum demonstrates how the same speech can be transcribed in four different styles: **Verbatim**, **Non-Verbatim**, **Enhanced**, and **Bullet Points** — across three domains (Legal, Medical, Business).

## Hub Page

The root page links to everything — the interactive demos and all standalone transcripts:

- https://speechspectrum.org/

## Interactive Demo (Full SpeechSpectrum)

The demo lets you click between all four transcription styles for each domain:

- **Legal**: https://speechspectrum.org/demo.html#legal/0
- **Medical**: https://speechspectrum.org/demo.html#medical/0
- **Business**: https://speechspectrum.org/demo.html#business/0

## Standalone Transcript Pages

Each standalone page shows a single transcript with no navigation — useful for embedding or linking to a specific version directly.

### Legal

| Style | URL |
|-------|-----|
| Verbatim | https://speechspectrum.org/standalone/legal-verbatim.html |
| Non-Verbatim | https://speechspectrum.org/standalone/legal-non-verbatim.html |
| Enhanced | https://speechspectrum.org/standalone/legal-enhanced.html |
| Bullet Points | https://speechspectrum.org/standalone/legal-bullet-points.html |

### Medical

| Style | URL |
|-------|-----|
| Verbatim | https://speechspectrum.org/standalone/medical-verbatim.html |
| Non-Verbatim | https://speechspectrum.org/standalone/medical-non-verbatim.html |
| Enhanced | https://speechspectrum.org/standalone/medical-enhanced.html |
| Bullet Points | https://speechspectrum.org/standalone/medical-bullet-points.html |

### Business

| Style | URL |
|-------|-----|
| Verbatim | https://speechspectrum.org/standalone/business-verbatim.html |
| Non-Verbatim | https://speechspectrum.org/standalone/business-non-verbatim.html |
| Enhanced | https://speechspectrum.org/standalone/business-enhanced.html |
| Bullet Points | https://speechspectrum.org/standalone/business-bullet-points.html |

## File Structure

```
docs/
  index.html            # Hub page linking to everything
  demo.html             # Interactive SpeechSpectrum demo
  content.js            # All transcript texts (edit texts here)
  main.css              # Global styles
  standalone/
    standalone.css      # Minimal styles for standalone pages
    legal-verbatim.html
    legal-non-verbatim.html
    legal-enhanced.html
    legal-bullet-points.html
    medical-verbatim.html
    medical-non-verbatim.html
    medical-enhanced.html
    medical-bullet-points.html
    business-verbatim.html
    business-non-verbatim.html
    business-enhanced.html
    business-bullet-points.html
```

## Editing Content

All transcript texts live in `docs/content.js`. Edit that single file and both the interactive demo and all standalone pages update automatically.
