"use client"

import { motion } from "framer-motion"

export default function PatternBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 800 800"
        fill="none"
      >
        {[...Array(6)].map((_, i) => (
          <motion.path
            key={i}
            d={`M0 ${150 + i * 90} Q400 ${100 + i * 80} 800 ${150 + i * 90}`}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>
    </div>
  )
}