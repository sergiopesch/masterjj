import { LandingHero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { VideoShowcase } from "@/components/landing/video-showcase"
import { Testimonials } from "@/components/landing/testimonials"
import { Benefits } from "@/components/landing/benefits"
import { CallToAction } from "@/components/landing/cta"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <LandingHero />
        <Features />
        <HowItWorks />
        <VideoShowcase />
        <Testimonials />
        <Benefits />
        <CallToAction />
      </main>
      <SiteFooter />
    </div>
  )
}