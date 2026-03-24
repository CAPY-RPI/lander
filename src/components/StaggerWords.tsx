import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

type StaggerWordsProps = {
  text: string;
  inView?: boolean;
  className?: string;
  baseDelay?: number;
  stagger?: number;
  amount?: number;
};

export function StaggerWords({
  text,
  inView,
  className,
  baseDelay = 0,
  stagger = 0.03,
  amount = 0.35,
}: StaggerWordsProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const autoInView = useInView(containerRef, { amount });
  const isVisible = inView ?? autoInView;
  const words = text.trim().split(/\s+/);

  return (
    <span ref={containerRef} className={`staggerWords ${className ?? ""}`.trim()}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="staggerWord"
          initial={false}
          animate={
            isVisible
              ? {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.38,
                    delay: baseDelay + index * stagger,
                    ease: [0.33, 1, 0.68, 1],
                  },
                }
              : {
                  opacity: 0,
                  y: 8,
                  filter: "blur(2px)",
                  transition: {
                    duration: 0.22,
                    ease: [0.2, 0, 0.2, 1],
                  },
                }
          }
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
