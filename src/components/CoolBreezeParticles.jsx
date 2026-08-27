import React, { useEffect, useRef } from 'react';

export const CoolBreezeParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate lightweight snowflake / frost particles
    const particleCount = Math.min(Math.floor(width / 35), 45);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 0.8,
        density: Math.random() * 20 + 5,
        color: `rgba(186, 230, 253, ${Math.random() * 0.4 + 0.15})`,
        alpha: Math.random() * 0.5 + 0.2,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.8 + 0.3,
        swing: Math.random() * 2,
        swingStep: Math.random() * 0.02
      });
    }

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.01;

      particles.forEach((p) => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, 'rgba(224, 242, 254, 0.8)');
        gradient.addColorStop(0.5, p.color);
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2, false);
        ctx.fill();

        // Update position with gentle breeze swaying
        p.y += p.speedY;
        p.x += Math.sin(step + p.swing) * 0.5 + p.speedX;

        // Wrap around boundaries
        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-75"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
