import React, { useEffect, useState } from "react";
// ## NEW ## - Import useNavigate for redirection after logout
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { navLinks } from "../constants"; 
import { close } from "../assets";

// SVG components remain the same
const SylviLogo = () => (<img src="./src/assets/logo.svg" alt="SYLVI Logo" width="36" height="36" />);
const LaunchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.455-2.456L12.75 18l1.178-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" /> </svg> );
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"> <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /> </svg> );


const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState("");
  const location = useLocation();
  const { pathname } = location;

  // ## NEW ## - Logic for Logout
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    navigate('/login'); // Redirect to login page
    // Optionally, you can also reset component state here if needed
    setActive("");
    setToggle(false);
  };
  // ## END NEW ##

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 100); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-3 fixed top-0 z-20 justify-center`}>
      <div className={`w-full max-w-7xl flex justify-between items-center rounded-full px-6 py-3 transition-all duration-300 border ${scrolled ? "bg-gray-900/80 backdrop-blur-lg border-white/10 shadow-lg" : "border-transparent"}`}>
        <Link to='/' className='flex items-center gap-3' onClick={() => { setActive(""); window.scrollTo(0, 0); }}>
          <SylviLogo />
          <p className='text-white text-[20px] font-bold cursor-pointer flex'>Sylvi</p>
        </Link>

        {/* --- Desktop Navigation --- */}
        <div className="hidden sm:flex items-center gap-6">
          <ul className='list-none flex flex-row gap-2 bg-black-100/30 p-1 rounded-full' onMouseLeave={() => setHovered("")}>
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`relative rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-300 ${active === nav.title ? "text-white" : "text-secondary"}`}
                onMouseEnter={() => setHovered(nav.title)}
              >
                {(hovered === nav.title || active === nav.title) && (
                  <motion.div className="absolute inset-0 bg-white/10 rounded-full" layoutId="bubble" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                
                {pathname === '/' ? (
                  <a href={`#${nav.id}`} onClick={(e) => handleScrollTo(e, nav.id)} className="relative z-10">{nav.title}</a>
                ) : (
                  <Link to={`/#${nav.id}`} className="relative z-10">{nav.title}</Link>
                )}
              </li>
            ))}
             {/* ## NEW ## - Desktop Logout Button */}
             {isAuthenticated && (
              <li
                className={`relative rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-300 text-secondary`}
                onMouseEnter={() => setHovered("logout")}
                onClick={handleLogout}
              >
                {(hovered === "logout") && (
                  <motion.div className="absolute inset-0 bg-white/10 rounded-full" layoutId="bubble" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <span className="relative z-10">Logout</span>
              </li>
            )}
            {/* ## END NEW ## */}
          </ul>
          
          {pathname !== '/agent' && pathname !== '/chatbot' && (
            <motion.a href="/agent" target="_blank" rel="noopener noreferrer" className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-200 rounded-full group bg-gradient-to-br from-cyan-500 to-gray-700 group-hover:from-cyan-500 group-hover:to-gray-800 hover:text-white" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-full group-hover:bg-opacity-0 flex items-center">
                <LaunchIcon />
                Launch Agent
              </span>
            </motion.a>
          )}
        </div>

        {/* --- Mobile Navigation --- */}
        <div className='sm:hidden flex items-center'>
          <button onClick={() => setToggle(!toggle)} className="z-20 text-white">
            {toggle ? <img src={close} alt='close' className='w-[28px] h-[28px] object-contain' /> : <MenuIcon />}
          </button>
          <AnimatePresence>
            {toggle && (
              <motion.div variants={mobileMenuVariants} initial="hidden" animate="visible" exit="hidden" className='p-6 bg-gray-900/90 backdrop-blur-lg border-l border-white/10 absolute top-0 right-0 h-screen w-2/3 z-10'>
                <ul className='list-none flex items-start flex-1 flex-col gap-6 mt-20'>
                  {navLinks.map((nav) => (
                    <motion.li
                      key={nav.id}
                      className={`font-poppins font-semibold cursor-pointer text-lg ${active === nav.title ? "text-white" : "text-secondary"}`}
                    >
                      {pathname === '/' ? (
                        <a href={`#${nav.id}`} onClick={(e) => { handleScrollTo(e, nav.id); setToggle(false); }}>{nav.title}</a>
                      ) : (
                        <Link to={`/#${nav.id}`} onClick={() => setToggle(false)}>{nav.title}</Link>
                      )}
                    </motion.li>
                  ))}
                  
                  {pathname !== '/agent' && pathname !== '/chatbot' && (
                    <motion.li className="mt-4">
                      <a href="/agent" target="_blank" rel="noopener noreferrer" className="font-poppins font-medium text-[16px] text-white flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-gray-700 py-2 px-4 rounded-lg" onClick={() => setToggle(false)}>
                        <LaunchIcon />
                        Launch Agent
                      </a>
                    </motion.li>
                  )}
                  
                  {/* ## NEW ## - Mobile Logout Button */}
                  {isAuthenticated && (
                    <motion.li className="mt-4">
                       <button
                        onClick={handleLogout}
                        className="font-poppins font-semibold cursor-pointer text-lg text-secondary"
                      >
                        Logout
                      </button>
                    </motion.li>
                  )}
                  {/* ## END NEW ## */}

                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;