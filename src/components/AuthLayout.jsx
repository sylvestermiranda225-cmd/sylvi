import React from 'react';
import { motion } from 'framer-motion';
 

const AuthLayout = ({ children, title }) => {
  return (
    <section className="relative w-full h-screen mx-auto flex items-center justify-center p-4">
 
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-cyan-500/10">
          <div className="p-8 sm:p-12">
            <h2 className="text-center text-3xl sm:text-4xl font-bold text-white mb-8" style={{ textShadow: '0 0 15px rgba(173, 216, 230, 0.4)'}}>
              {title}
            </h2>
            {children}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AuthLayout;
