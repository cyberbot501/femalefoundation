"use client"

import React from "react"
import Image from "next/image"
import HeroBackground from "./herobackground"
import heros from "@/app/asset/home-side.png"

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] w-full items-center">
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-12 sm:px-6 lg:px-10 lg:py-20 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="mb-4 text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl">
            Welcome to Our Platform
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            A safe community built to connect, empower, and elevate women.
          </p>
        </div>

        <div className="mt-10 w-full max-w-md md:mt-0 md:w-[420px]">
          <Image src={heros} alt="Hero illustration" className="h-auto w-full" priority />
        </div>
      </div>
    </section>
  )
}
