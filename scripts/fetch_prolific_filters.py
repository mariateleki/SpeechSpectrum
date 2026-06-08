"""
Fetch the full list of Prolific demographic filters (a.k.a. prescreeners /
eligibility requirements) and save the raw JSON to disk.

Requires `PROLIFIC_TOKEN` in the repo-root `.env`.

Usage:
    python scripts/fetch_prolific_filters.py [--out data/prolific_filters.json]

The Prolific API hides this taxonomy behind a Cloudflare check that 403s any
request without a real User-Agent string. We pass one explicitly.

The output JSON is the `results` array from
    GET https://api.prolific.com/api/v1/filters/
which is the modern equivalent of the older `eligibility-requirements`
endpoint that some libraries still reference.

Each filter looks like:
    {
      "filter_id": "employment-sector",
      "title":     "Employment-Sector",
      "question":  "Which of the following best describes the sector ...",
      "type":      "select",
      "data_type": "ChoiceID",
      "choices":   { "0": "Agriculture, Food and Natural Resources", ... }
    }
"""

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / ".env"
DEFAULT_OUT = REPO_ROOT / "data" / "prolific_filters.json"
API_URL = "https://api.prolific.com/api/v1/filters/"


def load_env(path: Path) -> dict:
    out = {}
    if not path.is_file():
        return out
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        if line.startswith("export "):
            line = line[len("export ") :]
        k, _, v = line.partition("=")
        v = v.strip()
        if len(v) >= 2 and v[0] == v[-1] and v[0] in ("'", '"'):
            v = v[1:-1]
        out[k.strip()] = v
    return out


def fetch_filters(token: str) -> list[dict]:
    req = urllib.request.Request(
        API_URL,
        headers={
            # Cloudflare blocks the default Python User-Agent — must override.
            "Authorization": f"Token {token}",
            "User-Agent": "Mozilla/5.0 SpeechSpectrum/1.0",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data.get("results") if isinstance(data, dict) else data


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT, help="Where to save the JSON (default: data/prolific_filters.json)")
    args = parser.parse_args()

    env = load_env(ENV_FILE)
    token = env.get("PROLIFIC_TOKEN", "")
    if not token:
        print(f"ERROR: PROLIFIC_TOKEN not set in {ENV_FILE}", file=sys.stderr)
        return 1

    try:
        results = fetch_filters(token)
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} from {API_URL}: {e.read().decode()[:400]}", file=sys.stderr)
        return 1
    except urllib.error.URLError as e:
        print(f"Network error: {e}", file=sys.stderr)
        return 1

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(results)} filters → {args.out.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
