import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { motion, useAnimationControls, useInView } from "framer-motion";

type AnimatedPanelProps = {
  className: string;
  id?: string;
  children: ReactNode;
  staggerIndex?: number;
};

export function AnimatedPanel({ className, id, children, staggerIndex = 0 }: AnimatedPanelProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const inView = useInView(panelRef, { amount: 0.2 });
  const controls = useAnimationControls();
  const [side, setSide] = useState<1 | -1>(1);

  useEffect(() => {
    const updateSide = () => {
      const node = panelRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerWidth / 2;
      const elementCenter = rect.left + rect.width / 2;

      if (rect.left >= window.innerWidth) {
        setSide(1);
        return;
      }

      if (rect.right <= 0) {
        setSide(-1);
        return;
      }

      setSide(elementCenter < viewportCenter ? -1 : 1);
    };

    updateSide();
    const scroller = panelRef.current?.closest(".horizontalScroller") as HTMLElement | null;
    const scrollTarget: HTMLElement | Window = scroller ?? window;

    scrollTarget.addEventListener("scroll", updateSide, { passive: true });
    window.addEventListener("resize", updateSide);

    return () => {
      scrollTarget.removeEventListener("scroll", updateSide);
      window.removeEventListener("resize", updateSide);
    };
  }, []);

  useEffect(() => {
    const outX = side * 84;
    const enterDelay = staggerIndex * 0.07;
    const exitDelay = staggerIndex * 0.05;
    controls.start(
      inView
        ? { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
        : { opacity: 0, x: outX, y: 10, scale: 0.965, filter: "blur(4px)" },
      {
        duration: inView ? 0.62 : 0.52,
        ease: [0.645, 0.045, 0.355, 1],
        delay: inView ? enterDelay : exitDelay,
      },
    );
  }, [controls, inView, side, staggerIndex]);

  return (
    <motion.section
      ref={panelRef}
      id={id}
      className={className}
      initial={{ opacity: 0, x: 0, y: 10, scale: 0.965, filter: "blur(4px)" }}
      animate={controls}
    >
      {children}
    </motion.section>
  );
}
