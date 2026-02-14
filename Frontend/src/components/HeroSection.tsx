import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "./ui/button";

const codeLines = [
  { text: 'const workspace = await TalkFly.create({', color: 'text-foreground' },
  { text: '  team: ', color: 'text-foreground', value: '"rocket-squad"', valueColor: 'text-success' },
  { text: '  features: {', color: 'text-foreground' },
  { text: '    ai: ', color: 'text-foreground', value: 'true', valueColor: 'text-warning' },
  { text: '    liveCoding: ', color: 'text-foreground', value: 'true', valueColor: 'text-warning' },
  { text: '    codeReview: ', color: 'text-foreground', value: 'true', valueColor: 'text-warning' },
  { text: '  }', color: 'text-foreground' },
  { text: '});', color: 'text-foreground' },
  { text: '', color: '' },
  { text: '// 4 developers connected • AI assistant ready', color: 'text-success' },
];

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          {/* Beta Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Now in Public Beta</span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
            <span className="text-foreground">Code Together.</span>
            <br />
            <span className="text-gradient">Ship Faster.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            The AI-powered collaboration platform where dev teams chat, code, and review — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to="/auth">
              <Button size="lg" className="rounded-full px-8 text-base font-semibold gap-2 h-12">
                Start for Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-base font-semibold gap-2 h-12">
                <Play className="w-4 h-4" /> Live Demo
              </Button>
            </Link>
          </div>

          {/* Terminal Mock */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-elevated overflow-hidden"
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
              </div>
              <span className="text-xs text-muted-foreground font-mono-code ml-2">talkfly — collaboration</span>
            </div>
            {/* Code content */}
            <div className="p-5 text-left font-mono-code text-sm leading-relaxed">
              {codeLines.map((line, i) => (
                <div key={i} className={line.color}>
                  {line.value ? (
                    <>
                      <span className="text-muted-foreground">{'  '.repeat(line.text.startsWith('  ') ? 0 : 0)}{line.text}</span>
                      <span className={line.valueColor}>{line.value}</span>
                      <span className="text-muted-foreground">,</span>
                    </>
                  ) : (
                    <span className={line.color || 'text-muted-foreground'}>{line.text || '\u00A0'}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
