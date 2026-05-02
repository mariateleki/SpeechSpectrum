"""
Build the four-style transcript files used by the website from the raw
verbatim files in transcripts_raw/.

For each transcripts_raw/<name>.txt:
  docs/transcripts/<name>_verbatim.txt
  docs/transcripts/<name>_non-verbatim.txt
  docs/transcripts/<name>_enhanced.txt
  docs/transcripts/<name>_bullet-points.txt

Uses the SpeechSpectrum Python package (gpt-5.5) to generate the
non-verbatim, enhanced, and bullet-points versions. The verbatim file is
copied through unchanged.

Usage:
  # Put your credentials in a .env file at the repo root:
  #   OPENAI_API_KEY=sk-...
  #   OPENAI_ORG_ID=...           # may be empty
  #   OPENAI_PROJECT_ID=...       # may be empty
  python scripts/build_transcripts.py [name1 name2 ...]

If transcript names are passed on the command line, only those are rebuilt;
otherwise every *.txt in transcripts_raw/ is rebuilt.
"""

import argparse
import sys
from pathlib import Path

from speechspectrum import Client

REPO_ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = REPO_ROOT / "transcripts_raw"
OUT_DIR = REPO_ROOT / "docs" / "transcripts"
ENV_FILE = REPO_ROOT / ".env"


def load_env_file(path: Path) -> dict:
    """Minimal .env reader. Supports KEY=VALUE lines, ignores blanks and # comments.
    Strips matching surrounding single or double quotes from the value.
    """
    if not path.is_file():
        return {}
    out = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[len("export "):]
        if "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
            value = value[1:-1]
        out[key] = value
    return out


def to_html(text: str) -> str:
    """Wrap text in <p> and join non-blank lines with <br> so newlines render."""
    lines = [ln.rstrip() for ln in text.strip().splitlines() if ln.strip()]
    if len(lines) <= 1:
        return f"<p>{lines[0] if lines else ''}</p>\n"
    return "<p>" + "<br>\n".join(lines) + "</p>\n"


def build_one(client: Client, name: str, verbatim: str) -> dict:
    non_verbatim = client.verbatim_to_nonverbatim(verbatim)
    enhanced = client.nonverbatim_to_enhanced(non_verbatim)
    bullets = client.enhanced_to_bulletpoints(enhanced)

    return {
        "verbatim": to_html(verbatim),
        "non-verbatim": to_html(non_verbatim),
        "enhanced": to_html(enhanced),
        "bullet-points": to_html(bullets),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("names", nargs="*", help="Optional list of transcript names to rebuild (without .txt).")
    args = parser.parse_args()

    env = load_env_file(ENV_FILE)
    api_key = env.get("OPENAI_API_KEY", "")
    if not api_key:
        print(f"ERROR: OPENAI_API_KEY is not set in {ENV_FILE}.", file=sys.stderr)
        return 1
    org_id = env.get("OPENAI_ORG_ID", "")
    project_id = env.get("OPENAI_PROJECT_ID", "")

    if not RAW_DIR.is_dir():
        print(f"ERROR: {RAW_DIR} does not exist.", file=sys.stderr)
        return 1
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    raw_files = sorted(RAW_DIR.glob("*.txt"))
    if args.names:
        wanted = set(args.names)
        raw_files = [p for p in raw_files if p.stem in wanted]
        missing = wanted - {p.stem for p in raw_files}
        if missing:
            print(f"ERROR: no raw file(s) for: {', '.join(sorted(missing))}", file=sys.stderr)
            return 1

    if not raw_files:
        print(f"No transcripts to build in {RAW_DIR}.")
        return 0

    client = Client(openai_api_key=api_key, openai_org_id=org_id, openai_project_id=project_id)

    for src in raw_files:
        name = src.stem
        verbatim = src.read_text(encoding="utf-8").strip()
        if not verbatim:
            print(f"Skipping {name} (file is empty).")
            continue
        print(f"Building {name}...", flush=True)
        outputs = build_one(client, name, verbatim)
        for style, html in outputs.items():
            dest = OUT_DIR / f"{name}_{style}.txt"
            dest.write_text(html, encoding="utf-8")
            print(f"  wrote {dest.relative_to(REPO_ROOT)}")

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
