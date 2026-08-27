import whisper
import os


class SpeechToText:

    def __init__(self, model_name="base"):
        print("Loading Whisper model...")
        self.model = whisper.load_model(model_name)
        print("Whisper model loaded.\n")

    def transcribe(self, audio_path):

        if not os.path.exists(audio_path):
            raise FileNotFoundError(audio_path)

        result = self.model.transcribe(audio_path)

        return {
            "text": result["text"],
            "language": result["language"]
        }


if __name__ == "__main__":

    stt = SpeechToText(model_name="base")

    audio_file = "assets/audio/genuine/genuine_1.wav"

    try:
        result = stt.transcribe(audio_file)

        print("=" * 40)
        print("Speech To Text")
        print("=" * 40)

        print(f"\nLanguage : {result['language']}")
        print(f"\nTranscript:\n{result['text']}")

    except Exception as e:
        print("Error:", e)