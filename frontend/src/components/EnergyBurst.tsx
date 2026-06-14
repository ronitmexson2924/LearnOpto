import React from "react";
import { motion } from "framer-motion";

interface EnergyBurstProps {
  active: boolean;
}

export const EnergyBurst: React.FC<EnergyBurstProps> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Central intense glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0.4], scale: [0, 2, 4] }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-[300px] h-[300px] bg-primary/40 rounded-full blur-[100px]"
      />

      {/* Outer Smoke Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 3, 5], rotate: 90 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute w-[500px] h-[500px] rounded-full border-[20px] border-primary/20 blur-[20px]"
      />

      {/* Inner sharp shockwave ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [1, 0], scale: [0, 5] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-[200px] h-[200px] rounded-full border-2 border-primary/80 shadow-[0_0_50px_#00ff66]"
      />
      
      {/* Secondary sharp shockwave ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [1, 0], scale: [0, 4] }}
        transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
        className="absolute w-[200px] h-[200px] rounded-full border border-primary/50 shadow-[0_0_30px_#00ff66]"
      />
    </div>
  );
};
