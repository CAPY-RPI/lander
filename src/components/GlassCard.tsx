import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { StaggerWords } from "./StaggerWords";

type GlassCardProps = {
  title?: string;
  body?: string;
  className?: string;
  children?: ReactNode;
  staggerIndex?: number;
};

export function GlassCard({ title, body, className, children, staggerIndex = 0 }: GlassCardProps) {
  const triggerAmount = 0.36;
  const cardRef = useRef<HTMLElement | null>(null);
  const [centerDelta, setCenterDelta] = useState(1);
  const [verticalIndex, setVerticalIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const scroller = cardRef.current?.closest(".horizontalScroller") as HTMLElement | null;
    const scrollTarget: HTMLElement | Window = scroller ?? window;

    const updateMotionMeta = () => {
      const node = cardRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportCenter = viewportWidth / 2;
      const elementCenter = rect.left + rect.width / 2;
      const nextCenterDelta = elementCenter - viewportCenter;

      setCenterDelta((prev) => (Math.abs(prev - nextCenterDelta) < 0.1 ? prev : nextCenterDelta));

      const verticalStep = 170;
      const computedVerticalIndex = Math.max(0, Math.round(rect.top / verticalStep));
      setVerticalIndex(computedVerticalIndex);

      const visibleLeft = Math.max(rect.left, 0);
      const visibleRight = Math.min(rect.right, viewportWidth);
      const visibleWidth = Math.max(0, visibleRight - visibleLeft);
      const maxVisibleWidth = Math.min(rect.width, viewportWidth);
      const triggerDistance = Math.max(1, maxVisibleWidth * triggerAmount);
      const nextProgress = Math.min(1, visibleWidth / triggerDistance);

      setProgress((prev) => (Math.abs(prev - nextProgress) < 0.001 ? prev : nextProgress));
    };

    updateMotionMeta();
    scrollTarget.addEventListener("scroll", updateMotionMeta, { passive: true });
    window.addEventListener("resize", updateMotionMeta);

    return () => {
      scrollTarget.removeEventListener("scroll", updateMotionMeta);
      window.removeEventListener("resize", updateMotionMeta);
    };
  }, [triggerAmount]);

  const textBaseDelay = verticalIndex * 0.08 + staggerIndex * 0.02 + 0.06;
  const progressOffset = Math.min(0.9, staggerIndex * 0.06);
  const delayedProgress =
    progress <= progressOffset ? 0 : (progress - progressOffset) / (1 - progressOffset);
  const side: 1 | -1 = centerDelta >= 0 ? 1 : -1;
  const outX = side * 52;
  const style = {
    opacity: delayedProgress,
    x: outX * (1 - delayedProgress),
    y: 8 * (1 - delayedProgress),
    scale: 0.975 + (1 - 0.975) * delayedProgress,
    filter: `blur(${(3 * (1 - delayedProgress)).toFixed(2)}px)`,
  };
  const textInView = delayedProgress > 0.02;

  return (
    <motion.article
      ref={cardRef}
      className={`glassCard ${className ?? ""}`.trim()}
      style={style}
    >
      {title ? (
        <h3>
          <StaggerWords text={title} inView={textInView} baseDelay={textBaseDelay} stagger={0.032} />
        </h3>
      ) : null}
      {body ? (
        <p>
          <StaggerWords
            text={body}
            inView={textInView}
            baseDelay={textBaseDelay + 0.12}
            stagger={0.02}
          />
        </p>
      ) : null}
      {children}
    </motion.article>
  );
}
