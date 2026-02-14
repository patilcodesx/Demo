import { useState, useRef, useEffect } from "react";
import { Phone, Video, Info, Search, Send, Paperclip, Smile, Bold, Italic, Code } from "lucide-react";
import { mockMessages, mockUsers, mockConversations, currentUser, type Message } from "@/data/mockData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatPanelProps {
  conversationId: string;
  onToggleRightPanel: () => void;
}

export function ChatPanel({ conversationId, onToggleRightPanel }: ChatPanelProps) {
  const conversation = mockConversations.find((c) => c.id === conversationId);
  const messages = mockMessages.filter((m) => m.conversationId === conversationId);
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMessages(mockMessages.filter((m) => m.conversationId === conversationId));
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [localMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      content: input,
      timestamp: "Just now",
      type: input.includes("```") ? "code" : "text",
      read: false,
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const getUser = (id: string) => mockUsers.find((u) => u.id === id);
  const partner = conversation?.type === "dm"
    ? mockUsers.find((u) => u.id !== currentUser.id && conversation.participants.includes(u.id))
    : null;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Header */}
      <div className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3 min-w-0">
          {partner && (
            <Avatar className="w-8 h-8">
              <AvatarImage src={partner.avatar} />
              <AvatarFallback>{partner.name[0]}</AvatarFallback>
            </Avatar>
          )}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground truncate">{conversation?.name || "Conversation"}</h2>
            <p className="text-[11px] text-muted-foreground">
              {partner ? `${partner.status === "online" ? "Active now" : "Last seen 2h ago"}` : `${conversation?.participants.length || 0} members`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[Phone, Video, Search].map((Icon, i) => (
            <button key={i} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <button onClick={onToggleRightPanel} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-lg font-medium mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          localMessages.map((msg) => {
            const sender = getUser(msg.senderId);
            const isMe = msg.senderId === currentUser.id;

            if (msg.type === "system") {
              return (
                <div key={msg.id} className="text-center">
                  <span className="text-xs text-muted-foreground italic bg-muted/50 px-3 py-1 rounded-full">{msg.content}</span>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex gap-3 group ${isMe ? "flex-row-reverse" : ""}`}>
                {!isMe && (
                  <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                    <AvatarImage src={sender?.avatar} />
                    <AvatarFallback>{sender?.name?.[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                  {!isMe && (
                    <span className="text-[11px] text-muted-foreground font-medium mb-1 ml-1">{sender?.name}</span>
                  )}
                  <div className={`rounded-2xl px-4 py-2.5 ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-tr-md"
                      : "bg-accent text-foreground rounded-tl-md"
                  } ${msg.type === "code" ? "font-mono-code text-xs !p-0 overflow-hidden" : "text-sm"}`}>
                    {msg.type === "code" ? (
                      <div>
                        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
                          <span className="text-[10px] text-muted-foreground">{msg.language || "code"}</span>
                          <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Copy</button>
                        </div>
                        <pre className="p-3 overflow-x-auto whitespace-pre text-foreground/90">{msg.content}</pre>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 ml-1">
                    <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                    {msg.reactions?.map((r) => (
                      <span key={r.emoji} className="inline-flex items-center gap-0.5 text-xs bg-muted rounded-full px-1.5 py-0.5">
                        {r.emoji} <span className="text-[10px] text-muted-foreground">{r.users.length}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-1 mb-2">
          {[Bold, Italic, Code].map((Icon, i) => (
            <button key={i} className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
          <div className="w-px h-4 bg-border mx-1" />
          <button className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Smile className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Paperclip className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none bg-muted rounded-xl border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
              input.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
