"use client"

import { motion } from "framer-motion"
import { Calendar, Video, BarChart, Users, Medal, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Class recommendations based on your skill level and availability.",
  },
  {
    icon: Video,
    title: "HD Video Library",
    description:
      "Access thousands of high-quality technique videos from world-class instructors.",
  },
  {
    icon: BarChart,
    title: "Progress Tracking",
    description:
      "Advanced analytics to monitor your improvement and identify growth areas.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Connect with training partners and join study groups for specific techniques.",
  },
  {
    icon: Medal,
    title: "Achievement System",
    description:
      "Earn badges and track your progression.",
  },
  {
    icon: BookOpen,
    title: "Technique Journal",
    description:
      "Document your learning journey with notes, videos, and personal insights.",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Everything you need to succeed
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform combines cutting-edge technology with a rich community to provide you with the most comprehensive training experience.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                <CardContent className="relative p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}