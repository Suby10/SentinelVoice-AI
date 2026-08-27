from pprint import pprint

from speech_to_text import SpeechToText
from context_analyzer import ContextAnalyzer
from voice_detector import VoiceDetector
from trust_score import TrustScoreEngine


class AIPipeline:

    def __init__(self):

        print("Initializing SentinelVoice AI...\n")

        self.stt = SpeechToText()

        self.context = ContextAnalyzer()

        self.voice = VoiceDetector()

        self.trust = TrustScoreEngine()

        print("All AI modules loaded successfully!\n")

    def analyze(self, audio_path):

        print("=" * 60)
        print(" SENTINELVOICE AI ANALYSIS STARTED")
        print("=" * 60)

        # -------------------------------------------------
        # Step 1 : Speech To Text
        # -------------------------------------------------

        stt_result = self.stt.transcribe(audio_path)

        transcript = stt_result["text"]

        print("\n✓ Speech converted to text.")

        # -------------------------------------------------
        # Step 2 : Context Analysis
        # -------------------------------------------------

        context_result = self.context.analyze(transcript)

        print("✓ Context analysis completed.")

        # -------------------------------------------------
        # Step 3 : Voice Analysis
        # -------------------------------------------------

        voice_result = self.voice.analyze(audio_path)

        print("✓ Voice authenticity analysis completed.")

        # -------------------------------------------------
        # Step 4 : Trust Score
        # -------------------------------------------------

        trust_result = self.trust.calculate(

            voice_risk_score=voice_result["clone_probability"],

            context_risk_score=context_result["risk_score"]

        )

        print("✓ Trust score generated.")

        # -------------------------------------------------
        # Final Summary
        # -------------------------------------------------

        if trust_result["overall_risk_score"] >= 70:

            summary = {

                "status": "HIGH RISK",

                "reason":
                    "Voice and conversation contain multiple suspicious indicators."

            }

        elif trust_result["overall_risk_score"] >= 40:

            summary = {

                "status": "MEDIUM RISK",

                "reason":
                    "Some suspicious indicators detected. Verification recommended."

            }

        else:

            summary = {

                "status": "LOW RISK",

                "reason":
                    "No major warning signs detected."

            }

        return {

            "audio_file": audio_path,

            "transcript": transcript,

            "summary": summary,

            "voice_analysis": voice_result,

            "context_analysis": context_result,

            "trust_analysis": trust_result

        }


if __name__ == "__main__":

    pipeline = AIPipeline()

    result = pipeline.analyze(

        "assets/audio/genuine/genuine_1.wav"

    )

    print("\n")

    print("=" * 60)

    print(" FINAL AI REPORT ")

    print("=" * 60)

    pprint(result)