import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

interface PlanetCardProps {
  name: string;
  description: string;
  image: string;
  facts: string[];
  index: number;
}

export const PlanetCard = ({ name, description, image, facts, index }: PlanetCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Card
      ref={cardRef}
      className={`overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-cosmic-blue transition-all duration-500 ${
        isVisible ? "animate-scale-in" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-64 overflow-hidden group">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />
        <h3 className="absolute bottom-4 left-4 text-3xl font-bold text-gradient">
          {name}
        </h3>
      </div>
      
      <div className="p-6 space-y-4">
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-cosmic-blue">Key Facts:</h4>
          <ul className="space-y-1">
            {facts.map((fact, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start">
                <span className="text-cosmic-purple mr-2">•</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
