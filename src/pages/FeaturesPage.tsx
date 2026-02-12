import { LandingHeader } from "@/components/LandingHeader";
import { LandingFooter } from "@/components/LandingFooter";
import { motion } from "framer-motion";
import {
  MessageSquare, GitBranch, Bot, Code2, Upload, MessageCircle,
  Video, BarChart3
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Real-time Messaging",
    description: "Chat with your team with built-in code syntax highlighting and rich formatting.",
    capabilities: ["Code blocks with syntax highlighting", "Markdown support", "Emoji reactions", "Thread replies"],
  },
  {
    icon: GitBranch,
    title: "GitHub & GitLab Integration",
    description: "Connect your repositories. View PRs, commits, and issues directly in TalkFly.",
    capabilities: ["Pull request reviews", "Commit tracking", "Issue management", "Branch notifications"],
  },
  {
    icon: Bot,
    title: "AI Code Review",
    description: "Automated code reviews that catch bugs, security issues, and style violations.",
    capabilities: ["Security vulnerability detection", "Performance tips", "Best practices", "Instant feedback"],
  },
  {
    icon: Code2,
    title: "Live Coding Sessions",
    description: "Pair program in real-time with your team. See cursors, selections, and edits live.",
    capabilities: ["Real-time cursors", "Shared editing", "Voice chat", "AI suggestions"],
  },
  {
    icon: Upload,
    title: "File & Screen Sharing",
    description: "Share files, images, and your screen directly within conversations.",
    capabilities: ["Drag & drop uploads", "Image previews", "Screen sharing", "File versioning"],
  },
  {
    icon: MessageCircle,
    title: "Threaded Conversations",
    description: "Keep discussions organized with thread replies and focused conversations.",
    capabilities: ["Reply threads", "Pinned messages", "Bookmarks", "Search & filter"],
  },
  {
    icon: Video,
    title: "Video & Voice Calls",
    description: "Jump into video or voice calls directly from any conversation.",
    capabilities: ["HD video calls", "Screen sharing", "Recording", "Background blur"],
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track team productivity, code velocity, and collaboration metrics.",
    capabilities: ["Code velocity", "Review times", "Team activity", "Custom reports"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Everything You Need to <span className="text-gradient">Ship</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A comprehensive platform designed for modern developer teams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-elevated group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-1.5">
                  {feature.capabilities.map((cap) => (
                    <li key={cap} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
