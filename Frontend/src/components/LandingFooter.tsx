import { Link } from "react-router-dom";
import { TalkFlyLogo } from "./TalkFlyLogo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <TalkFlyLogo />
            <p className="text-sm text-muted-foreground">
              The AI-powered collaboration platform where dev teams chat, code, and review — all in one place.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Product</h4>
            <ul className="space-y-2">
              {["Features", "AI Tools", "Pricing", "Changelog"].map((item) => (
                <li key={item}>
                  <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "API Reference", "Blog", "Community"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              {["About", "Careers", "Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2026 TalkFly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
