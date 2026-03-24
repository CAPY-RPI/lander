import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

type AnimatedPanelProps = {
  className: string;
  id?: string;
  children: ReactNode;
  staggerIndex?: number;
};

export function AnimatedPanel({ className, id, children, staggerIndex = 0 }: AnimatedPanelProps) {
  const triggerAmount = 0.3;
  const panelRef = useRef<HTMLElement | null>(null);
  const [centerDelta, setCenterDelta] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateSide = () => {
      const node = panelRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportCenter = viewportWidth / 2;
      const elementCenter = rect.left + rect.width / 2;
      const nextCenterDelta = elementCenter - viewportCenter;

      setCenterDelta((prev) => (Math.abs(prev - nextCenterDelta) < 0.1 ? prev : nextCenterDelta));

      const visibleLeft = Math.max(rect.left, 0);
      const visibleRight = Math.min(rect.right, viewportWidth);
      const visibleWidth = Math.max(0, visibleRight - visibleLeft);
      const maxVisibleWidth = Math.min(rect.width, viewportWidth);
      const triggerDistance = Math.max(1, maxVisibleWidth * triggerAmount);
      const nextProgress = Math.min(1, visibleWidth / triggerDistance);

      setProgress((prev) => (Math.abs(prev - nextProgress) < 0.001 ? prev : nextProgress));
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
  }, [triggerAmount]);

  const progressOffset = Math.min(0.92, staggerIndex * 0.085);
  const delayedProgress =
    progress <= progressOffset ? 0 : (progress - progressOffset) / (1 - progressOffset);
  const side: 1 | -1 = centerDelta >= 0 ? 1 : -1;
  const outX = side * 84;
  const style = {
    opacity: delayedProgress,
    x: outX * (1 - delayedProgress),
    y: 10 * (1 - delayedProgress),
    scale: 0.965 + (1 - 0.965) * delayedProgress,
    filter: `blur(${(4 * (1 - delayedProgress)).toFixed(2)}px)`,
  };

  return (
    <motion.section
      ref={panelRef}
      id={id}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  );
}
