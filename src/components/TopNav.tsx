import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { StaggerWords } from "./StaggerWords";
import { assets, navItems } from "../data/content";

export function TopNav() {
  const navRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const isProgrammaticScrollRef = useRef(false);
  const pendingScrollLeftRef = useRef<number | null>(null);
  const releaseTimerRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const [activeHref, setActiveHref] = useState(navItems[0]?.href ?? "#launch");
  const [bubbleX, setBubbleX] = useState(0);
  const [bubbleWidth, setBubbleWidth] = useState(0);
  const [bubbleReady, setBubbleReady] = useState(false);

  const easeInOutQuart = (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

  useEffect(() => {
    const updateActiveFromScroll = () => {
      const scroller = document.querySelector(".horizontalScroller") as HTMLElement | null;
      if (!scroller) return;

      if (isProgrammaticScrollRef.current) {
        const pendingLeft = pendingScrollLeftRef.current;
        if (pendingLeft == null || Math.abs(scroller.scrollLeft - pendingLeft) > 2) {
          return;
        }

        isProgrammaticScrollRef.current = false;
        pendingScrollLeftRef.current = null;
      }

      const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
      let nextActive = navItems[0]?.href ?? "#launch";
      let smallestDelta = Number.POSITIVE_INFINITY;

      for (const item of navItems) {
        const id = item.href.replace("#", "");
        const section = document.getElementById(id);
        if (!section) continue;

        const sectionCenter = section.offsetLeft + section.offsetWidth / 2;
        const delta = Math.abs(sectionCenter - viewportCenter);
        if (delta < smallestDelta) {
          smallestDelta = delta;
          nextActive = item.href;
        }
      }

      setActiveHref((prev) => (prev === nextActive ? prev : nextActive));
    };

    updateActiveFromScroll();
    const scroller = document.querySelector(".horizontalScroller") as HTMLElement | null;
    scroller?.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);

    return () => {
      scroller?.removeEventListener("scroll", updateActiveFromScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
      if (releaseTimerRef.current != null) {
        window.clearTimeout(releaseTimerRef.current);
      }
      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateBubble = () => {
      const navNode = navRef.current;
      const activeNode = linkRefs.current[activeHref];
      if (!navNode || !activeNode) {
        setBubbleReady(false);
        return;
      }

      const nextX = activeNode.offsetLeft;
      const nextWidth = activeNode.offsetWidth;
      setBubbleX(nextX);
      setBubbleWidth(nextWidth);
      setBubbleReady(true);
    };

    updateBubble();
    window.addEventListener("resize", updateBubble);
    return () => window.removeEventListener("resize", updateBubble);
  }, [activeHref]);

  const handleNavigate = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetId = href.replace("#", "");
    const scroller = document.querySelector(".horizontalScroller") as HTMLElement | null;
    const target = document.getElementById(targetId);

    if (!scroller || !target) {
      window.location.hash = href;
      return;
    }

    const targetCenter = target.offsetLeft + target.offsetWidth / 2;
    const rawLeft = targetCenter - scroller.clientWidth / 2;
    const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const targetLeft = Math.max(0, Math.min(rawLeft, maxLeft));
    const startLeft = scroller.scrollLeft;
    const distance = targetLeft - startLeft;

    if (Math.abs(distance) < 1) {
      scroller.scrollLeft = targetLeft;
      setActiveHref(href);
      return;
    }

    isProgrammaticScrollRef.current = true;
    pendingScrollLeftRef.current = targetLeft;

    if (scrollRafRef.current != null) {
      window.cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }

    if (releaseTimerRef.current != null) {
      window.clearTimeout(releaseTimerRef.current);
    }

    const durationMs = Math.min(560, Math.max(220, Math.abs(distance) * 0.4));
    const startedAt = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeInOutQuart(t);

      scroller.scrollLeft = startLeft + distance * eased;

      if (t < 1) {
        scrollRafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      scroller.scrollLeft = targetLeft;
      isProgrammaticScrollRef.current = false;
      pendingScrollLeftRef.current = null;
      scrollRafRef.current = null;
    };

    releaseTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      pendingScrollLeftRef.current = null;
      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    }, durationMs + 120);

    scrollRafRef.current = window.requestAnimationFrame(tick);
    setActiveHref(href);
  };

  return (
    <motion.header
      className="topNav"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <img src={assets.logo} alt="Capy logo" className="brandLogo" />

      <nav aria-label="Primary navigation" className="navPill" ref={navRef}>
        <motion.span
          className="navBubble"
          aria-hidden="true"
          initial={false}
          animate={{
            x: bubbleX,
            width: bubbleWidth,
            opacity: bubbleReady ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 20,
            mass: 0.8,
          }}
        />
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            ref={(node) => {
              linkRefs.current[item.href] = node;
            }}
            className={activeHref === item.href ? "isActive" : undefined}
            onClick={handleNavigate(item.href)}
          >
            <StaggerWords text={item.label} baseDelay={0.08} amount={0.1} />
          </a>
        ))}
      </nav>

      <a className="pillButton accent navCta" href="#launch">
        <StaggerWords text="let's go" baseDelay={0.18} amount={0.1} />
      </a>
    </motion.header>
  );
}
