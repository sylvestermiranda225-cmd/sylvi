import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { styles } from '../styles';
import VideoFeed from './VideoFeed';
import Navbar from './Navbar';
import SuggestedActivities from './SuggestedActivities';
import ActionResponseDisplay from './ActionResponseDisplay';

 
const FLASK_CHATBOT_URL = "http://localhost:5000/chatbot";
const FLASK_TRANSCRIBE_URL = "http://localhost:5001/transcribe";
const AGENT_URL = "http://10.192.190.118:5000/agent";  

 
const CameraIcon = () => ( <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3"> <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /> </svg> );
const StopIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg> );
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg>);
const SylviIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.455-2.456L12.75 18l1.178-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" /></svg>);
const SpotifyIcon = () => ( <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#1DB954]"><title>Spotify</title><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.835 17.525a.498.498 0 0 1-.69.157c-2.34-1.425-5.285-1.748-8.775-.952a.5.5 0 0 1-.562-.437.5.5 0 0 1 .437-.562c3.765-.862 7.035-.507 9.685 1.112a.498.498 0 0 1 .157.69zm.87-2.31a.624.624 0 0 1-.857.2c-2.61-1.59-6.33-2.025-9.81-.952a.625.625 0 0 1-.705-.545.625.625 0 0 1 .545-.705c3.84-1.185 7.91-.705 10.83 1.11a.624.624 0 0 1 .2.857zm.12-2.585a.75.75 0 0 1-1.032.24c-2.94-1.8-7.56-2.34-10.92-1.215a.75.75 0 0 1-.84-.652.75.75 0 0 1 .652-.84c3.78-1.23 8.85-.615 12.21 1.485a.75.75 0 0 1 .24 1.032z"/></svg> );
const YouTubeIcon = () => ( <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#FF0000]"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> );
const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 15.253L17.5 10 3.105 4.747a.75.75 0 00-1.137.662v4.444a.75.75 0 00.41.666L8.5 12.5l-6.122 1.628a.75.75 0 00-.41.666v4.444a.75.75 0 001.137.662z" /></svg>);
const MicIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5v9M15.75 7.5a3.75 3.75 0 10-7.5 0v3a3.75 3.75 0 107.5 0v-3zM5.25 12a6.75 6.75 0 0013.5 0M12 21v-3" /> </svg> );

const toolIconMap = { SpotifyIcon: <SpotifyIcon />, YouTubeIcon: <YouTubeIcon /> };

const LinkRenderer = ({ text }) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return (<span>{parts.map((part, index) => urlRegex.test(part) ? <a href={part} key={index} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{part}</a> : <span key={index}>{part}</span>)}</span>);
};

const useAudioRecorder = (onStop) => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        if (isRecording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.ondataavailable = (event) => { audioChunksRef.current.push(event.data); };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                onStop(audioBlob);
                audioChunksRef.current = [];
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.onerror = (event) => {
                console.error("MediaRecorder error:", event.error);
                setError("Recording failed.");
                setIsRecording(false);
            };
            mediaRecorder.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Microphone access was denied. Please allow access in your browser settings.");
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (!isRecording || !mediaRecorderRef.current) return;
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };
    
    const toggleRecording = () => {
        isRecording ? stopRecording() : startRecording();
    };

    return { isRecording, error, toggleRecording };
};


