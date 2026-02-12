import { useState } from "react";
import { Search, Plus, Settings, Hash, Pin } from "lucide-react";
import { mockConversations, currentUser, type Conversation } from "@/data/mockData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const statusColors: Record<string, string> = {
  online: "bg-success",
  away: "bg-warning",
  dnd: "bg-destructive",
  offline: "bg-muted-foreground/50",
};

interface AppSidebarProps {
  activeConversation: string;
  onSelect: (id: string) => void;
}

export function AppSidebar({ activeConversation, onSelect }: AppSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = mockConversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter((c) => c.pinned);
  const others = filtered.filter((c) => !c.pinned);

  return (
    <aside className="w-full md:w-[280px] shrink-0 h-full border-r border-border bg-sidebar flex flex-col">
      {/* Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-sidebar ${statusColors[currentUser.status]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser.role}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-sm rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2">
        {pinned.length > 0 && (
          <div className="mb-1">
            <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Pin className="w-3 h-3" /> Pinned
            </p>
            {pinned.map((c) => (
              <ConversationItem key={c.id} conversation={c} active={c.id === activeConversation} onClick={() => onSelect(c.id)} />
            ))}
          </div>
        )}
        <div>
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</p>
          {others.map((c) => (
            <ConversationItem key={c.id} conversation={c} active={c.id === activeConversation} onClick={() => onSelect(c.id)} />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="p-3 border-t border-border flex items-center gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
          <Plus className="w-4 h-4" /> New Chat
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

function ConversationItem({ conversation: c, active, onClick }: { conversation: Conversation; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 mb-0.5 ${
        active ? "bg-accent border-l-2 border-primary" : "hover:bg-accent/50 border-l-2 border-transparent"
      }`}
    >
      <div className="relative shrink-0">
        {c.type === "channel" ? (
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Hash className="w-4 h-4 text-primary" />
          </div>
        ) : (
          <>
            <Avatar className="w-9 h-9">
              <AvatarImage src={c.avatar} />
              <AvatarFallback>{c.name[0]}</AvatarFallback>
            </Avatar>
            {c.status && (
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-sidebar ${statusColors[c.status]}`} />
            )}
          </>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium truncate ${active ? "text-foreground" : "text-foreground/80"}`}>{c.name}</span>
          <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{c.timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate">
            {c.typing ? (
              <span className="italic text-primary">typing...</span>
            ) : (
              c.lastMessage
            )}
          </span>
          {c.unread > 0 && (
            <span className="ml-2 shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
              {c.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
