import { useState, useCallback, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Save, Play, AlignLeft, Search, X, ChevronRight, ChevronDown,
  FileCode, FileText, FileJson, Folder, FolderOpen, Plus, MoreHorizontal,
  Trash2, Copy, CheckCircle, AlertTriangle, XCircle, Terminal, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

// ── Types ──────────────────────────────────────────────

interface FileNode {
  name: string;
  type: "file" | "folder";
  language?: string;
  children?: FileNode[];
  content?: string;
}

interface OpenFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

type LogLevel = "info" | "error" | "warn" | "success";

interface LogEntry {
  id: number;
  level: LogLevel;
  message: string;
  timestamp: Date;
  source?: string;
}

interface Problem {
  id: number;
  level: "error" | "warning";
  message: string;
  file: string;
  line: number;
  col: number;
}

// ── Mock data ──────────────────────────────────────────

const mockFileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "index.ts",
        type: "file",
        language: "typescript",
        content: `import express from "express";\nimport { authRouter } from "./routes/auth";\nimport { apiRouter } from "./routes/api";\n\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.use(express.json());\napp.use("/auth", authRouter);\napp.use("/api", apiRouter);\n\napp.listen(PORT, () => {\n  console.log(\`Server running on port \${PORT}\`);\n});`,
      },
      {
        name: "auth.ts",
        type: "file",
        language: "typescript",
        content: `import jwt from "jsonwebtoken";\n\ninterface User {\n  id: string;\n  email: string;\n  role: "admin" | "user";\n}\n\nexport function generateToken(user: User): string {\n  return jwt.sign(\n    { sub: user.id, email: user.email, role: user.role },\n    process.env.JWT_SECRET!,\n    { expiresIn: "24h" }\n  );\n}\n\nexport function verifyToken(token: string): User | null {\n  try {\n    const payload = jwt.verify(token, process.env.JWT_SECRET!) as User;\n    return payload;\n  } catch {\n    return null;\n  }\n}`,
      },
      {
        name: "utils.py",
        type: "file",
        language: "python",
        content: `import hashlib\nimport secrets\nfrom typing import Optional\n\ndef hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:\n    """Hash a password with a random salt."""\n    if salt is None:\n        salt = secrets.token_hex(16)\n    hashed = hashlib.pbkdf2_hmac(\n        'sha256',\n        password.encode('utf-8'),\n        salt.encode('utf-8'),\n        100000\n    )\n    return hashed.hex(), salt\n\ndef verify_password(password: str, hashed: str, salt: str) -> bool:\n    """Verify a password against its hash."""\n    new_hash, _ = hash_password(password, salt)\n    return secrets.compare_digest(new_hash, hashed)`,
      },
      {
        name: "styles.css",
        type: "file",
        language: "css",
        content: `:root {\n  --primary: #06b6d4;\n  --bg-dark: #0a0e1a;\n  --surface: #151b2e;\n}\n\nbody {\n  margin: 0;\n  font-family: 'Inter', sans-serif;\n  background-color: var(--bg-dark);\n  color: #f9fafb;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 1rem;\n}\n\n.btn-primary {\n  background: var(--primary);\n  border: none;\n  border-radius: 8px;\n  padding: 0.5rem 1.5rem;\n  color: white;\n  cursor: pointer;\n  transition: opacity 0.2s;\n}\n\n.btn-primary:hover {\n  opacity: 0.9;\n}`,
      },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [
      {
        name: "index.html",
        type: "file",
        language: "html",
        content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>TalkFly App</title>\n  <link rel="stylesheet" href="/styles.css" />\n</head>\n<body>\n  <div id="root"></div>\n  <script type="module" src="/src/index.ts"></script>\n</body>\n</html>`,
      },
    ],
  },
  {
    name: "package.json",
    type: "file",
    language: "json",
    content: `{\n  "name": "talkfly-server",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "tsx watch src/index.ts",\n    "build": "tsc",\n    "start": "node dist/index.js"\n  },\n  "dependencies": {\n    "express": "^4.18.2",\n    "jsonwebtoken": "^9.0.0"\n  }\n}`,
  },
];

const mockProblems: Problem[] = [
  { id: 1, level: "error", message: "Cannot find module './routes/auth'", file: "src/index.ts", line: 2, col: 30 },
  { id: 2, level: "warning", message: "'apiRouter' is declared but never used in this scope", file: "src/index.ts", line: 3, col: 10 },
  { id: 3, level: "warning", message: "Type 'string | undefined' is not assignable to type 'string'", file: "src/auth.ts", line: 12, col: 5 },
];

// ── Helpers ────────────────────────────────────────────

function getFileIcon(name: string) {
  if (name.endsWith(".ts") || name.endsWith(".tsx")) return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
  if (name.endsWith(".js") || name.endsWith(".jsx")) return <FileCode className="w-3.5 h-3.5 text-yellow-400" />;
  if (name.endsWith(".py")) return <FileCode className="w-3.5 h-3.5 text-green-400" />;
  if (name.endsWith(".css")) return <FileText className="w-3.5 h-3.5 text-purple-400" />;
  if (name.endsWith(".html")) return <FileText className="w-3.5 h-3.5 text-orange-400" />;
  if (name.endsWith(".json")) return <FileJson className="w-3.5 h-3.5 text-yellow-300" />;
  return <FileText className="w-3.5 h-3.5 text-muted-foreground" />;
}

function flattenFiles(nodes: FileNode[], parentPath = ""): OpenFile[] {
  const files: OpenFile[] = [];
  for (const node of nodes) {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    if (node.type === "file" && node.content) {
      files.push({ name: node.name, path, language: node.language || "plaintext", content: node.content });
    }
    if (node.children) {
      files.push(...flattenFiles(node.children, path));
    }
  }
  return files;
}

const allFiles = flattenFiles(mockFileTree);

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ── Console / Output Panel ─────────────────────────────

const consoleTabs = ["Output", "Console", "Problems", "Terminal"] as const;
type ConsoleTab = (typeof consoleTabs)[number];

function ConsolePanel({
  logs,
  problems,
  onClear,
  isRunning,
  executionTime,
  exitCode,
}: {
  logs: LogEntry[];
  problems: Problem[];
  onClear: () => void;
  isRunning: boolean;
  executionTime: number | null;
  exitCode: number | null;
}) {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("Output");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "$ npm run dev",
    "  tsx watch src/index.ts",
    "  Server running on port 3000",
    "  Watching for file changes...",
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    terminalScrollRef.current?.scrollTo({ top: terminalScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [terminalHistory]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    setTerminalHistory((prev) => [...prev, `$ ${terminalInput}`, `  Command '${terminalInput}' executed.`]);
    setTerminalInput("");
  };

  const copyLogs = () => {
    const text = logs.map((l) => `[${formatTime(l.timestamp)}] ${l.level.toUpperCase()}: ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  const levelIcon = (level: LogLevel) => {
    switch (level) {
      case "error": return <XCircle className="w-3 h-3 text-destructive shrink-0" />;
      case "warn": return <AlertTriangle className="w-3 h-3 text-warning shrink-0" />;
      case "success": return <CheckCircle className="w-3 h-3 text-success shrink-0" />;
      default: return null;
    }
  };

  const levelColor = (level: LogLevel) => {
    switch (level) {
      case "error": return "text-destructive";
      case "warn": return "text-warning";
      case "success": return "text-success";
      default: return "text-foreground/80";
    }
  };

  const errorCount = problems.filter((p) => p.level === "error").length;
  const warnCount = problems.filter((p) => p.level === "warning").length;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border shrink-0">
        <div className="flex items-center flex-1 overflow-x-auto">
          {consoleTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-[10px] font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {tab}
              {tab === "Problems" && (errorCount + warnCount > 0) && (
                <span className="ml-1 text-[9px] px-1 py-0.5 rounded-full bg-destructive/20 text-destructive">{errorCount + warnCount}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5 px-1 shrink-0">
          {executionTime !== null && (
            <span className="text-[9px] text-muted-foreground px-1.5">{executionTime}ms</span>
          )}
          {exitCode !== null && (
            <span className={cn("text-[9px] px-1.5 py-0.5 rounded", exitCode === 0 ? "text-success" : "text-destructive")}>
              exit {exitCode}
            </span>
          )}
          {isRunning && (
            <span className="text-[9px] text-primary animate-pulse px-1.5">Running...</span>
          )}
          <button onClick={copyLogs} className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Copy">
            <Copy className="w-3 h-3" />
          </button>
          <button onClick={onClear} className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Clear">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {(activeTab === "Output" || activeTab === "Console") && (
          <div ref={scrollRef} className="h-full overflow-y-auto p-2 font-mono text-[11px] leading-relaxed">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-[10px]">No output yet. Click Run to execute.</div>
            ) : (
              logs
                .filter((l) => activeTab === "Output" || l.source === "console")
                .map((entry) => (
                  <div key={entry.id} className="flex items-start gap-2 py-0.5 hover:bg-accent/30 px-1 rounded">
                    <span className="text-muted-foreground/50 shrink-0 select-none">{formatTime(entry.timestamp)}</span>
                    {levelIcon(entry.level)}
                    <span className={cn("whitespace-pre-wrap break-all", levelColor(entry.level))}>{entry.message}</span>
                  </div>
                ))
            )}
          </div>
        )}

        {activeTab === "Problems" && (
          <div className="h-full overflow-y-auto">
            {problems.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-[10px]">No problems detected.</div>
            ) : (
              <table className="w-full text-[10px]">
                <tbody>
                  {problems.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="px-2 py-1.5 shrink-0">
                        {p.level === "error" ? (
                          <XCircle className="w-3 h-3 text-destructive" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-warning" />
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-foreground/80 font-mono">{p.message}</td>
                      <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap font-mono">{p.file}:{p.line}:{p.col}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "Terminal" && (
          <div className="h-full flex flex-col">
            <div ref={terminalScrollRef} className="flex-1 overflow-y-auto p-2 font-mono text-[11px] leading-relaxed">
              {terminalHistory.map((line, i) => (
                <div key={i} className={cn("py-0.5", line.startsWith("$") ? "text-success" : "text-foreground/70")}>
                  {line}
                </div>
              ))}
            </div>
            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1.5 px-2 py-1.5 border-t border-border shrink-0">
              <Terminal className="w-3 h-3 text-success shrink-0" />
              <span className="text-success text-[11px] font-mono">$</span>
              <input
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent text-[11px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
                placeholder="Type a command..."
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────

export function CodeEditorTab() {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([allFiles[0], allFiles[1]]);
  const [activeFile, setActiveFile] = useState<string>(allFiles[0].path);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src", "public"]));
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [fileContents, setFileContents] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    allFiles.forEach((f) => (map[f.path] = f.content));
    return map;
  });
  const [showConsole, setShowConsole] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const logIdRef = useRef(0);

  const currentFile = openFiles.find((f) => f.path === activeFile);

  const addLog = useCallback((level: LogLevel, message: string, source?: string) => {
    logIdRef.current += 1;
    setLogs((prev) => [...prev, { id: logIdRef.current, level, message, timestamp: new Date(), source }]);
  }, []);

  const handleRun = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    setExitCode(null);
    setExecutionTime(null);
    const start = Date.now();

    addLog("info", `> Running ${currentFile?.name || "program"}...`);
    addLog("info", "Compiling TypeScript...", "console");

    setTimeout(() => addLog("info", "Build started...", "console"), 300);
    setTimeout(() => addLog("success", "✓ Compiled successfully (0 errors)", "console"), 800);
    setTimeout(() => addLog("info", "Starting server...", "console"), 1000);
    setTimeout(() => addLog("success", "✓ Server running on port 3000"), 1400);
    setTimeout(() => addLog("info", "  Local:   http://localhost:3000"), 1500);
    setTimeout(() => addLog("info", "  Network: http://192.168.1.42:3000"), 1550);
    setTimeout(() => addLog("warn", "⚠ JWT_SECRET not set, using default (not safe for production)", "console"), 1800);
    setTimeout(() => addLog("info", 'GET /api/health → 200 (2ms)'), 2200);
    setTimeout(() => addLog("error", "Error: Cannot find module './routes/auth'", "console"), 2600);
    setTimeout(() => addLog("info", "  at Module._resolveFilename (node:internal/modules/cjs/loader:985:15)"), 2650);
    setTimeout(() => addLog("success", "✓ Hot reload: 3 modules updated"), 3000);
    setTimeout(() => {
      const elapsed = Date.now() - start;
      setExecutionTime(elapsed);
      setExitCode(0);
      setIsRunning(false);
      addLog("success", `Process exited with code 0 (${elapsed}ms)`);
    }, 3200);
  }, [isRunning, currentFile, addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setExecutionTime(null);
    setExitCode(null);
  }, []);

  const openFile = useCallback((file: OpenFile) => {
    setOpenFiles((prev) => {
      if (prev.find((f) => f.path === file.path)) return prev;
      return [...prev, file];
    });
    setActiveFile(file.path);
  }, []);

  const closeFile = useCallback((path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFiles((prev) => {
      const next = prev.filter((f) => f.path !== path);
      if (activeFile === path && next.length > 0) {
        setActiveFile(next[next.length - 1].path);
      }
      return next;
    });
  }, [activeFile]);

  const toggleFolder = (name: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const renderTree = (nodes: FileNode[], depth = 0, parentPath = "") => {
    return nodes.map((node) => {
      const path = parentPath ? `${parentPath}/${node.name}` : node.name;
      const isExpanded = expandedFolders.has(node.name);

      if (node.type === "folder") {
        return (
          <div key={path}>
            <button
              onClick={() => toggleFolder(node.name)}
              className="flex items-center gap-1 w-full px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
              {isExpanded ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
              {isExpanded ? <FolderOpen className="w-3.5 h-3.5 text-primary/70 shrink-0" /> : <Folder className="w-3.5 h-3.5 text-primary/70 shrink-0" />}
              <span className="truncate">{node.name}</span>
            </button>
            {isExpanded && node.children && renderTree(node.children, depth + 1, path)}
          </div>
        );
      }

      const file = allFiles.find((f) => f.path === path);
      return (
        <button
          key={path}
          onClick={() => file && openFile(file)}
          className={cn(
            "flex items-center gap-1.5 w-full px-2 py-1 text-[11px] transition-colors",
            activeFile === path ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
          style={{ paddingLeft: `${depth * 12 + 20}px` }}
        >
          {getFileIcon(node.name)}
          <span className="truncate">{node.name}</span>
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-card/80 shrink-0">
        <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors" title="Save (Ctrl+S)">
          <Save className="w-3 h-3" /> Save
        </button>
        <button
          onClick={handleRun}
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded transition-colors",
            isRunning ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
          title="Run"
        >
          <Play className="w-3 h-3" /> {isRunning ? "Running..." : "Run"}
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors" title="Format">
          <AlignLeft className="w-3 h-3" /> Format
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShowConsole(!showConsole)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded transition-colors",
            showConsole ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
          title="Toggle Console"
        >
          <Terminal className="w-3 h-3" />
          {showConsole ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronUp className="w-2.5 h-2.5" />}
        </button>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded transition-colors",
            showSearch ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
          title="Find & Replace (Ctrl+H)"
        >
          <Search className="w-3 h-3" />
        </button>
        <button className="flex items-center px-1.5 py-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Find & Replace */}
      {showSearch && (
        <div className="flex flex-col gap-1.5 px-2 py-2 border-b border-border bg-card/60 shrink-0">
          <div className="flex items-center gap-1.5">
            <Search className="w-3 h-3 text-muted-foreground shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find..."
              className="flex-1 bg-muted rounded px-2 py-1 text-[11px] text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <AlignLeft className="w-3 h-3 text-muted-foreground shrink-0" />
            <input
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace..."
              className="flex-1 bg-muted rounded px-2 py-1 text-[11px] text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-1">
            <button className="text-[9px] px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Replace</button>
            <button className="text-[9px] px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Replace All</button>
          </div>
        </div>
      )}

      {/* Main Area: File Tree + Editor + Console */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="vertical">
          {/* Editor area (file tree + editor) */}
          <ResizablePanel defaultSize={showConsole ? 60 : 100} minSize={30}>
            <ResizablePanelGroup direction="horizontal">
              {/* File Tree */}
              <ResizablePanel defaultSize={35} minSize={20} maxSize={50}>
                <div className="h-full flex flex-col bg-sidebar">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-border">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Explorer</span>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto py-1">
                    {renderTree(mockFileTree)}
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Editor */}
              <ResizablePanel defaultSize={65} minSize={40}>
                <div className="h-full flex flex-col">
                  {/* File Tabs */}
                  <div className="flex items-center border-b border-border bg-card/50 overflow-x-auto shrink-0">
                    {openFiles.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => setActiveFile(file.path)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-[11px] border-r border-border whitespace-nowrap transition-colors group",
                          activeFile === file.path
                            ? "bg-background text-foreground border-b-2 border-b-primary"
                            : "text-muted-foreground hover:text-foreground bg-card/30"
                        )}
                      >
                        {getFileIcon(file.name)}
                        <span>{file.name}</span>
                        <X
                          className="w-3 h-3 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                          onClick={(e) => closeFile(file.path, e)}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Monaco Editor */}
                  <div className="flex-1 min-h-0">
                    {currentFile ? (
                      <Editor
                        height="100%"
                        language={currentFile.language}
                        value={fileContents[currentFile.path] || currentFile.content}
                        onChange={(value) => {
                          if (value !== undefined) {
                            setFileContents((prev) => ({ ...prev, [currentFile.path]: value }));
                          }
                        }}
                        theme="vs-dark"
                        options={{
                          fontSize: 12,
                          fontFamily: "'JetBrains Mono', monospace",
                          minimap: { enabled: false },
                          lineNumbers: "on",
                          scrollBeyondLastLine: false,
                          wordWrap: "on",
                          tabSize: 2,
                          padding: { top: 8 },
                          renderLineHighlight: "line",
                          cursorBlinking: "smooth",
                          smoothScrolling: true,
                          bracketPairColorization: { enabled: true },
                          automaticLayout: true,
                          scrollbar: {
                            verticalScrollbarSize: 6,
                            horizontalScrollbarSize: 6,
                          },
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                        Open a file to start editing
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* Console Panel */}
          {showConsole && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={40} minSize={15} maxSize={70}>
                <ConsolePanel
                  logs={logs}
                  problems={mockProblems}
                  onClear={clearLogs}
                  isRunning={isRunning}
                  executionTime={executionTime}
                  exitCode={exitCode}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 border-t border-border bg-primary/5 text-[9px] text-muted-foreground shrink-0">
        <div className="flex items-center gap-3">
          <span>{currentFile?.language || "—"}</span>
          <span>UTF-8</span>
          {mockProblems.filter((p) => p.level === "error").length > 0 && (
            <span className="flex items-center gap-0.5 text-destructive">
              <XCircle className="w-2.5 h-2.5" /> {mockProblems.filter((p) => p.level === "error").length}
            </span>
          )}
          {mockProblems.filter((p) => p.level === "warning").length > 0 && (
            <span className="flex items-center gap-0.5 text-warning">
              <AlertTriangle className="w-2.5 h-2.5" /> {mockProblems.filter((p) => p.level === "warning").length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span>Spaces: 2</span>
          <span>Ln 1, Col 1</span>
        </div>
      </div>
    </div>
  );
}
