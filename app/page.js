import CallToAction from '@/components/CTA'
import FeaturesSection from '@/components/Features'
import HeroSection from '@/components/HeroSection'
import HowItWorks from '@/components/HowItWorks'
import React from 'react'

const page = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CallToAction />
    </div>
  )
}

export default page