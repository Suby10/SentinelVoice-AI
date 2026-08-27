from audio_features import AudioFeatureExtractor


class VoiceDetector:

    def __init__(self):
        self.extractor = AudioFeatureExtractor()

    def analyze(self, audio_path):

        features = self.extractor.extract(audio_path)

        clone_score = 0
        reasons = []

        # -------------------------
        # Rule 1 - Energy Variation
        # -------------------------
        if features["rms_energy"] < 0.03:
            clone_score += 20
            reasons.append("Low vocal energy")

        # -------------------------
        # Rule 2 - Spectral Brightness
        # -------------------------
        if features["spectral_centroid"] > 3500:
            clone_score += 20
            reasons.append("Unusual spectral centroid")

        # -------------------------
        # Rule 3 - Frequency Spread
        # -------------------------
        if features["spectral_bandwidth"] < 1500:
            clone_score += 15
            reasons.append("Low spectral bandwidth")

        # -------------------------
        # Rule 4 - Speech Tempo
        # -------------------------
        tempo = features["tempo"]

        if tempo < 70 or tempo > 190:
            clone_score += 15
            reasons.append("Unusual speaking tempo")

        # -------------------------
        # Rule 5 - Very Short Audio
        # -------------------------
        if features["duration"] < 2:
            clone_score += 10
            reasons.append("Very short recording")

        clone_score = min(clone_score, 100)

        if clone_score >= 60:
            prediction = "Likely AI Generated"

        elif clone_score >= 30:
            prediction = "Suspicious"

        else:
            prediction = "Likely Human"

        confidence = 100 - clone_score

        return {

            "prediction": prediction,

            "clone_probability": clone_score,

            "confidence": confidence,

            "reasons": reasons,

            "features": features

        }


if __name__ == "__main__":

    detector = VoiceDetector()

    result = detector.analyze(
        "assets/audio/genuine/genuine_1.wav"
    )

    print("=" * 50)
    print("VOICE ANALYSIS")
    print("=" * 50)

    print(f"Prediction : {result['prediction']}")
    print(f"Confidence : {result['confidence']}%")
    print(f"Clone Risk : {result['clone_probability']}%")

    print("\nReasons")

    for r in result["reasons"]:
        print("-", r)