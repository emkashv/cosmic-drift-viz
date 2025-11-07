import { ReactNode, useRef } from "react";
import { use3DScroll } from "@/hooks/use3DScroll";

interface Scroll3DContainerProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export const Scroll3DContainer = ({ 
  children, 
  className = "",
  intensity = 1 
}: Scroll3DContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const transform = use3DScroll({ ref, intensity });

  return (
    <div
      ref={ref}
      className={`transform-3d ${className}`}
      style={{
        transform: `
          perspective(1000px)
          rotateX(${transform.rotateX}deg)
          rotateY(${transform.rotateY}deg)
          translateZ(${transform.translateZ}px)
          scale(${transform.scale})
        `,
      }}
    >
      {children}
    </div>
  );
};
