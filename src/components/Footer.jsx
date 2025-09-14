import React from "react";
import { motion } from "framer-motion";

// Re-using the SylviLogo for consistent branding in the footer
const SylviLogoSmall = () => (
        <img src="./src/assets/logo.svg" alt="SYLVI Logo" width="36" height="36" />
);


const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full py-8 px-6 sm:px-16 z-10 flex justify-center items-center"
    >
      {/* Glossy / Glassmorphic background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md rounded-t-3xl border-t border-x border-white/10 shadow-lg" />
      
      {/* Subtle glowing border */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse-slow" />

      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-center sm:text-left text-white/70">
        
        {/* Sylvi Logo and Project Name */}
        <div className="flex items-center gap-3">
            <SylviLogoSmall />
            <p className="text-lg font-bold">Sylvi  </p>
        </div>

        {/* Copyright Information */}
        <p className="text-sm font-light">
          &copy; {year} All Rights Reserved.
        </p>

        {/* You can add more elegant dividers or design elements here if needed */}
      </div>
    </motion.footer>
  );
};

export default Footer;