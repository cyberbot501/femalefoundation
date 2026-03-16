"use client"

import PatternBackground from "./PatternBackground"
import { motion } from "framer-motion"

export default function CommunityCTA() {
  return (
    <section className="py-32 bg-gray-50 px-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 90 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[360px] rounded-2xl overflow-hidden bg-accent text-white flex items-center justify-center"
      >
        <PatternBackground />

        <div className="relative z-10 text-center px-6">
          <h3 className="text-lg mb-4">
            Looking to connect with other members?
          </h3>

          <button className="mt-2 px-4 py-2 bg-white text-black rounded-md text-sm">
            Join the Community
          </button>
        </div>
      </motion.div>
    </section>
  )
}