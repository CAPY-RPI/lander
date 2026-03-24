import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { motion, useAnimationControls, useInView } from "framer-motion";
import { StaggerWords } from "./StaggerWords";

type GlassCardProps = {
  title?: string;
  body?: string;
  className?: string;
  children?: ReactNode;
  staggerIndex?: number;
};

export function GlassCard({ title, body, className, children, staggerIndex = 0 }: GlassCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const inView = useInView(cardRef, { amount: 0.24 });
  const controls = useAnimationControls();
  const [side, setSide] = useState<1 | -1>(1);
  const [verticalIndex, setVerticalIndex] = useState(0);

  useEffect(() => {
    const updateMotionMeta = () => {
      const node = cardRef.current;
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
      } else {
        setSide(elementCenter < viewportCenter ? -1 : 1);
      }

      const verticalStep = 170;
      const computedVerticalIndex = Math.max(0, Math.round(rect.top / verticalStep));
      setVerticalIndex(computedVerticalIndex);
    };

    updateMotionMeta();
    const scroller = cardRef.current?.closest(".horizontalScroller") as HTMLElement | null;
    const scrollTarget: HTMLElement | Window = scroller ?? window;

    scrollTarget.addEventListener("scroll", updateMotionMeta, { passive: true });
    window.addEventListener("resize", updateMotionMeta);

    return () => {
      scrollTarget.removeEventListener("scroll", updateMotionMeta);
      window.removeEventListener("resize", updateMotionMeta);
    };
  }, []);

  useEffect(() => {
    const outX = side * 52;
    const compositeIndex = verticalIndex + staggerIndex * 0.2;
    const enterDelay = compositeIndex * 0.08;
    const exitDelay = compositeIndex * 0.05;
    controls.start(
      inView
        ? { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
        : { opacity: 0, x: outX, y: 8, scale: 0.975, filter: "blur(3px)" },
      {
        duration: inView ? 0.55 : 0.48,
        ease: [0.645, 0.045, 0.355, 1],
        delay: inView ? enterDelay : exitDelay,
      },
    );
  }, [controls, inView, side, staggerIndex, verticalIndex]);

  const textBaseDelay = verticalIndex * 0.08 + staggerIndex * 0.02 + 0.06;

  return (
    <motion.article
      ref={cardRef}
      className={`glassCard ${className ?? ""}`.trim()}
      initial={{ opacity: 0, x: 0, y: 8, scale: 0.975, filter: "blur(3px)" }}
      animate={controls}
    >
      {title ? (
        <h3>
          <StaggerWords text={title} inView={inView} baseDelay={textBaseDelay} stagger={0.032} />
        </h3>
      ) : null}
      {body ? (
        <p>
          <StaggerWords text={body} inView={inView} baseDelay={textBaseDelay + 0.12} stagger={0.02} />
        </p>
      ) : null}
      {children}
    </motion.article>
  );
}
