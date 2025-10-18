"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingIcon {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  icon: string;
}

const CHAT_ICONS = [
  "💬",
  "❓",
  "🤖",
  "🎟️",
  "💡",
  "🔍",
  "📝",
  "💭",
  "🎯",
  "⚡",
  "🌟",
  "🔔",
  "📊",
  "🎨",
  "🚀",
  "💎",
];

export default function AnimatedBackground() {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    const generateIcons = () => {
      const newIcons: FloatingIcon[] = [];
      const iconCount = 12; // Number of floating icons

      for (let i = 0; i < iconCount; i++) {
        newIcons.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 0.5 + 0.3, // Size between 0.3 and 0.8
          rotation: Math.random() * 360,
          delay: Math.random() * 2,
          duration: Math.random() * 20 + 15, // Duration between 15-35 seconds
          icon: CHAT_ICONS[Math.floor(Math.random() * CHAT_ICONS.length)],
        });
      }
      setIcons(newIcons);
    };

    generateIcons();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background gradient matching dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />

      {/* Floating background elements like dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 0.7 }}
        className="absolute bottom-20 right-20 w-40 h-40 bg-accent/20 rounded-full blur-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 0.9 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-secondary/10 rounded-full blur-2xl"
      />

      {/* Subtle floating icons */}
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute text-2xl opacity-10 dark:opacity-5 select-none"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            fontSize: `${icon.size}rem`,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            rotate: icon.rotation,
          }}
          animate={{
            opacity: [0, 0.1, 0.05, 0.1, 0],
            scale: [0, 1, 0.8, 1, 0],
            rotate: [icon.rotation, icon.rotation + 180],
            y: [0, -20, 20, 0],
          }}
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icon.icon}
        </motion.div>
      ))}
    </div>
  );
}
