import { motion } from "framer-motion";
import { Bot, Users, Search, FileText } from "lucide-react";

const tools = [
  {
    icon: Bot,
    title: "AI Assistant",
    emoji: "🤖",
    colorClass: "bg-primary/10 text-primary border-primary/20",
    description: "Your 24/7 coding companion. Ask questions, get instant answers, and learn best practices.",
    features: ["Natural language queries", "Code explanation", "Architecture advice", "Multi-language support"],
    preview: {
      type: "chat",
      messages: [
        { role: "user", text: "How do I implement OAuth2 in Next.js?" },
        { role: "ai", text: "Here's a step-by-step guide using NextAuth.js with the App Router..." },
      ],
    },
  },
  {
    icon: Users,
    title: "Code Collaborator",
    emoji: "👥",
    colorClass: "bg-secondary/10 text-secondary border-secondary/20",
    description: "Pair program with AI. Write code together in real-time with intelligent suggestions.",
    features: ["Live code completion", "Context-aware suggestions", "Refactoring recommendations", "Test generation"],
    preview: {
      type: "split",
      left: "function auth() {\n  // your code\n}",
      right: "// AI suggestion:\nfunction auth() {\n  try {\n    await validate();\n  } catch (e) {\n    handleError(e);\n  }\n}",
    },
  },
  {
    icon: Search,
    title: "Code Reviewer",
    emoji: "🔍",
    colorClass: "bg-success/10 text-success border-success/20",
    description: "Automated code reviews that catch bugs, security issues, and style violations.",
    features: ["Security vulnerability detection", "Performance optimization", "Best practice enforcement", "Instant PR feedback"],
    preview: {
      type: "review",
      issues: [
        { severity: "error", text: "SQL injection vulnerability at line 42" },
        { severity: "warning", text: "Unused variable 'data' at line 15" },
      ],
    },
  },
  {
    icon: FileText,
    title: "Doc Generator",
    emoji: "📄",
    colorClass: "bg-warning/10 text-warning border-warning/20",
    description: "Automatically generate comprehensive documentation from your code.",
    features: ["JSDoc/TSDoc generation", "README creation", "API documentation", "Code example generation"],
    preview: {
      type: "doc",
      text: "/**\n * Authenticates user with OAuth2\n * @param provider - OAuth provider\n * @returns User session\n */",
    },
  },
];

export function AIToolsSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Your AI-Powered <span className="text-gradient">Development Suite</span>
          </h2>
          <p className="text-lg text-muted-foreground">All working together, seamlessly.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-elevated"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border text-lg ${tool.colorClass}`}>
                  {tool.emoji}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                </div>
              </div>

              <ul className="grid grid-cols-2 gap-2 mb-5">
                {tool.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Mini preview */}
              <div className="rounded-xl border border-border bg-muted/30 p-3 font-mono-code text-xs text-muted-foreground overflow-hidden">
                {tool.preview.type === "chat" && (
                  <div className="space-y-2">
                    {tool.preview.messages?.map((msg, j) => (
                      <div key={j} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                        <span className={`inline-block rounded-lg px-3 py-1.5 ${
                          msg.role === "user" ? "bg-primary/20 text-primary" : "bg-accent text-foreground"
                        }`}>
                          {msg.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {tool.preview.type === "split" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-background/50 rounded p-2 whitespace-pre">{tool.preview.left}</div>
                    <div className="bg-success/5 border border-success/20 rounded p-2 whitespace-pre">{tool.preview.right}</div>
                  </div>
                )}
                {tool.preview.type === "review" && (
                  <div className="space-y-1.5">
                    {tool.preview.issues?.map((issue, j) => (
                      <div key={j} className={`flex items-center gap-2 ${issue.severity === "error" ? "text-destructive" : "text-warning"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {issue.text}
                      </div>
                    ))}
                  </div>
                )}
                {tool.preview.type === "doc" && (
                  <pre className="whitespace-pre text-success/80">{tool.preview.text}</pre>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
