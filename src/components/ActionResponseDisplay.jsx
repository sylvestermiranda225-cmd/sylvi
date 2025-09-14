import React from 'react';
import { motion } from "framer-motion";

 
const SylviIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.455-2.456L12.75 18l1.178-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" /></svg>);

const LinkRenderer = ({ text }) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return (<span>{parts.map((part, index) => urlRegex.test(part) ? <a href={part} key={index} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{part}</a> : <span key={index}>{part}</span>)}</span>);
};


const ActionResponseDisplay = ({ response }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50, transition: {duration: 0.3} }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-[#161b22]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full"
        >
            <div className="flex items-center gap-4 pb-4 mb-4 border-b border-white/10">
                <div className="text-cyan-400 p-2.5 bg-slate-800/50 rounded-full flex items-center justify-center">
                   <SylviIcon />
                </div>
                <h3 className="text-white font-bold text-xl">Workflow Response</h3>
            </div>
            <div className="text-slate-300 leading-relaxed text-base">
                <LinkRenderer text={response} />
            </div>
        </motion.div>
    );
};

export default ActionResponseDisplay;