import React, { useRef, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';
import { useSpring, animated } from "@react-spring/three";
import { styles } from "../styles"; // Assuming your styles are correctly imported

// GLSL code for the glossy, fluid background
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  varying vec2 vUv;

  // 2D Random and Noise functions (remain the same)
  float random (vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  float noise (vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 p = vUv * 5.0;
    float t = u_time * 0.1;
    float n = noise(p + t);
    float n2 = noise(p * 2.0 - t);
    float n3 = noise(p * 4.0 + t);
    
    float combined_noise = (n + n2 * 0.5 + n3 * 0.25) / 1.75;
    
    // ## COLOR CHANGE HERE ##
    // The palette is updated with a soft gold highlight instead of white.
    vec3 color1 = vec3(0.05, 0.05, 0.15); // Deep navy blue
    vec3 color2 = vec3(0.1, 0.2, 0.4);   // Muted cyan
    vec3 color3 = vec3(0.9, 0.7, 0.4);   // Soft elegant gold highlight
    
    vec3 final_color = mix(color1, color2, smoothstep(0.2, 0.6, combined_noise));
    final_color = mix(final_color, color3, smoothstep(0.7, 0.8, combined_noise));
    
    float vignette = 1.0 - length(vUv - 0.5) * 0.8;
    
    gl_FragColor = vec4(final_color * vignette, 1.0);
  }
`;

// Background component remains structurally the same, using the new shader.
const GlossyBackground = () => {
    const material = useRef();
    useFrame(({ clock }) => {
        if (material.current) {
            material.current.uniforms.u_time.value = clock.getElapsedTime();
        }
    });
    const uniforms = useMemo(() => ({ u_time: { value: 0.0 } }), []);
    return (
        <mesh>
            <planeGeometry args={[10, 10]} />
            <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
        </mesh>
    );
};
const BackgroundCanvas = () => (
    <Canvas camera={{ position: [0, 0, 1], fov: 75 }} className="absolute inset-0 z-[-1]">
        <GlossyBackground />
    </Canvas>
);

// --- Reusable Components (Updated with new gold accent color) ---

const AnimatedTextWord = ({ text }) => {
  const words = text.split(" ");
  const container = { hidden: { opacity: 0 }, visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.05 * i } }) };
  const child = { visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }, hidden: { opacity: 0, y: 20, transition: { type: "spring", damping: 12, stiffness: 100 } } };
  return (
    <motion.h1 
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white font-sans leading-tight" 
      // ## COLOR CHANGE HERE ## - Text shadow updated to gold
      style={{ textShadow: '0 0 30px rgba(230, 179, 102, 0.5)'}} 
      variants={container} 
      initial="hidden" 
      animate="visible"
    >
      {words.map((word, index) => (<motion.span key={index} variants={child} className="mr-3 sm:mr-4 inline-block">{word}</motion.span>))}
    </motion.h1>
  );
};

const MagneticButton = ({ children, href }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [textKey, setTextKey] = useState(0);
    useEffect(() => { const intervalId = setInterval(() => { setTextKey(prevKey => prevKey + 1); }, 4000); return () => clearInterval(intervalId); }, []);
    const textVariants = { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '-100%' } };
    const letterContainerVariants = { initial: {}, animate: { transition: { staggerChildren: 0.05 } }, exit: {} };
    return (
        <motion.a href={href} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} whileTap={{ scale: 0.95 }} className="relative block overflow-hidden rounded-lg p-[2px] text-lg sm:text-xl font-semibold">
            <AnimatePresence>
                {isHovered && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.3 } }} className="absolute inset-0 h-full w-full">
                        {/* ## COLOR CHANGE HERE ## - Button gradient updated to gold and white */}
                        <motion.div style={{ background: 'conic-gradient(from 0deg, #E6B366, #FFFFFF, #E6B366)' }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }} className="absolute inset-0 h-full w-full" />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="relative z-10 flex h-full w-full items-center justify-center rounded-[7px] bg-gray-900/50 px-8 py-3 sm:px-10 sm:py-4 backdrop-blur-sm border border-white/10"><div className="relative flex h-[1.5em] items-center overflow-hidden whitespace-nowrap text-white"><AnimatePresence mode="popLayout"><motion.div key={textKey} variants={letterContainerVariants} initial="initial" animate="animate" exit="exit">{children.split('').map((char, index) => (<motion.span key={`${char}-${index}`} variants={textVariants} transition={{ duration: 0.4, ease: 'easeOut' }} className="inline-block">{char === ' ' ? '\u00A0' : char}</motion.span>))}</motion.div></AnimatePresence></div></div>
        </motion.a>
    );
};

const createGlowTexture = () => {
     
    const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128; const context = canvas.getContext('2d'); const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64); 
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); 
    gradient.addColorStop(0.2, 'rgba(255, 220, 180, 0.9)'); 
    gradient.addColorStop(0.6, 'rgba(230, 179, 102, 0.4)'); 
    gradient.addColorStop(1, 'rgba(230, 179, 102, 0)'); 
    context.fillStyle = gradient; context.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(canvas);
};


const DynamicAIBrain = () => {
    // ... (This component's code remains the same as the previous elegant version)
    const groupRef = useRef();
    const { scale, opacity } = useSpring({ from: { scale: 0.5, opacity: 0 }, to: { scale: 1, opacity: 1 }, config: { duration: 2500, tension: 120, friction: 20 }, delay: 600 });
    const glowTexture = useMemo(() => createGlowTexture(), []);
    const points = useMemo(() => { const p = []; const radius = 4; const numPoints = 300; for (let i = 0; i < numPoints; i++) { const position = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize().multiplyScalar(radius); const randomVec = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize(); const velocity = new THREE.Vector3().crossVectors(position, randomVec).normalize().multiplyScalar(0.15); p.push({ position, velocity }); } return p; }, []);
    const pointPositions = useMemo(() => new Float32Array(points.flatMap(p => p.position.toArray())), [points]);
    const lineGeometry = useMemo(() => { const geom = new THREE.BufferGeometry(); geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points.length * points.length * 3), 3)); return geom; }, [points.length]);
    useFrame((state, delta) => { if (groupRef.current) { groupRef.current.rotation.y += delta * 0.05; groupRef.current.rotation.x += delta * 0.01; } points.forEach((point, i) => { point.position.addScaledVector(point.velocity, delta); point.position.normalize().multiplyScalar(4); pointPositions.set(point.position.toArray(), i * 3); }); const positions = lineGeometry.attributes.position.array; let lineIndex = 0; for (let i = 0; i < points.length; i++) { for (let j = i + 1; j < points.length; j++) { if (points[i].position.distanceTo(points[j].position) < 1.3) { positions[lineIndex++] = points[i].position.x; positions[lineIndex++] = points[i].position.y; positions[lineIndex++] = points[i].position.z; positions[lineIndex++] = points[j].position.x; positions[lineIndex++] = points[j].position.y; positions[lineIndex++] = points[j].position.z; } } } lineGeometry.setDrawRange(0, lineIndex / 3); lineGeometry.attributes.position.needsUpdate = true; });
    return (
        <animated.group ref={groupRef} scale={scale}>
            <points>
                <bufferGeometry><bufferAttribute attach="attributes-position" count={points.length} array={pointPositions} itemSize={3} /></bufferGeometry>
                <animated.pointsMaterial map={glowTexture} size={0.2} color="#FFD700" transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={opacity} />
            </points>
            <lineSegments geometry={lineGeometry}>
                {/* Lines are kept a subtle, complementary cyan */}
                <animated.lineBasicMaterial color="#007799" transparent opacity={opacity.to(o => o * 0.25)} />
            </lineSegments>
        </animated.group>
    );
};

const AIBrainCanvas = () => (
    <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <DynamicAIBrain />
        </Canvas>
    </div>
);

 
const Hero = () => {
  return (
    <section id="home" className="relative w-full h-screen mx-auto font-tech overflow-hidden">
      <BackgroundCanvas />
      <div className={`absolute inset-0 top-[100px] max-w-7xl mx-auto ${styles.paddingX} flex flex-col items-center justify-start text-center gap-10`}>
        <div className="flex flex-col items-center gap-4 z-10 font-orbitron ">
            <AnimatedTextWord text="Introducing Sylvi" />
            <motion.h2 className="  text-xl sm:text-2xl text-gray-300 tracking-wider" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 1.0 }}>
              Your Personal AI Companion
            </motion.h2>
            <motion.p className="mt-2 text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1.0 }}>
              Sylvi elegantly interprets your emotional state to provide insightful support, enhancing focus and fostering well-being.
            </motion.p>
        </div>
        <div className="relative w-72 h-60 lg:w-96 lg:h-80 -mt-8 z-0">
            <AIBrainCanvas />
        </div>

        {/* ## UPDATED - Two buttons for two separate applications ## */}
        <motion.div 
          className="mt-2 z-10 flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 1.6, duration: 1.0 }}
        >
          {/* Button 1: Links to the /agent route in a new tab */}
          <MagneticButton href="/agent" target="_blank">
            Launch Emotional AI
          </MagneticButton>
          
          {/* Button 2: Links to the /chatbot route in a new tab */}
          <MagneticButton href="/chatbot" target="_blank">
            Open Chatbot
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;