from openai import OpenAI
from . import operations

class Client:
    def __init__(self, openai_api_key: str, openai_org_id: str, openai_project_id: str):
        self._openai = OpenAI(
            api_key=openai_api_key,
            organization=openai_org_id,
            project=openai_project_id
        )

    # AUDIO → VERBATIM: Convert raw audio into an accurate verbatim transcript.
    def audio_to_verbatim(self, audio_file):
        return operations.audio_to_verbatim(self._openai, audio_file)
    
    # VERBATIM → NON-VERBATIM: Convert a verbatim transcript into a clean, fluent version by removing disfluencies.
    def verbatim_to_nonverbatim(self, text):
        return operations.verbatim_to_nonverbatim(self._openai, text)
    
    # NON-VERBATIM → ENHANCED: Produce a clearer, more readable version of the cleaned transcript using a refinement-oriented prompt.
    def nonverbatim_to_enhanced(self, text):
        return operations.nonverbatim_to_enhanced(self._openai, text)
    
    # ENHANCED → BULLET POINTS: Convert an enhanced transcript into concise bullet points using a structured extraction prompt.
    def enhanced_to_bulletpoints(self, text):
        return operations.enhanced_to_bulletpoints(self._openai, text)

