"use client";

import React from 'react'
import Hero from "./components/hero"
import Mission from "./components/mission"
import Highlight from "./components/hightlight"
import CallToAction from "./components/calltoaction"
import Supporters from "./components/supporters"
import ActivitiesSection from "./components/actives"
import CommunityCTA from "./components/communityact"

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      {/* <Highlight /> */}
      <CallToAction />
      <Supporters />
      <ActivitiesSection />
      <CommunityCTA />
    </>
  )
}