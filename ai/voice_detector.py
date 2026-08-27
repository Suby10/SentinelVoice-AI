from audio_features import AudioFeatureExtractor


class VoiceDetector:

    def __init__(self):
        self.extractor = AudioFeatureExtractor()

    def analyze(self, audio_path):

        features = self.extractor.extract(audio_path)

        score = 0
        reasons = []

        score += self.energy_analysis(features, reasons)
        score += self.spectral_analysis(features, reasons)
        score += self.tempo_analysis(features, reasons)
        score += self.duration_analysis(features, reasons)

        score = min(score, 100)

        if score >= 60:
            prediction = "Likely AI Generated"

        elif score >= 30:
            prediction = "Suspicious"

        else:
            prediction = "Likely Human"

        return {

            "prediction": prediction,

            "clone_probability": score,

            "confidence": 100 - score,

            "reasons": reasons,

            "features": features

        }

    def energy_analysis(self, features, reasons):

        if features["rms_energy"] < 0.03:

            reasons.append("Low vocal energy")

            return 20

        return 0

    def spectral_analysis(self, features, reasons):

        score = 0

        if features["spectral_centroid"] > 3500:

            reasons.append("High spectral centroid")

            score += 20

        if features["spectral_bandwidth"] < 1500:

            reasons.append("Low spectral bandwidth")

            score += 15

        return score

    def tempo_analysis(self, features, reasons):

        tempo = features["tempo"]

        if tempo < 70 or tempo > 190:

            reasons.append("Abnormal speaking tempo")

            return 15

        return 0

    def duration_analysis(self, features, reasons):

        if features["duration"] < 2:

            reasons.append("Very short recording")

            return 10

        return 0


if __name__ == "__main__":

    detector = VoiceDetector()

    result = detector.analyze(
        "assets/audio/genuine/genuine_1.wav"
    )

    print("=" * 60)
    print("VOICE AUTHENTICITY ANALYSIS")
    print("=" * 60)

    print(f"\nPrediction : {result['prediction']}")
    print(f"Confidence : {result['confidence']}%")
    print(f"Clone Probability : {result['clone_probability']}%")

    print("\nReasons")

    if len(result["reasons"]) == 0:
        print("No suspicious characteristics detected.")

    else:

        for reason in result["reasons"]:
            print("-", reason)