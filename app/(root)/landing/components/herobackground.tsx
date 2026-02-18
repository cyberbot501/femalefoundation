"use client"

import { motion } from "framer-motion"

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200" />

      {/* Curved lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M0 200 C 300 100, 600 300, 900 200 S 1440 250, 1440 250"
          stroke="#D1D5DB"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />

        <motion.path
          d="M0 500 C 400 600, 800 400, 1200 500 S 1440 450, 1440 450"
          stroke="#E5E7EB"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 0.3 }}
        />
      </motion.svg>

      {/* Floating shapes */}
      <motion.div
        className="absolute top-24 left-20 w-16 h-16 rounded-full bg-gray-300/40"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-32 right-24 w-24 h-24 rounded-full bg-gray-400/20"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Arrow line */}
      <motion.svg
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        width="200"
        height="80"
        viewBox="0 0 200 80"
        fill="none"
      >
        <motion.path
          d="M10 40 H170"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeDasharray="6 6"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
        <path
          d="M170 35 L185 40 L170 45"
          fill="#9CA3AF"
        />
      </motion.svg>
    </div>
  )
}
