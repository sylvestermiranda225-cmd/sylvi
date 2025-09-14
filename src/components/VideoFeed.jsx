import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

// IMPORTANT: Replace '10.192.190.118' with Chacko's actual local IP address if it changes.
const OLLAMA_SERVER_URL = "http://localhost:5000/chatbot"; // Using the /chatbot endpoint from the Python code

const VideoFeed = ({ onEmotionDetected, onSuggestionReceived }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const lastSentEmotionRef = useRef(null);

    useEffect(() => {
        const setupAndStart = async () => {
            try {
                console.log("Loading face-api models...");
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
                ]);
                setModelsLoaded(true);
                console.log("Models loaded successfully.");

                console.log("Requesting camera access...");
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    console.log("Camera access granted.");
                }
            } catch (err) {
                console.error("Setup failed:", err);
                setError("Could not start camera. Please grant permissions and refresh.");
            }
        };
        setupAndStart();
        
        return () => {
            console.log("Cleaning up VideoFeed component.");
            clearInterval(intervalRef.current);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handlePlay = () => {
        console.log("Video is playing. Starting in-browser analysis loop.");
        intervalRef.current = setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
                await performInBrowserAnalysis();
            }
        }, 1500); // Interval to check for emotions
    };
    
    // This function sends the detected emotion to the Flask server
    const sendEmotionToFlask = async (emotion) => {
        console.log(`New emotion detected: ${emotion}. Sending to Flask server...`);

        // The Flask server expects a JSON with the emotion
        const payload = {
            emotion: emotion,
            user_text: "" // Sending empty user_text as this comes from the camera
        };

        try {
            const response = await fetch(OLLAMA_SERVER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Flask server responded with: ${response.status}`);
            }
            
            const suggestionData = await response.json();
            
            console.log("Successfully received suggestion from Flask/Ollama:", suggestionData);
            if (onSuggestionReceived) {
                onSuggestionReceived(suggestionData);
            }

        } catch (err) {
            console.error("Error communicating with Flask server:", err);
            if (onSuggestionReceived) onSuggestionReceived({ error: "Connection to Flask server failed" });
        }
    };

    const performInBrowserAnalysis = async () => {
        const video = videoRef.current;
        if (!video || video.paused || video.ended) return;

        const canvas = canvasRef.current;
        const displaySize = { width: video.clientWidth, height: video.clientHeight };
        
        if (displaySize.width <= 0 || displaySize.height <= 0) return;

        faceapi.matchDimensions(canvas, displaySize);
        
        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (detections) {
            const expressions = detections.expressions;
            const dominantEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
            const score = expressions[dominantEmotion];

            onEmotionDetected({ emotion: dominantEmotion, score: score });

            // Check if the emotion is new and significant before sending
            if (dominantEmotion !== lastSentEmotionRef.current && dominantEmotion !== 'neutral' && score > 0.6) {
                sendEmotionToFlask(dominantEmotion);
                lastSentEmotionRef.current = dominantEmotion;
            }

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            new faceapi.draw.DrawBox(resizedDetections.detection.box).draw(canvas);
            context.setTransform(1, 0, 0, 1, 0, 0);

        } else {
            onEmotionDetected({ emotion: 'Searching...', score: 0 });
            if (lastSentEmotionRef.current !== 'searching') {
                lastSentEmotionRef.current = 'searching';
            }
        }
    };

    return (
        <div className="w-full h-full relative flex items-center justify-center">
            {error && <p className="text-red-400 p-4 z-20 text-center">{error}</p>}
            {!modelsLoaded && !error && <p className="text-white z-20">Loading AI Models...</p>}
            
            <video
                ref={videoRef}
                onPlay={handlePlay}
                autoPlay
                playsInline
                muted
                style={{ transform: 'scaleX(-1)' }}
                className="w-full h-full object-cover absolute"
            />
            <canvas ref={canvasRef} className="absolute" />
        </div>
    );
};

export default VideoFeed;