import { LandingHeader } from "@/components/LandingHeader";
import { LandingFooter } from "@/components/LandingFooter";
import { HeroSection } from "@/components/HeroSection";
import { AIToolsSection } from "@/components/AIToolsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <AIToolsSection />
        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-gradient">Ship Faster</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of developers already collaborating on TalkFly. Free to start, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth">
                <button className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Get Started Free
                </button>
              </a>
              <a href="/features">
                <button className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3 text-base font-semibold text-foreground hover:bg-accent transition-colors">
                  See Features
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;
