import React from 'react';
import { styles } from '../styles';
 

const Chatbot = () => {
  return (
    <section className="relative w-full h-screen mx-auto flex items-center justify-center">
     
      <div className="text-center z-10">
        <h1 className={`${styles.heroHeadText} text-white`}>Sylvi Chatbot</h1>
        <p className={`${styles.heroSubText} mt-2 text-white-100`}>
          Chatbot Interface Coming Soon...
        </p>
      </div>
    </section>
  );
};

export default Chatbot;