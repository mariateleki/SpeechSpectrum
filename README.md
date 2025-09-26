# 🗣️ SpeechSpectrum

This repository contains all materials for SpeechSpectrum, a project exploring user and LLM preferences for transcript fidelity. The repo is organized into three main components:

1. **LLM Experiment** -- Run large language model experiments with persona prompting.
2. **Statistical Analysis & Visualization** -- Generate all plots and run statistical tests.
3. **Website** -- Code for the the interactive demo site.


## 🚀 Quick Start

Cone the repository:

```
git clone https://github.com/mariateleki/SpeechSpectrum.git
cd SpeechSpectrum
```

## 📊 1. Statistical Analysis & Visualization

**File:** `get_figs_and_sig_tests.ipynb`  

This notebook contains the full analysis pipeline for the study, including:

- Data preprocessing and loading (`human_results.csv`, `results.csv`)  
- Chi-squared and pooled standard deviation analyses  
- Generation of figures used in the paper  
- Statistical tests comparing human and LLM distributions

**Run it locally or in Colab:**

```bash
jupyter notebook get_figs_and_sig_tests.ipynb
```


## 🤖 2. LLM Experiment

**File:** `run_llm_experiment.ipynb`  

This notebook runs the main LLM experiment described in the paper. It:

- Constructs 23 simulated personas based on participant demographics  
- Prompts the LLM with the six study scenarios  
- Collects responses across three randomized seeds  

The experiment uses `gpt-5-mini-2025-08-07`.


## 🌐 3. Website

**Folder:** `SpeechSpectrum-Website/`  

A static demo website visualizing SpeechSpectrum’s applications and results.  
It includes:

- **Homepage (`index.html`)** with project overview  
- **Domain-specific examples** (Legal, Medical, Business)  
- Responsive design via `main.css`  

To preview locally, open `SpeechSpectrum-Website/index.html` in your browser.  
For deployment, push the folder to a `gh-pages` branch or host via GitHub Pages.

## 🔁 Reproducibility

- **Environment**  
   - Python 3.9+  
   - Recommended: run notebooks in Google Colab or Jupyter

- **Experiment Workflow**  
   - Run `run_llm_experiment.ipynb` → generates persona responses.  
   - Run `get_figs_and_sig_tests.ipynb` → performs analysis & outputs figures.


## 📜 License

This project is licensed under the MIT License as specified in the LICENSE file.

