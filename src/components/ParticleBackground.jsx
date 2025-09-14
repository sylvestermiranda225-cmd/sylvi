import React, { useEffect, useRef, useMemo } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  const particles = useMemo(() => {
    const particleArray = [];
    const numberOfParticles = (window.innerWidth * window.innerHeight) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;
      let directionX = Math.random() * 0.4 - 0.2;
      let directionY = Math.random() * 0.4 - 0.2;
      let size = Math.random() * 2 + 1;
      particleArray.push({ x, y, directionX, directionY, size });
    }
    return particleArray;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let animationFrameId;

    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let distance =
            ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
            ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = 'rgba(140, 37, 168,' + opacityValue + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].x += particles[i].directionX;
        particles[i].y += particles[i].directionY;

        if (particles[i].x > canvas.width || particles[i].x < 0) {
          particles[i].directionX = -particles[i].directionX;
        }
        if (particles[i].y > canvas.height || particles[i].y < 0) {
          particles[i].directionY = -particles[i].directionY;
        }
        ctx.fillStyle = 'rgba(140, 37, 168, 0.8)';
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, particles[i].size, 0, Math.PI * 2);
        ctx.fill();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-[-2]" />;
};

export default ParticleBackground;