import { ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export const FloatingElement = ({ 
  children, 
  delay = 0, 
  duration = 6 
}: FloatingElementProps) => {
  return (
    <div
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
};
