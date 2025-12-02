# Helper function that sends a prompt and input text to the OpenAI API
# and returns the model’s generated output.
def call_openai(client, prompt, text):
  completion = client.chat.completions.create(
    model="gpt-5.1",
    messages=[
      {"role": "developer", "content": "You are an expert in linguistics."},
      {"role": "user", "content": prompt.replace("[TEXT]", text)}
    ]
  )

  return completion.choices[0].message.content

# AUDIO → VERBATIM
#     Convert raw audio into an accurate verbatim transcript.
#     Whisper is used because it preserves natural speech patterns and disfluencies effectively
#     (see: https://www.isca-archive.org/interspeech_2024/teleki24_interspeech.pdf).
#     Note: Some specialized models may outperform Whisper for specific domains,
#     but they typically sacrifice generality or broad-speech robustness.
def audio_to_verbatim(client, audio_file):
  audio_file = open(audio_file, "rb")
  transcript = client.audio.transcriptions.create(
    model="gpt-4o-transcribe",
    file=audio_file
  )
  return transcript

# VERBATIM → NON-VERBATIM
#     Convert a verbatim transcript into a clean, fluent version by removing disfluencies.
#     This stage uses a specialized prompt and a configuration similar to that of DRES
#     (see https://arxiv.org/pdf/2509.20321), but implemented with gpt-5.1 (newer model).
#
#     Disfluency definitions and structural categories follow Shriberg’s framework:
#       - Reparandum: the segment to be deleted
#       - Interruption point: where the speaker cuts off the reparandum
#       - Interregnum: fillers or repair cues (e.g., “uh,” “um,” restarts)
#       - Repair: intendended/fluent speech to be kept
#     Reference examples can be found in Shriberg (pages 9, 14, 27, 66, and 68).
verbatim_to_nonverbatim_prompt = """
Using a transcript of spontaneous speech below, clean it by removing disfluencies in line with Shriberg’s structure: \
identify the reparandum (the portion to be deleted), interruption point, and interregnum (filled pauses, self-repair cues) \
so that the remaining repair constitutes the speaker’s intended fluent sentence. \
Disfluencies must be deleted to arrive at the speaker's intended sequence. \

Specifically:
- Remove filler words and sounds (e.g., um, uh, you know) when they occur as interregnum material.
- Remove repeated/self-repaired segments (reparandum) up to the interruption point; keep only the repair portion.
- Do not remove material that constitutes the repair (the intended utterance) or change meaning.
- Preserve meaning, tone, and speaker intent, and maintain grammatical correctness and readability.
- Do not add any new content or reinterpret the speaker’s words.
- Output only the cleaned transcript, with no commentary or annotations.

Example 1:
Input: Show me flights from boston on um monday
Output: Show me flights from boston on monday

Example 2:
Input: Show me the -- which early flights go to boston
Output: Which early flights go to boston

Example 3:
Input: which flights leave after eleven -- leave after noon
Output: which flights leave after noon

Example 4:
Input: um i guess we're going to talk describe uh job benefits
Output: we're going to describe job benefits

Example 5:
Input: he -- she -- she went
Output: she went

Here is the transcript: [TEXT]
"""

def verbatim_to_nonverbatim(client, text):
  return call_openai(client, verbatim_to_nonverbatim_prompt, text)


# NON-VERBATIM → ENHANCED
#     Produce a clearer, more readable version of the cleaned transcript using a refinement-oriented prompt.
#     This step aligns with established summarization research, and meets the needs
#     of downstream users who expect high-quality output (e.g., customer requests).
nonverbatim_to_enhanced_prompt = """Rewrite the following transcription it so it is clear, readable, and well-structured, retaining single paragraph formatting. \
Enhance grammar, flow, and clarity.

Here is the text: [TEXT]"""

def nonverbatim_to_enhanced(client, text):
  return call_openai(client, nonverbatim_to_enhanced_prompt, text)

# ENHANCED → BULLET POINTS
#     Convert an enhanced transcript into concise bullet points using a structured extraction prompt.
#     This stage draws on established work in fact extraction, and reflects real customer
#     demand for rapid distillation of spoken content (e.g., industry use cases).
#     Similar techniques to medical-scribe workflows such as generating SOAP-note style summaries.
enhanced_to_bulletpoints_prompt = """Extract the key points from the following text. \
Deliver them as clear, concise bullet points. Not necessarily atomic facts, but condensed bullet points. \
Do not add anything that isn’t explicitly stated.

Here is the text: [TEXT]"""

def enhanced_to_bulletpoints(client, text):
  return call_openai(client, enhanced_to_bulletpoints_prompt, text)
