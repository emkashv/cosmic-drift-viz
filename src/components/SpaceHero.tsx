import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowDown } from "lucide-react";
import spaceHero from "@/assets/space-hero.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const SpaceHero = () => {
  const { scrollY } = useScrollAnimation();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const parallaxBg = scrollY * 0.7;
  const parallaxContent = scrollY * 0.4;
  const parallaxStars = scrollY * 0.2;
  const opacity = Math.max(0, 1 - scrollY / 600);
  const scale = 1 + scrollY / 2000;

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with enhanced parallax */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-100"
        style={{
          transform: `translateY(${parallaxBg}px) translateX(${mousePosition.x}px) scale(${scale})`,
          backgroundImage: `url(${spaceHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Multiple gradient layers for depth */}
      <div 
        className="absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          background: 'var(--gradient-hero)',
          opacity: 0.6 + scrollY / 2000,
        }}
      />
      
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(circle at 30% 50%, hsl(var(--cosmic-purple) / 0.2) 0%, transparent 50%)',
        }}
      />
      
      {/* Enhanced animated stars with layers */}
      <div className="absolute inset-0 z-10" style={{ transform: `translateY(${parallaxStars}px)` }}>
        {[...Array(80)].map((_, i) => {
          const size = Math.random() > 0.7 ? 2 : 1;
          const layer = i % 3;
          return (
            <div
              key={i}
              className="absolute bg-foreground rounded-full animate-twinkle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3,
                transform: `translateY(${scrollY * (0.1 + layer * 0.1)}px)`,
              }}
            />
          );
        })}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-cosmic-blue rounded-full animate-drift opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content with parallax and fade */}
      <div 
        className="relative z-20 text-center px-4 max-w-5xl mx-auto transition-all duration-100"
        style={{
          transform: `translateY(${parallaxContent}px) translateY(${mousePosition.y * 0.5}px)`,
          opacity: opacity,
        }}
      >
        <div className="animate-fade-in-up">
          <h1 
            className="text-6xl md:text-8xl font-bold mb-6 text-gradient leading-tight"
            style={{
              transform: `translateY(${mousePosition.y * 0.3}px)`,
            }}
          >
            Explore the Cosmos
          </h1>
          <p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            style={{
              transform: `translateY(${mousePosition.y * 0.2}px)`,
            }}
          >
            Journey through the infinite wonders of space, from distant galaxies to mysterious nebulae
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="glow-cosmic group transition-all duration-300 hover:scale-105">
              <Rocket className="mr-2 h-5 w-5 group-hover:animate-float" />
              Start Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue/10 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator with enhanced animation */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
          style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
        >
          <ArrowDown className="h-8 w-8 text-cosmic-blue animate-pulse" />
        </div>
      </div>
    </section>
  );
};
