"use client"

import React from "react"
import Image from "next/image"
import HeroBackground from "./herobackground"
import heros from "@/app/asset/home-side.png"

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center">
      <HeroBackground />

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-10">
        <div className="flex items-center justify-between">
          
          {/* Text */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              Welcome to Our Platform
            </h1>
            <p className="text-gray-600 text-lg">
              A safe community built to connect, empower, and elevate women.
            </p>
          </div>

          {/* Image */}
          <div className="w-[420px]">
            <Image
              src={heros}
              alt="Hero illustration"
              className="w-full h-auto"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  )
}
