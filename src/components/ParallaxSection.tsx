import { useEffect, useState, ReactNode, useRef } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxSection = ({ 
  children, 
  speed = 0.5, 
  className = "" 
}: ParallaxSectionProps) => {
  const [scrollY, setScrollY] = useState(0);
  const { ref, isInView } = useInViewAnimation({ threshold: 0.1 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current && isInView) {
        const rect = sectionRef.current.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll offset relative to element position
        const scrollOffset = (viewportHeight - elementTop) / (viewportHeight + elementHeight);
        setScrollY(scrollOffset * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isInView]);

  return (
    <div
      ref={(node) => {
        if (node) {
          // @ts-ignore
          ref.current = node;
          sectionRef.current = node;
        }
      }}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        transform: `translateY(${isInView ? -scrollY * speed : 0}px) scale(${isInView ? 1 : 0.95})`,
        opacity: isInView ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
};
