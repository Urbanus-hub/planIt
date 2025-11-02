"use client";

import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="w-16 h-8 sm:w-[4.5rem] sm:h-9 bg-gray-200 rounded-full animate-pulse" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-16 h-8 sm:w-[4.5rem] sm:h-9 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-inner"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {/* Background gradient when dark */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-dark via-green-main to-green-light opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

      {/* Sliding circle */}
      <motion.div
        className="relative w-6 h-6 sm:w-7 sm:h-7 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center z-10"
        initial={false}
        animate={{
          x: theme === "dark" ? "100%" : "0%",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Sun/Moon icons */}
        <motion.div
          initial={false}
          animate={{
            scale: theme === "dark" ? 0 : 1,
            rotate: theme === "dark" ? 180 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            rotate: theme === "dark" ? 0 : -180,
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
        </motion.div>
      </motion.div>

      {/* Decorative stars for dark mode */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full"
            style={{
              top: `${20 + i * 20}%`,
              right: `${15 + i * 10}%`,
            }}
            initial={false}
            animate={{
              opacity: theme === "dark" ? [0, 1, 0] : 0,
              scale: theme === "dark" ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </motion.button>
  );
}
