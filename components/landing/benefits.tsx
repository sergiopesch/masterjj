"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const benefits = [
  {
    title: "Personalized Learning Path",
    description:
      "Get a customized training program based on your skill level and goals.",
  },
  {
    title: "Expert Instruction",
    description:
      "Learn from world-class instructors with proven teaching methodologies.",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your improvement with detailed analytics and performance metrics.",
  },
  {
    title: "Community Support",
    description:
      "Connect with fellow practitioners and share your martial arts journey.",
  },
  {
    title: "Flexible Schedule",
    description:
      "Train at your own pace with 24/7 access to video content and resources.",
  },
  {
    title: "Regular Updates",
    description:
      "Access new techniques and training materials added weekly to the platform.",
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Benefits
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Why choose BJJ Master?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover the advantages of training with our comprehensive platform.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h3 className="font-bold">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}