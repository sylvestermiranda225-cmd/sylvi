// src/components/SuggestedActivities.jsx

import React from 'react';
import { motion } from "framer-motion";

// --- Icons for different activities ---
const MusicNoteIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>);
const VideoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-4.5 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);


const activityIcons = {
    music: <MusicNoteIcon />,
    video: <VideoIcon />,
    idea: <LightbulbIcon />
};

const SuggestedActivities = ({ onSelectSuggestion }) => {
    // **NOTE**: In a real application, this data would come from your AI/API response.
    // This is hardcoded for demonstration purposes.
    const suggestions = [
        { type: 'music', title: "Listen to calm music", description: "A curated playlist to help you relax.", query: "Play calm instrumental music" },
        { type: 'video', title: "Watch a funny video", description: "Laughter is the best medicine!", query: "Find a funny cat video on YouTube" },
        { type: 'idea', title: "Ask for a joke", description: "Let me try to make you smile.", query: "Tell me a joke" },
    ];

    return (
        <motion.div className="w-full h-full bg-[#161b22]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="flex-shrink-0 text-white font-bold text-xl pb-4 border-b border-white/10 mb-4">
                Suggested Activities
            </h3>
            <div className="flex-grow space-y-3 overflow-y-auto pr-2">
                {suggestions.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        onClick={() => onSelectSuggestion(item.query)}
                        className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors duration-300"
                    >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                            {activityIcons[item.type]}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-200">{item.title}</p>
                            <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default SuggestedActivities;