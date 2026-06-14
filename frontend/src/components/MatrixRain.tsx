import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface MatrixRainProps {
  active: boolean;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const charsArray = matrixChars.split("");

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100; // start off-screen randomly
    }

    const draw = () => {
      // Translucent black background to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff66"; // Neon green text
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = charsArray[Math.floor(Math.random() * charsArray.length)];

        // x = i * fontSize, y = value of drops[i] * fontSize
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33); // ~30fps

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-0 pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full opacity-60" />
      {/* Dark overlay to make it blend into the background better */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />
    </motion.div>
  );
};
