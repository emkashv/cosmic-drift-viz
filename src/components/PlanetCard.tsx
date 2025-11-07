import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

interface PlanetCardProps {
  name: string;
  description: string;
  image: string;
  facts: string[];
  index: number;
}

export const PlanetCard = ({ name, description, image, facts, index }: PlanetCardProps) => {
  const { ref, isInView } = useInViewAnimation({ threshold: 0.2, triggerOnce: true });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-700 ease-out ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${isHovered ? "border-cosmic-blue scale-105 shadow-2xl" : ""}`}
      style={{ 
        transitionDelay: `${index * 0.15}s`,
      }}
    >
      <div className="relative h-64 overflow-hidden group">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-all duration-1000 ease-out"
          style={{
            transform: isHovered ? 'scale(1.2) rotate(2deg)' : 'scale(1)',
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent transition-opacity duration-700"
          style={{ opacity: isHovered ? 0.8 : 0.6 }}
        />
        <h3 
          className="absolute bottom-4 left-4 text-3xl font-bold text-gradient transition-all duration-500"
          style={{
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          }}
        >
          {name}
        </h3>
      </div>
      
      <div className="p-6 space-y-4">
        <p className="text-muted-foreground leading-relaxed transition-all duration-500">
          {description}
        </p>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-cosmic-blue">Key Facts:</h4>
          <ul className="space-y-1">
            {facts.map((fact, i) => (
              <li 
                key={i} 
                className="text-sm text-muted-foreground flex items-start transition-all duration-300"
                style={{
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  transitionDelay: `${i * 0.05}s`,
                }}
              >
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
