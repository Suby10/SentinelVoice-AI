import librosa
import numpy as np


class AudioFeatureExtractor:

    def extract(self, audio_path):

        y, sr = librosa.load(audio_path, sr=16000, mono=True)

        duration = librosa.get_duration(y=y, sr=sr)

        rms = np.mean(librosa.feature.rms(y=y))

        zero_crossing = np.mean(
            librosa.feature.zero_crossing_rate(y)
        )

        spectral_centroid = np.mean(
            librosa.feature.spectral_centroid(
                y=y,
                sr=sr
            )
        )

        spectral_bandwidth = np.mean(
            librosa.feature.spectral_bandwidth(
                y=y,
                sr=sr
            )
        )

        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

        try:
            tempo = float(tempo)
        except:
             tempo = float(tempo[0])

        mfcc = librosa.feature.mfcc(
            y=y,
            sr=sr,
            n_mfcc=13
        )

        mfcc_mean = np.mean(mfcc, axis=1)

        return {

            "duration": round(duration, 2),

            "sample_rate": sr,

            "rms_energy": round(float(rms), 4),

            "zero_crossing_rate": round(float(zero_crossing), 4),

            "spectral_centroid": round(float(spectral_centroid), 2),

            "spectral_bandwidth": round(float(spectral_bandwidth), 2),

            "tempo": round(float(tempo), 2),

            "mfcc": mfcc_mean.tolist()

        }


if __name__ == "__main__":

    extractor = AudioFeatureExtractor()

    result = extractor.extract(
        "assets/audio/genuine/genuine_1.wav"
    )

    print("=" * 45)
    print("Audio Feature Extraction")
    print("=" * 45)

    for key, value in result.items():

        if key == "mfcc":
            print("\nMFCC Vector:")
            print(value)

        else:
            print(f"{key}: {value}")