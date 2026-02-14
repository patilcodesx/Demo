import { useState } from "react";
import { User, GitBranch, Bot, Code2, Search, FileText, MessageCircle, Send, ThumbsUp, ThumbsDown, FileCode } from "lucide-react";
import { CodeEditorTab } from "./CodeEditorTab";
import { mockUsers, mockPullRequests, currentUser } from "@/data/mockData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "github", label: "GitHub", icon: GitBranch },
  { id: "ai", label: "AI", icon: Bot },
  { id: "collab", label: "Collab", icon: Code2 },
  { id: "review", label: "Review", icon: Search },
  { id: "docs", label: "Docs", icon: FileText },
  { id: "threads", label: "Threads", icon: MessageCircle },
];

interface RightPanelProps {
  onClose: () => void;
}

export function RightPanel({ onClose }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <aside className="w-full md:w-[320px] shrink-0 h-full border-l border-border bg-sidebar flex flex-col">
      {/* Tabs */}
      <div className="border-b border-border overflow-x-auto">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "github" && <GitHubTab />}
        {activeTab === "ai" && <AITab />}
        {activeTab === "collab" && <CodeEditorTab />}
        {activeTab === "review" && <ReviewTab />}
        {activeTab === "docs" && <DocsTab />}
        {activeTab === "threads" && <ThreadsTab />}
      </div>
    </aside>
  );
}

function ProfileTab() {
  const user = mockUsers[1]; // Show partner profile
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="w-20 h-20 mb-3">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.role}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs text-success">Online</span>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">About</h4>
        <p className="text-sm text-foreground/80">{user.bio}</p>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Shared Files</h4>
        {["component-lib.zip", "design-tokens.json", "screenshot.png"].map((file) => (
          <div key={file} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-colors">
            <FileCode className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{file}</p>
              <p className="text-[10px] text-muted-foreground">Shared 2h ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GitHubTab() {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pull Requests</h4>
      {mockPullRequests.map((pr) => (
        <div key={pr.id} className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
          <h5 className="text-sm font-semibold text-foreground">{pr.title}</h5>
          <p className="text-xs text-muted-foreground line-clamp-2">{pr.description}</p>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
              pr.status === "open" ? "bg-success/10 text-success" : "bg-secondary/10 text-secondary"
            }`}>
              {pr.status}
            </span>
            <span className="text-xs text-success">+{pr.additions}</span>
            <span className="text-xs text-destructive">-{pr.deletions}</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={pr.author.avatar} />
            </Avatar>
            <span className="text-[11px] text-muted-foreground">{pr.author.name} · {pr.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AITab() {
  const [aiInput, setAiInput] = useState("");
  const quickActions = ["Explain Code", "Find Bug", "Optimize", "Generate Tests"];

  return (
    <div className="flex flex-col h-full -m-4">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs font-medium text-foreground">AI Assistant Ready</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button key={action} className="text-xs px-3 py-2 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex gap-2">
          <div className="rounded-xl bg-accent px-3 py-2 text-sm text-foreground max-w-[85%]">
            <p className="mb-2">I can help you with code! Here's a quick example:</p>
            <div className="rounded-lg bg-muted/50 p-2 font-mono-code text-xs text-foreground/80 border border-border">
              {`const auth = async () => {\n  const token = await getToken();\n  return validate(token);\n};`}
            </div>
            <div className="flex gap-2 mt-2">
              <button className="text-muted-foreground hover:text-foreground"><ThumbsUp className="w-3.5 h-3.5" /></button>
              <button className="text-muted-foreground hover:text-foreground"><ThumbsDown className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-end gap-2">
          <input
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 bg-muted rounded-lg border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// CollabTab replaced by CodeEditorTab component

function ReviewTab() {
  const issues = [
    { severity: "critical", category: "Security", file: "auth.ts:42", desc: "SQL injection vulnerability in user query", color: "text-destructive bg-destructive/10" },
    { severity: "medium", category: "Performance", file: "api.ts:15", desc: "N+1 query detected in user listing", color: "text-warning bg-warning/10" },
    { severity: "low", category: "Style", file: "utils.ts:8", desc: "Unused variable 'temp' should be removed", color: "text-primary bg-primary/10" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-destructive/10 text-destructive">1 Critical</span>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-warning/10 text-warning">1 Medium</span>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-primary/10 text-primary">1 Low</span>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-success/10 text-success">12 Passed</span>
      </div>

      {issues.map((issue, i) => (
        <div key={i} className="rounded-xl border border-border bg-card/50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${issue.color}`}>{issue.severity}</span>
            <span className="text-[10px] text-muted-foreground">{issue.category}</span>
          </div>
          <p className="text-xs text-foreground">{issue.desc}</p>
          <p className="text-[10px] font-mono-code text-muted-foreground">{issue.file}</p>
          <div className="flex gap-2">
            <button className="text-[10px] px-2 py-1 rounded bg-success/10 text-success hover:bg-success/20 transition-colors">Apply Fix</button>
            <button className="text-[10px] px-2 py-1 rounded bg-muted text-muted-foreground hover:bg-accent transition-colors">Ignore</button>
          </div>
        </div>
      ))}

      <button className="w-full text-xs py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
        Review Current File
      </button>
    </div>
  );
}

function DocsTab() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Generate For</h4>
        {["Current file", "Selected code", "Entire project"].map((opt, i) => (
          <label key={opt} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="radio" name="docTarget" defaultChecked={i === 0} className="accent-primary" />
            {opt}
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Doc Types</h4>
        {["JSDoc/TSDoc comments", "README.md", "API documentation", "Usage examples"].map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" className="accent-primary" />
            {opt}
          </label>
        ))}
      </div>
      <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
        Generate Documentation
      </button>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recent</h4>
        {["auth.ts — 2 min ago", "README.md — 1 hour ago", "api.ts — Yesterday"].map((item) => (
          <button key={item} className="w-full text-left text-xs text-muted-foreground py-2 px-3 rounded-lg hover:bg-accent hover:text-foreground transition-colors">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ThreadsTab() {
  const threads = [
    { preview: "How should we handle the auth redirect?", replies: 5, time: "30m ago" },
    { preview: "PR #42 - OAuth implementation discussion", replies: 12, time: "2h ago" },
    { preview: "Memory leak investigation", replies: 3, time: "Yesterday" },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Threads</h4>
      {threads.map((thread, i) => (
        <button key={i} className="w-full text-left rounded-xl border border-border bg-card/50 p-3 hover:border-primary/30 transition-colors space-y-2">
          <p className="text-sm text-foreground">{thread.preview}</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{thread.replies} replies</span>
            <span className="text-[10px] text-muted-foreground">{thread.time}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
