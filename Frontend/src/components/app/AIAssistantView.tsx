import { useState, useRef, useEffect } from "react";
import { Bot, Send, ThumbsUp, ThumbsDown, Sparkles, Code2, Lightbulb, Bug, TestTube, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { currentUser } from "@/data/mockData";

interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isCode?: boolean;
  timestamp: Date;
}

const quickActions = [
  { label: "Explain Code", icon: Lightbulb, color: "text-warning" },
  { label: "Find Bug", icon: Bug, color: "text-destructive" },
  { label: "Optimize", icon: Zap, color: "text-primary" },
  { label: "Generate Tests", icon: TestTube, color: "text-success" },
];

const initialMessages: AiMessage[] = [
  {
    id: "ai-1",
    role: "assistant",
    content: "👋 Hey! I'm your AI coding assistant. I can help you with code explanations, debugging, optimization, and test generation. What are you working on?",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "ai-2",
    role: "user",
    content: "How do I implement JWT authentication in Express?",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "ai-3",
    role: "assistant",
    content: "Here's a clean JWT auth implementation for Express:",
    timestamp: new Date(Date.now() - 230000),
  },
  {
    id: "ai-4",
    role: "assistant",
    content: `import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET = process.env.JWT_SECRET!;

export function generateToken(userId: string): string {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: '24h' });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}`,
    isCode: true,
    timestamp: new Date(Date.now() - 228000),
  },
  {
    id: "ai-5",
    role: "assistant",
    content: "This gives you a `generateToken` function for login endpoints and an `authMiddleware` you can apply to protected routes. Want me to show you how to add refresh tokens or integrate with a database?",
    timestamp: new Date(Date.now() - 225000),
  },
];

export function AIAssistantView() {
  const [messages, setMessages] = useState<AiMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: AiMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulated AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "I'm analyzing your request. In a full implementation, this would connect to an AI backend to provide contextual code assistance, explanations, and suggestions based on your codebase.",
          timestamp: new Date(),
        },
      ]);
    }, 1200);
  };

  const handleQuickAction = (label: string) => {
    const userMsg: AiMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: label === "Explain Code"
        ? "Can you explain the authentication middleware in my current file?"
        : label === "Find Bug"
        ? "Help me find potential bugs in my code"
        : label === "Optimize"
        ? "How can I optimize the performance of my current implementation?"
        : "Generate unit tests for my auth module",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Header */}
      <div className="h-14 shrink-0 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-[11px] text-success">Online — Ready to help</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground px-2 py-1 rounded-md bg-muted border border-border">
            <Sparkles className="w-3 h-3 inline mr-1" />GPT-4o
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="shrink-0 border-b border-border px-6 py-3">
        <div className="flex gap-2 flex-wrap">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.label)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <action.icon className={cn("w-3.5 h-3.5", action.color)} />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id} className={cn("flex gap-3", isUser && "flex-row-reverse")}>
              {!isUser ? (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              ) : (
                <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>
              )}
              <div className={cn("max-w-[75%] flex flex-col", isUser ? "items-end" : "items-start")}>
                {msg.isCode ? (
                  <div className="rounded-xl overflow-hidden border border-border w-full">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-border">
                      <span className="text-[10px] text-muted-foreground font-mono">typescript</span>
                      <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Copy</button>
                    </div>
                    <pre className="p-3 text-xs font-mono-code leading-relaxed text-foreground/90 bg-card/50 overflow-x-auto whitespace-pre">{msg.content}</pre>
                  </div>
                ) : (
                  <div className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm",
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-md"
                      : "bg-accent text-foreground rounded-tl-md"
                  )}>
                    {msg.content}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1 mx-1">
                  <span className="text-[10px] text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {!isUser && !msg.isCode && (
                    <div className="flex gap-1">
                      <button className="text-muted-foreground/50 hover:text-foreground transition-colors"><ThumbsUp className="w-3 h-3" /></button>
                      <button className="text-muted-foreground/50 hover:text-foreground transition-colors"><ThumbsDown className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border p-4 px-6">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask AI anything about your code..."
              rows={1}
              className="w-full resize-none bg-muted rounded-xl border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-10"
            />
            <Code2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl transition-colors shrink-0",
              input.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