const AppUI = () => {
    const [agentMessage, setAgentMessage] = useState("I'm Sylvi. How can I help you today?");
    const [activeTool, setActiveTool] = useState({ name: 'None', icon: null });
    const [realtimeEmotionData, setRealtimeEmotionData] = useState({ emotion: 'Inactive', score: 0 });
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isSylviThinking, setIsSylviThinking] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'ai', text: "Hello! You can chat with me here." }]);
    const [chatInput, setChatInput] = useState("");
    const chatContainerRef = useRef(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [actionResponse, setActionResponse] = useState("Waiting for agent response...");
    
    const handleTranscription = async (audioBlob) => {
        if (!audioBlob) return;
        setIsTranscribing(true);
        setChatInput("Transcribing...");
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");
        try {
            const response = await fetch(FLASK_TRANSCRIBE_URL, { method: 'POST', body: formData });
            const data = await response.json();
            if (response.ok) {
                setChatInput(data.transcript);
            } else {
                setChatInput(`Error: ${data.error || 'Transcription failed'}`);
            }
        } catch (error) {
            console.error("Transcription request failed:", error);
            setChatInput("Error: Could not connect to transcription service.");
        } finally {
            setIsTranscribing(false);
        }
    };

    const { isRecording: isListening, error: micError, toggleRecording: handleToggleListening } = useAudioRecorder(handleTranscription);

    const emotionUIConfig = {
        happy:        { color: 'yellow-400', glow: 'from-yellow-400/80' },
        sad:          { color: 'blue-400',   glow: 'from-blue-400/80' },
        angry:        { color: 'red-500',    glow: 'from-red-500/80' },
        neutral:      { color: 'gray-400',   glow: 'from-gray-500/80' },
        surprised:    { color: 'green-400',  glow: 'from-green-400/80' },
        'Searching...': { color: 'gray-400', glow: 'from-gray-500/80' },
        Inactive:     { color: 'transparent',glow: 'from-transparent' }
    };
    const currentEmotionUI = emotionUIConfig[realtimeEmotionData.emotion] || emotionUIConfig.Inactive;

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isSylviThinking]);

    // This function handles the chat window (Ollama)
    const handleSendMessage = async (e, messageOverride) => {
        if (e) e.preventDefault();
        const currentInput = messageOverride || chatInput;
        if (!currentInput.trim() || isTranscribing) return;

        const userMessage = { sender: 'user', text: currentInput };
        setMessages(prev => [...prev, userMessage]);
        setChatInput("");
        setIsSylviThinking(true);
        setActiveTool({ name: 'Thinking...', icon: null });

        try {
            const payload = { user_text: currentInput, emotion: "none" };
            const response = await fetch(FLASK_CHATBOT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
            
            const data = await response.json();
            if (data.response) {
                // CORRECT: Update the chat messages and the "Latest Thought" panel
                setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
                setAgentMessage(data.response);
            }
            if (data.action && data.action !== "none") {
                const toolName = data.action;
                const toolKey = `${toolName}Icon`;
                setActiveTool({ name: toolName, icon: toolIconMap[toolKey] || <SylviIcon /> });
            } else {
                setActiveTool({ name: 'None', icon: null });
            }
        } catch (err) {
            console.error("Failed to get response from Flask server:", err);
            const errorMessage = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please ensure the backend server is running." };
            setMessages(prev => [...prev, errorMessage]);
            setAgentMessage("Connection failed. See chat for details.");
            setActiveTool({ name: 'Error', icon: null });
        } finally {
            setIsSylviThinking(false);
        }
    };
    
    // This function handles the emotion-based suggestions (Python Agent)
    const handleSuggestionFromEmotion = async (suggestion) => {
        if (suggestion?.details?.query) {
            
            const payload = {
                query: suggestion.details.query,
            };

            try {
                setActiveTool({ name: 'Agent', icon: null });
                setAgentMessage("Request sent to agent..."); // Keep this to show the action was triggered

                const response = await fetch(AGENT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`Agent server responded with status: ${response.status}`);
                }

                const data = await response.json();

                
                setActionResponse(data.ai_response);
                setActiveTool({ name: 'Done', icon: null });

            } catch (err) {
                console.error("Failed to get response from agent server:", err);
                
                setActionResponse(`Agent Error: ${err.message}`);
                setActiveTool({ name: 'Error', icon: null });
            }
        } else if (suggestion.error) {
         
            setActionResponse(`Suggestion Error: ${suggestion.error}`);
            setActiveTool({ name: 'Error', icon: null });
        }
    };

    const handleSelectSuggestion = (query) => {
        handleSendMessage(null, query);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };
    
    return (
        <div className="relative z-0 bg-[#0D1117] w-full min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow w-full max-w-screen-2xl mx-auto px-6 pt-32 pb-8 flex flex-col min-h-0">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full grid grid-cols-1 lg:grid-cols-7 gap-6"
                >
               
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-[#161b22]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <h3 className="text-white font-bold text-xl">Dashboard</h3>
                               
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">DETECTED EMOTION</p>
                                <div className="flex items-baseline">
                                    <p className={`text-3xl font-semibold capitalize transition-colors duration-500 text-${currentEmotionUI.color}`}>
                                        {realtimeEmotionData.emotion}
                                    </p>
                                    {realtimeEmotionData.emotion !== 'Inactive' && realtimeEmotionData.score > 0 && (
                                        <p className="text-xl text-slate-400 ml-2 font-normal">
                                            ({(realtimeEmotionData.score * 100).toFixed(0)}%)
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="bg-black/30 rounded-lg p-4 text-center">
                                <p className="text-sm font-semibold text-cyan-400 mb-2">LATEST THOUGHT</p>
                                <p className="text-slate-300 leading-relaxed text-sm"><LinkRenderer text={agentMessage} /></p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-2">ACTIVE TOOL</p>
                                <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg"><div className="text-cyan-400">{activeTool.icon || <SylviIcon />}</div><span className="font-medium text-white">{activeTool.name}</span></div>
                            </div>
                        </div>
                        <div className="flex-grow min-h-[200px]">
                            <SuggestedActivities onSelectSuggestion={handleSelectSuggestion} />
                        </div>
                    </div>

                 
                    <div className="lg:col-span-3 flex flex-col gap-6 ">
                        <div className="relative w-full">
                            <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-tr ${currentEmotionUI.glow} to-transparent blur-2xl opacity-50 transition-all duration-1000`}></div>
                            <div className="relative bg-black/50 w-full aspect-video rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl shadow-black/40">
                                <AnimatePresence mode="wait">
                                    {!isCameraActive ? (
                                        <motion.button onClick={() => setIsCameraActive(true)} key="start-btn" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-center px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:bg-gray-700/70 hover:border-white/20 hover:scale-105">
                                            <CameraIcon /> Start Analysis
                                        </motion.button>
                                    ) : (
                                        <VideoFeed 
                                            onEmotionDetected={setRealtimeEmotionData} 
                                            onSuggestionReceived={handleSuggestionFromEmotion} 
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        {isCameraActive && (
                            <motion.button onClick={() => setIsCameraActive(false)} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="flex items-center justify-center gap-1.5 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-colors">
                                <StopIcon /> Stop Session
                            </motion.button>
                        )}
                        
                        {actionResponse && <ActionResponseDisplay response={actionResponse} />}
                    </div>

                   
                    <div className="lg:col-span-2 bg-[#161b22]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col overflow-hidden max-h-[83vh]">
                        <h3 className="flex-shrink-0 text-white font-bold text-xl pb-4 border-b border-white/10">Chat with Sylvi</h3>
                        <div ref={chatContainerRef} className="flex-grow my-4 space-y-4 pr-2 -mr-2 overflow-y-auto">
                           <AnimatePresence>
                               {messages.map((msg, index) => (
                                   <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                       {msg.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-cyan-400"><SylviIcon /></div>}
                                       <div className={`max-w-[85%] p-3 rounded-lg text-white text-sm ${msg.sender === 'user' ? 'bg-cyan-600/50' : 'bg-slate-700/50'}`}>
                                           <p className="leading-relaxed"><LinkRenderer text={msg.text} /></p>
                                       </div>
                                       {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300"><UserIcon /></div>}
                                   </motion.div>
                               ))}
                               {isSylviThinking && (
                                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-cyan-400"><SylviIcon /></div>
                                       <div className="max-w-[85%] p-3 rounded-lg text-white bg-slate-700/50 flex items-center gap-2">
                                           <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                           <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                           <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                       </div>
                                   </motion.div>
                               )}
                           </AnimatePresence>
                        </div>
                        <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-center gap-3 border-t border-white/10 pt-4">
                            <input 
                                value={chatInput} 
                                onChange={(e) => setChatInput(e.target.value)} 
                                onKeyDown={handleKeyPress} 
                                placeholder={isListening ? "Listening..." : "Type your message..."} 
                                className="w-full bg-slate-800/70 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" 
                                disabled={isTranscribing}
                            />
                            <button
                                type="button"
                                onClick={handleToggleListening}
                                disabled={!!micError || isTranscribing}
                                className={`p-2.5 rounded-lg transition flex-shrink-0
                                    ${isListening 
                                        ? 'bg-red-500 text-white animate-pulse' 
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }
                                    ${!!micError ? 'bg-slate-800 cursor-not-allowed' : ''}
                                `}
                                title={micError || (isListening ? "Stop listening" : "Start listening")}
                            >
                                <MicIcon />
                            </button>
                            <button 
                                type="submit" 
                                className="bg-cyan-600 text-white rounded-lg p-2.5 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition flex-shrink-0" 
                                disabled={!chatInput.trim() || isListening || isTranscribing}
                            >
                                <SendIcon />
                            </button>
                        </form>
                         {micError && <p className="text-red-400 text-xs mt-2">{micError}</p>}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AppUI;

