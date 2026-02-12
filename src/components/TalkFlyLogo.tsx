import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export function TalkFlyLogo({ size = "default" }: { size?: "default" | "large" }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className={`flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors ${size === "large" ? "w-10 h-10" : "w-8 h-8"}`}>
        <MessageSquare className={`text-primary ${size === "large" ? "w-5 h-5" : "w-4 h-4"}`} />
      </div>
      <span className={`font-display font-bold text-foreground ${size === "large" ? "text-2xl" : "text-xl"}`}>
        Talk<span className="text-primary">Fly</span>
      </span>
    </Link>
  );
}
