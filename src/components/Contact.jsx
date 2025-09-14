import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
 
import { slideIn, textVariant } from "../utils/motion";

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.5a.75.75 0 01.75.75v.258a3.75 3.75 0 017.294 1.253 1.5 1.5 0 01-2.016 1.45A4.502 4.502 0 0012 4.75v-.258a.75.75 0 01-.75-.75.75.75 0 01.75-.75zM12 4.75a4.5 4.5 0 00-5.278 3.461 1.5 1.5 0 01-2.016-1.45A3.75 3.75 0 0112 4.75zM12 14.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5zM12 21a8.25 8.25 0 006.547-3.262.75.75 0 00-1.094-1.022A6.75 6.75 0 0112 18.75a6.75 6.75 0 01-5.453-2.534.75.75 0 00-1.094 1.022A8.25 8.25 0 0012 21z" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.75.75 0 00-.677.677 48.901 48.901 0 01-.383 3.476c-.292 1.978-2.024 3.348-3.97 3.348h-6.02c-1.946 0-3.678-1.37-3.97-3.348a48.901 48.901 0 01-.383-3.476.75.75 0 00-.677-.677 48.901 48.901 0 01-3.476-.383C2.25 16.502 1.5 15.27 1.5 13.5v-6.02c0-1.946 1.37-3.678 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L10.5 12.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5z" clipRule="evenodd" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></svg>;

const StatusDisplay = ({ status }) => {
    const loadingMessages = ["Connecting to mail server...", "Transmitting data packets...", "Awaiting confirmation..."];
    const [messageIndex, setMessageIndex] = useState(0);
    useEffect(() => { if (status === 'loading') { setMessageIndex(0); const interval = setInterval(() => { setMessageIndex(prevIndex => (prevIndex >= loadingMessages.length - 1) ? prevIndex : prevIndex + 1); }, 800); return () => clearInterval(interval); } }, [status]);
    const statusMap = {
        toxicError: <motion.div key="toxicError" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-red-400"><ErrorIcon /> Message flagged as inappropriate.</motion.div>,
        captchaError: <motion.div key="captchaError" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-orange-400"><ErrorIcon /> Please complete the CAPTCHA.</motion.div>,
        loading: <motion.p key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-cyan-400">{loadingMessages[messageIndex]}</motion.p>,
        success: <motion.div key="success" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-green-400"><CheckIcon /> Success! I'll get back to you soon.</motion.div>,
        error: <motion.div key="error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-red-400"><ErrorIcon /> Submission Failed.</motion.div>,
        validationError: <motion.div key="validationError" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-orange-400"><ErrorIcon /> Please fill out all fields.</motion.div>
    };
    return (<div className="h-8 flex items-center justify-center font-mono text-sm"><AnimatePresence mode="wait">{statusMap[status]}</AnimatePresence></div>);
};

const EnhancedInput = ({ type = 'text', name, value, onChange, label, Icon, rows }) => {
    const id = `input-${name}`;
    const InputTag = rows ? 'textarea' : 'input';
    return (<div className="relative group"><InputTag id={id} type={type} name={name} value={value} onChange={onChange} rows={rows} placeholder=" " className={`peer block w-full bg-transparent text-white px-1 pt-4 pb-1 appearance-none focus:outline-none focus:ring-0 ${rows ? 'resize-none' : ''}`} /><label htmlFor={id} className="absolute top-4 left-0 text-gray-400 duration-300 transform -translate-y-4 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-purple-400 flex items-center gap-2 transition-all">{Icon && <Icon />} {label}</label><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-600" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" /></div>);
};

const GradientBorderButton = ({ children, icon, loading = false, statusText = "" }) => {
    const buttonVariants = { initial: { backgroundPosition: "0% 50%" }, hover: { backgroundPosition: "100% 50%" } };
    return (<motion.button type='submit' variants={buttonVariants} initial="initial" whileHover="hover" whileTap={{ scale: 0.95 }} transition={{ duration: 0.5, ease: "easeInOut" }} disabled={loading} className="relative p-[2px] rounded-lg w-fit self-center disabled:opacity-60 disabled:cursor-not-allowed" style={{ backgroundImage: 'linear-gradient(90deg, #4285F4, #9B59B6, #F44336, #00BCD4, #4285F4)', backgroundSize: '400% 400%' }}><div className="w-full h-full px-8 py-3 rounded-[6px] bg-gray-900 text-white font-bold"><span className="inline-flex items-center gap-3 w-full justify-center">{loading ? statusText : children}{!loading && icon}</span></div></motion.button>);
};
 
