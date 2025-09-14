import React from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';  
 

const EmotionIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="url(#icon-gradient)"/>
        <path d="M15.5 8C16.33 8 17 8.67 17 9.5C17 10.33 16.33 11 15.5 11C14.67 11 14 10.33 14 9.5C14 8.67 14.67 8 15.5 8ZM8.5 8C9.33 8 10 8.67 10 9.5C10 10.33 9.33 11 8.5 11C7.67 11 7 10.33 7 9.5C7 8.67 7.67 8 8.5 8Z" fill="url(#icon-gradient)"/>
        <path d="M12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="url(#icon-gradient)"/>
        <defs>
            <linearGradient id="icon-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E6B366"/>
                <stop offset="1" stopColor="#ADD8E6"/>
            </linearGradient>
        </defs>
    </svg>
);

const ToolingIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.44 12.9981L12.47 19.9681C12.38 20.0581 12.27 20.1281 12.15 20.1681C11.67 20.3581 11.11 20.1581 10.92 19.6781L9.12 14.8781L4.32 13.0781C3.84 12.8881 3.64 12.3281 3.83 11.8481C3.87 11.7281 3.94 11.6181 4.03 11.5281L11 4.55808C11.39 4.16808 12.02 4.16808 12.41 4.55808L19.44 11.5881C19.83 11.9781 19.83 12.6081 19.44 12.9981Z" stroke="url(#icon-gradient)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 8.99805L17.5 6.49805" stroke="url(#icon-gradient)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 18.998H7" stroke="url(#icon-gradient)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21.998L13 17.998" stroke="url(#icon-gradient)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="icon-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E6B366"/>
                <stop offset="1" stopColor="#ADD8E6"/>
            </linearGradient>
        </defs>
    </svg>
);

const DialogueIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z" stroke="url(#icon-gradient)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.9965 11H16.0054" stroke="url(#icon-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.9955 11H12.0045" stroke="url(#icon-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.99451 11H8.00349" stroke="url(#icon-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="icon-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E6B366"/>
                <stop offset="1" stopColor="#ADD8E6"/>
            </linearGradient>
        </defs>
    </svg>
);


// --- Reusable Feature Card Component ---

const FeatureCard = ({ index, title, description, icon }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 1, delay: index * 0.2 } }
        }}
        className="w-full sm:w-[280px] md:w-[320px] lg:w-[280px]"
    >
        <div
            className="w-full p-[2px] rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #E6B366, #007799)' }}
        >
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-[15px] p-6 min-h-[300px] flex flex-col items-center text-center">
                <div className="mb-4">
                    {icon}
                </div>
                <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
                <p className="text-secondary text-[15px] leading-relaxed">{description}</p>
            </div>
        </div>
    </motion.div>
);

// --- Main Features Component ---

const Features = () => {

    const featuresList = [
        {
            title: "Real-time Emotion AI",
            description: "Sylvi uses your webcam to perceive your emotional state in real-time, creating a truly responsive and personal interaction.",
            icon: <EmotionIcon />
        },
        {
            title: "Adaptive Tooling",
            description: "Feeling stressed? Sylvi suggests a calming playlist. Focused? It can help you tackle your to-do list. The right tool, right when you need it.",
            icon: <ToolingIcon />
        },
        {
            title: "Empathetic Dialogue",
            description: "Beyond just actions, Sylvi communicates with understanding. Receive generative AI responses that are supportive and tailored to your mood.",
            icon: <DialogueIcon />
        }
    ];

    return (
        <section id="features" className={`${styles.paddingX} py-16 sm:py-24 w-full max-w-7xl mx-auto`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ staggerChildren: 0.2 }}
            >
                {/* Section Header */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 1.5 } } }}
                    className="text-center mb-12"
                >
                    <p className={styles.sectionSubText}>What Sylvi Does</p>
                    <h2 className={styles.sectionHeadText}>Core Capabilities.</h2>
                </motion.div>

                {/* Feature Cards Container */}
                <div className="flex flex-wrap justify-center gap-10">
                    {featuresList.map((feature, index) => (
                        <FeatureCard key={feature.title} index={index} {...feature} />
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Features;