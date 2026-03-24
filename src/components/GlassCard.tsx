import type { ReactNode } from "react";
import { motion } from "framer-motion";

type GlassCardProps = {
  title?: string;
  body?: string;
  className?: string;
  children?: ReactNode;
};

export function GlassCard({ title, body, className, children }: GlassCardProps) {
  return (
    <motion.article
      className={`glassCard ${className ?? ""}`.trim()}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.35, once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {title ? <h3>{title}</h3> : null}
      {body ? <p>{body}</p> : null}
      {children}
    </motion.article>
  );
}