const CalComLoader = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });  
    const calComLink = "https://cal.com/sylvester-i9xy2l/30min";

    return (
        <div ref={ref} className="w-full h-full">
            {isInView ? (
                <iframe
                    src={calComLink}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{
                        borderRadius: '1.5rem',  
                        minHeight: '380px' 
                    }}
                ></iframe>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#151030] rounded-3xl">
                    <p className="font-mono text-sm text-gray-400">Loading scheduler...</p>
                </div>
            )}
        </div>
    );
};

const Contact = () => {
    const formRef = useRef();
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submissionStatus, setSubmissionStatus] = useState('idle');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = useRef();
 
    useEffect(() => {
        if (['success', 'error', 'validationError', 'toxicError', 'captchaError'].includes(submissionStatus)) {
            const timer = setTimeout(() => setSubmissionStatus('idle'), 5000);
            return () => clearTimeout(timer);
        }
    }, [submissionStatus]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. CHECK CAPTCHA FIRST
        if (!recaptchaToken) {
            setSubmissionStatus('captchaError');
            return;
        }

        // 2. CHECK FOR EMPTY FIELDS
        if (!form.name || !form.email || !form.message) {
            setSubmissionStatus('validationError');
            recaptchaRef.current.reset(); // Also reset captcha here
            setRecaptchaToken(null);
            return;
        }
        
        // 3. CHECK FOR BAD WORDS
        const messageToCheck = form.message.toLowerCase();
        const foundKonkaniBadWord = konkaniBadWords.some(word => messageToCheck.includes(word));

        if (foundKonkaniBadWord) {
            setSubmissionStatus('toxicError');
            recaptchaRef.current.reset();
            setRecaptchaToken(null);
            return;
        }

        // --- PROCEED WITH SUBMISSION IF ALL CHECKS PASS ---
        try {
            setSubmissionStatus('loading');

            await emailjs.sendForm(
                'service_jacve05',
                'template_fg4v3xt',
                formRef.current,
                'wGjzRdFMA4SMczjh9'  
            );

            setSubmissionStatus('success');
            setForm({ name: "", email: "", message: "" });

            recaptchaRef.current.reset();
            setRecaptchaToken(null);

        } catch (error) {
            setSubmissionStatus('error');
        }
    };

    const getButtonStatus = () => {
        if (submissionStatus === 'loading') return { text: "Sending...", loading: true };
        return { text: "Send Message", loading: false };
    };
    const buttonStatus = getButtonStatus();

    return (
        <>
            <motion.div variants={textVariant()}><p className={styles.sectionSubText}>Get in touch</p><h2 className={styles.sectionHeadText}>Contact.</h2></motion.div>
            <div className="mt-12 flex flex-col xl:flex-row gap-10 overflow-hidden">
                <motion.div variants={slideIn("left", "tween", 0.2, 1)} className='flex-[0.75] bg-black-100/50 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-2xl shadow-purple-900/50'>
                    <form ref={formRef} onSubmit={handleSubmit} className='flex flex-col gap-8'>
                        <p className="text-secondary text-center -mb-4">Send a message</p>
                        <EnhancedInput name="name" label="Your Name" value={form.name} onChange={handleChange} Icon={UserIcon} />
                        <EnhancedInput type="email" name="email" label="Your Email" value={form.email} onChange={handleChange} Icon={EmailIcon} />
                        <EnhancedInput name="message" label="Your Message" value={form.message} onChange={handleChange} Icon={MessageIcon} rows={4} />

                        <div className="self-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey="6Ld4Cq4rAAAAAMs0WQlvoyNTQEEJjJJqjv_VzquH"  
                                onChange={(token) => setRecaptchaToken(token)}
                                onExpired={() => setRecaptchaToken(null)}
                                theme="dark"
                            />
                        </div>

                        <StatusDisplay status={submissionStatus} />
                        <GradientBorderButton loading={buttonStatus.loading} statusText={buttonStatus.text} icon={<SendIcon />}>
                            {buttonStatus.text}
                        </GradientBorderButton>
                    </form>
                </motion.div>
                <motion.div variants={slideIn("right", "tween", 0.2, 1)} className='xl:flex-1 w-full xl:h-auto md:h-full h-[400px]'>
                    <div className="bg-black-100/50 backdrop-blur-sm p-6 rounded-3xl w-full h-full flex flex-col shadow-2xl border border-white/10">
                        <p className="text-secondary text-center mb-4">Or, book a time directly:</p>
                        <div className="flex-grow w-full h-full"><CalComLoader /></div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default SectionWrapper(Contact, "contact");