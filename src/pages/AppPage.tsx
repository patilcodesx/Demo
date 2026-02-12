import { useState } from "react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { ChatPanel } from "@/components/app/ChatPanel";
import { RightPanel } from "@/components/app/RightPanel";
import { AIAssistantView } from "@/components/app/AIAssistantView";
import { CodeEditorTab } from "@/components/app/CodeEditorTab";
import { Code2, Bot, MessageCircle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type MainView = "collab" | "ai" | "chat";

const navItems: { id: MainView; label: string; icon: typeof Code2 }[] = [
  { id: "collab", label: "Collab", icon: Code2 },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "chat", label: "Chat", icon: MessageCircle },
];

export default function AppPage() {
  const [activeView, setActiveView] = useState<MainView>("chat");
  const [activeConversation, setActiveConversation] = useState("c1");
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Mobile header */}
      <div className="md:hidden h-12 shrink-0 border-b border-border flex items-center px-4 gap-3">
        <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="text-foreground">
          {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-sm font-semibold text-foreground">TalkFly</span>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Icon Nav Bar */}
        <nav className="hidden md:flex w-16 shrink-0 flex-col items-center py-4 gap-1 border-r border-border bg-sidebar">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary" />
                )}
                <item.icon className={cn("w-5 h-5 transition-transform duration-200", isActive && "scale-110")} />
                <span className="text-[9px] font-medium mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 border-t border-border bg-sidebar flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0 relative">
          {/* Collab View (Code Editor) */}
          {activeView === "collab" && (
            <div className="flex-1 animate-fade-in">
              <CodeEditorTab />
            </div>
          )}

          {/* AI Assistant View */}
          {activeView === "ai" && (
            <div className="flex-1 animate-fade-in">
              <AIAssistantView />
            </div>
          )}

          {/* Chat View */}
          {activeView === "chat" && (
            <div className="flex-1 flex animate-fade-in">
              {/* Sidebar */}
              <div className={cn(
                "absolute md:relative z-20 h-full transition-transform duration-300",
                showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
              )}>
                <AppSidebar
                  activeConversation={activeConversation}
                  onSelect={(id) => {
                    setActiveConversation(id);
                    setShowMobileSidebar(false);
                  }}
                />
              </div>

              {/* Chat */}
              <ChatPanel
                conversationId={activeConversation}
                onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
              />

              {/* Right Panel */}
              {showRightPanel && (
                <div className="hidden lg:block">
                  <RightPanel onClose={() => setShowRightPanel(false)} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Status Bar */}
      <div className="h-7 shrink-0 border-t border-border flex items-center px-4 bg-card/50 md:mb-0 mb-14">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-[10px] text-muted-foreground">AI Online</span>
        </div>
        <div className="flex-1" />
        <span className="text-[10px] text-muted-foreground capitalize">{activeView === "collab" ? "Code Editor" : activeView === "ai" ? "AI Assistant" : "Messaging"}</span>
      </div>
    </div>
  );
}
