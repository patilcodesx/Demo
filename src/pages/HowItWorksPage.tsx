import { LandingHeader } from "@/components/LandingHeader";
import { LandingFooter } from "@/components/LandingFooter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    num: "01",
    title: "Create a Workspace",
    description: "Set up your team workspace in seconds. Invite members via email or link.",
  },
  {
    num: "02",
    title: "Start Collaborating",
    description: "Chat, share code snippets, and open live coding sessions together.",
  },
  {
    num: "03",
    title: "Ship with AI",
    description: "Let AI review your code, generate docs, and summarize meetings automatically.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">How It Works</h1>
            <p className="text-lg text-muted-foreground">Get started in three simple steps.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-8 items-start"
              >
                <div className="text-6xl md:text-8xl font-black text-muted/80 font-mono-code shrink-0 leading-none">
                  {step.num}
                </div>
                <div className="pt-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{step.title}</h2>
                  <p className="text-lg text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-24 p-12 rounded-2xl border border-border bg-card"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="text-gradient">Ship Faster</span>?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Join thousands of developers already collaborating on TalkFly. Free to start, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <button className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/features">
                <button className="inline-flex items-center rounded-full border border-border px-8 py-3 font-semibold text-foreground hover:bg-accent transition-colors">
                  See Features
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
