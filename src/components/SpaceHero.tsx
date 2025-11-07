import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowDown } from "lucide-react";
import spaceHero from "@/assets/space-hero.jpg";

export const SpaceHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxStars = scrollY * 0.5;
  const parallaxContent = scrollY * 0.3;

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers with parallax */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${parallaxStars}px)`,
          backgroundImage: `url(${spaceHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'var(--gradient-hero)',
        }}
      />
      
      {/* Animated stars */}
      <div className="absolute inset-0 z-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div 
        className="relative z-20 text-center px-4 max-w-5xl mx-auto"
        style={{
          transform: `translateY(${parallaxContent}px)`,
        }}
      >
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient leading-tight">
            Explore the Cosmos
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Journey through the infinite wonders of space, from distant galaxies to mysterious nebulae
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="glow-cosmic group">
              <Rocket className="mr-2 h-5 w-5 group-hover:animate-float" />
              Start Journey
            </Button>
            <Button size="lg" variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue/10">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-8 w-8 text-cosmic-blue" />
        </div>
      </div>
    </section>
  );
};
