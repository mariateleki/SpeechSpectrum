# 🗣️ SpeechSpectrum

**SpeechSpectrum** provides a lightweight Python package for generating transcript representations along a *linguistic fidelity spectrum*—from verbatim transcripts to enhanced and compressed forms such as bullet points. The repository contains all code, notebooks, and the static site used in the accompanying user study.

## ⚙️ Requirements

- Python 3.8+
- `openai`
- OpenAI API credentials (API key + organization/project IDs)

## 📦 Installation
- Via PyPI:
  ```bash
  pip install speechspectrum
  ```
- From source (this repository):
  ```bash
  git clone https://github.com/mariateleki/SpeechSpectrum.git
  pip install -e .
  ```

## 🚀 Example Usage (also see `notebooks/SpeechSpectrum_Tool.ipynb`)
```python
from speechspectrum import Client

client = Client(
    openai_api_key="sk-...",
    openai_org_id="org_...",      # pass "" if your account does not use orgs
    openai_project_id="proj_..."  # pass "" if your account does not require it
)

# Optional: begin from an audio file
# verbatim = client.audio_to_verbatim("path/to/audio.wav").text

MEDICAL_EXAMPLE = {
    "verbatim": (
        "Okay, so, um, the patient came in today and, uh, she was "
        "complaining of, you know, chest pain that's been going on for about, "
        "let's see, um, three days now. And, uh, she said it gets worse when she, "
        "when she breathes deeply or, or coughs. So I, I examined her and found "
        "some, uh, some tenderness in the, the inter – intercostal muscles on the "
        "right side. Her vital signs were, um, let me think, blood pressure was "
        "one-twenty over eighty, heart rate was, was seventy-two, and temperature "
        "was normal at, uh, ninety-eight point six. I'm thinking this is probably, "
        "you know, costochon – costochondritis rather than anything, anything more "
        "serious like a cardiac event."
    ),
    "non-verbatim": "",
    "enhanced": "",
    "bullet-points": ""
}

# Execute the pipeline on the medical example (or replace MEDICAL_EXAMPLE['verbatim']
# with audio_verbatim above to process an observed recording)
MEDICAL_EXAMPLE["non-verbatim"] = client.verbatim_to_nonverbatim(MEDICAL_EXAMPLE["verbatim"])
MEDICAL_EXAMPLE["enhanced"] = client.nonverbatim_to_enhanced(MEDICAL_EXAMPLE["non-verbatim"])
MEDICAL_EXAMPLE["bullet-points"] = client.enhanced_to_bulletpoints(MEDICAL_EXAMPLE["enhanced"])

print("Verbatim:", MEDICAL_EXAMPLE["verbatim"])
print("Non-verbatim:", MEDICAL_EXAMPLE["non-verbatim"])
print("Enhanced:", MEDICAL_EXAMPLE["enhanced"])
print("Bullet points:", MEDICAL_EXAMPLE["bullet-points"])
```
## 📂 Repository Structure

- **`src/speechspectrum/`** — Source code for our Python package, using `gpt-4o-transcribe` (audio → verbatim) and `gpt-5.1` (downstream text transformations).  
- **`notebooks/SpeechSpectrum_Tool.ipynb`** — Shows end-to-end transcript pipeline with results used in the website + user study.
- **`docs/`** — Static website served at <https://speechspectrum.org>.
- **`notebooks/run_llm_experiment.ipynb`** — Executes the persona-based prompting study modeling preference distributions across fidelity levels.  
- **`notebooks/get_figs_and_sig_tests.ipynb`** — Reproduces statistical analyses and figure generation from the study outputs.  

## 🌐 Demo Website
The static demonstration resides in `docs/`. The site is published via GitHub Pages at https://speechspectrum.org.

## 🧭 Usage Principles and Ethical Considerations

SpeechSpectrum is designed to support user agency and transparency in transcript generation. Key principles for responsible use include:

- **Context-dependent fidelity:** Different tasks require different levels of detail. Select fidelity settings based on the informational and situational needs of the domain.

- **Transformations are interpretive:** Cleaning, enhancing, or summarizing transcripts alters meaning. These operations can suppress uncertainty cues or standardize informal or dialectal speech.

- **Linguistic representation matters:** Post-processing can unintentionally erase identity markers or stylistic features. Exercise care when working with marginalized or diverse speech communities.

- **Disfluencies are informative:** Filled pauses, hesitations, and repairs can carry semantic or pragmatic value. Preserve or remove them thoughtfully, especially in high-stakes contexts.

- **Protect speaker privacy:** Audio and transcripts may encode sensitive information. Collect and process data with consent and in accordance with relevant privacy requirements.

- **Use LLM preference modeling cautiously:** LLM personas tend to overgeneralize or exaggerate role-based preferences. Empirical user data should guide design decisions.

- **Maintain transparency:** When sharing outputs, disclose the fidelity level used and any post-processing applied so downstream users can interpret transcripts appropriately.

## 📚 Citation
```bibtex
@inproceedings{choi2025speechspectrum,
  title     = {SpeechSpectrum: A Framework for Speech-to-Text Representation Along the Linguistic Fidelity Spectrum},
  author    = {Anna Seo Gyeong Choi and Maria Teleki and Miguel del Rio and Corey Miller and James Caverlee and Allison Koenecke},
  booktitle = {-},
  year      = {2025}
}
```

## 📜 License
MIT, see `LICENSE`.
