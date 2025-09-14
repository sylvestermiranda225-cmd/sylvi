from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import io
from pydub import AudioSegment  

app = Flask(__name__)
 
CORS(app) 

r = sr.Recognizer()

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    
    try:
        # 1. Read the incoming audio file from the request
        #    The format is likely webm, but pydub can handle it automatically
        audio_data = AudioSegment.from_file(audio_file)

        # 2. Convert it to WAV format in memory
        wav_io = io.BytesIO()
        audio_data.export(wav_io, format="wav")
        wav_io.seek(0) # Rewind the buffer to the beginning

        # 3. Use the WAV data with SpeechRecognition
        with sr.AudioFile(wav_io) as source:
            audio = r.record(source)
            text = r.recognize_google(audio)
            print(f"Transcription: {text}")
            return jsonify({"transcript": text})
            
    except sr.UnknownValueError:
        print("Google Web Speech API could not understand audio")
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError as e:
        print(f"Could not request results from Google Web Speech API; {e}")
        return jsonify({"error": "API request failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)