"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoShowcase() {
  return (
    <section id="video-showcase" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Video Showcase
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Learn from the best instructors
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Watch world-class BJJ practitioners demonstrate techniques and share their knowledge.
            </p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Button
                size="lg"
                className="h-16 w-16 rounded-full"
                variant="secondary"
              >
                <Play className="h-6 w-6" />
                <span className="sr-only">Play video</span>
              </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Button
                size="lg"
                className="h-16 w-16 rounded-full"
                variant="secondary"
              >
                <Play className="h-6 w-6" />
                <span className="sr-only">Play video</span>
              </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
          </div>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
          </div>
        </div>
      </div>
    </section>
  )
}