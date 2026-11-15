"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Award, Globe2, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-label="Hero">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08, opacity: 0.55 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src="/watches/hero.png"
            alt="Luxury gold and black timepiece, macro photography"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/78 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:min-h-[82vh]">
        <motion.div
          className="max-w-2xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-gold"
          >
            <span className="gold-hairline w-10" />
            Est. 1987 — Geneva
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            Time,
            <br />
            <span className="italic text-gold-light">perfected.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            CHRONOS curates mechanical masterpieces from the world&apos;s most
            prestigious independent maisons. Each reference is authenticated,
            insured, and delivered to your door.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="animate-cta-glow h-12 bg-primary px-8 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:bg-gold-light"
            >
              <a href="#collection">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-border/80 bg-background/40 px-8 text-sm font-medium uppercase tracking-[0.14em] text-foreground backdrop-blur hover:border-gold/50 hover:text-gold"
            >
              <a href="#featured">The Vault</a>
            </Button>
          </motion.div>

          {/* Trust strip */}
          <motion.dl
            variants={fadeUp}
            className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-border/70 pt-7"
          >
            {[
              { icon: Award, k: "37", l: "Years of curation" },
              { icon: Globe2, k: "12", l: "Independent maisons" },
              { icon: Headset, k: "24/7", l: "Concierge service" },
            ].map(({ icon: Icon, k, l }) => (
              <div key={l} className="flex flex-col gap-1.5">
                <Icon className="h-5 w-5 text-gold" aria-hidden />
                <dt className="sr-only">{l}</dt>
                <dd className="font-serif text-2xl sm:text-3xl">{k}</dd>
                <dd className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {l}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
