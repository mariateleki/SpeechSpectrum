# Raw verbatim transcripts

Drop one `.txt` file per transcript here. The filename (without `.txt`) becomes
the transcript key used by the website — for the study to pick it up, name files
`TranscrA.txt`, `TranscrB.txt`, `TranscrC.txt`.

Each file should contain the **verbatim** version of the transcript (with
disfluencies, fillers, restarts — exactly as spoken). The build script will
generate the other three styles (non-verbatim, enhanced, bullet-points) using
the SpeechSpectrum Python pipeline.

## Build

Create a `.env` file at the repo root (copy from `.env.example`) with:

```
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org_...        # optional, leave blank if not used
OPENAI_PROJECT_ID=proj_...   # optional, leave blank if not used
```

Then run:

```bash
python scripts/build_transcripts.py
```

This reads every `transcripts_raw/*.txt`, runs the four-stage pipeline, and
writes the results into `docs/transcripts/{name}_{style}.txt` (overwriting any
existing files). Reload the website and the new content shows up.
