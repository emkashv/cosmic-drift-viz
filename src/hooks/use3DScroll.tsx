import { useEffect, useState, RefObject } from "react";

interface Use3DScrollProps {
  ref: RefObject<HTMLElement>;
  intensity?: number;
}

export const use3DScroll = ({ ref, intensity = 1 }: Use3DScrollProps) => {
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    translateZ: 0,
    scale: 1,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const elementCenter = elementTop + elementHeight / 2;
      
      // Calculate scroll progress (0 to 1)
      const scrollProgress = 1 - (elementCenter / windowHeight);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      
      // 3D transformations based on scroll
      const rotateX = (clampedProgress - 0.5) * 15 * intensity;
      const rotateY = (clampedProgress - 0.5) * -10 * intensity;
      const translateZ = clampedProgress * 50 * intensity;
      const scale = 0.85 + (clampedProgress * 0.15);

      setTransform({
        rotateX,
        rotateY,
        translateZ,
        scale,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref, intensity]);

  return transform;
};
