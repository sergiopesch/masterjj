'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Video } from 'lucide-react';

export function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/5 to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/90" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/tight xl:text-7xl/tight max-w-3xl">
                Master your technique,{' '}
                <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                  Elevate your Game
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-lg sm:text-xl leading-relaxed">
                The ultimate platform for BJJ practitioners and instructors.
                Track your progress, book classes, and refine your skills with
                our comprehensive tools.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="sm:text-lg h-12 px-8">
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="sm:text-lg h-12 px-8 bg-background/50 backdrop-blur-sm hover:bg-background/80"
              >
                Watch Demo
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-border/40">
              {[
                {
                  icon: Users,
                  title: '10K+',
                  description: 'Active Students',
                },
                {
                  icon: GraduationCap,
                  title: '500+',
                  description: 'Expert Instructors',
                },
                {
                  icon: Video,
                  title: '1000+',
                  description: 'Video Lessons',
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex flex-col items-center gap-3 p-4"
                >
                  <div className="p-3 rounded-full bg-primary/10 backdrop-blur-sm">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {stat.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-primary/0 blur-3xl opacity-20" />
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-muted">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
