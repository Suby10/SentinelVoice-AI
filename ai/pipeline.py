import os
from pprint import pprint

from ai.speech_to_text import SpeechToText
from ai.context_analyzer import ContextAnalyzer
from ai.voice_detector import VoiceDetector
from ai.trust_score import TrustScoreEngine


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

       

        # Convert detected_signals to a list if it's a dictionary
        detected_signals = context_result.get("detected_signals", {})

        if isinstance(detected_signals, dict):
            detected_signals = list(detected_signals.keys())

        return {
            "filename": os.path.basename(audio_path),
            "audio": {
                "duration": voice_result["features"]["duration"],
                "sample_rate": voice_result["features"]["sample_rate"]
            },
            "transcript": {
                "text": stt_result["text"],
                "language": stt_result["language"]
            },
            "prediction": (
                "REAL"
                if voice_result["prediction"] == "Likely Human"
                else "FAKE"
            ),
            "confidence": voice_result["confidence"],
            "voice_analysis": {
                "prediction": voice_result["prediction"],
                "clone_probability": voice_result["clone_probability"],
                "confidence": voice_result["confidence"],
                "reasons": voice_result["reasons"]
            },
            "context_analysis": {
                "risk_score": context_result["risk_score"],
                "risk_level": context_result["risk_level"],
                "detected_signals": detected_signals,
                "risk_reasons": context_result["risk_reasons"]
            },
            "trust_analysis": {
                "voice_risk_score": trust_result["voice_risk_score"],
                "context_risk_score": trust_result["context_risk_score"],
                "overall_risk_score": trust_result["overall_risk_score"],
                "trust_score": trust_result["trust_score"],
                "risk_level": trust_result["risk_level"],
                "decision": trust_result["decision"]
            },
            "protection": {
                "enabled": context_result["assisted_protection"]["enabled"],
                "recommendations": context_result["recommendations"]
            },
            "summary": summary
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