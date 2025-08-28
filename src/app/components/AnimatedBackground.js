'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle configuration
    const numberOfParticles = 100; // Reduced from 150
    const maxDistance = 150; // Reduced from 200
    const particleSize = 2;
    const particleSpeed = 0.5; // Reduced speed

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * particleSpeed;
        this.vy = (Math.random() - 0.5) * particleSpeed;
        this.size = Math.random() * particleSize + 1;
        this.velocity = Math.random() * 0.02 + 0.01; // Reduced velocity
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        // Update position with spiral motion
        this.angle += this.velocity;
        this.x += this.vx + Math.cos(this.angle) * 0.3;
        this.y += this.vy + Math.sin(this.angle) * 0.3;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        // Create radial gradient for particles
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.8)');
        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.6)');
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    // Animation loop
    let animationFrameId;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1e1b4b');    // Dark blue
      gradient.addColorStop(0.25, '#312e81');  // Indigo
      gradient.addColorStop(0.5, '#3730a3');   // Purple
      gradient.addColorStop(0.75, '#4338ca');  // Violet
      gradient.addColorStop(1, '#6366f1');     // Light indigo

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some floating orbs (reduced frequency)
      for (let i = 0; i < 2; i++) { // Reduced from 3
        const time = Date.now() * 0.0005; // Reduced speed from 0.001
        const x = Math.sin(time + i * 2) * canvas.width * 0.3 + canvas.width * 0.5;
        const y = Math.cos(time + i * 1.5) * canvas.height * 0.3 + canvas.height * 0.5;
        const size = Math.sin(time * 1.5 + i) * 30 + 60; // Reduced size and speed

        const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        orbGradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
        orbGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)');
        orbGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      // Draw connections
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(147, 51, 234, ${opacity * 0.3})`; // Reduced opacity
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    }

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
