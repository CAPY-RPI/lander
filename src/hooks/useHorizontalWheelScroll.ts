import { useEffect } from "react";
import type { RefObject } from "react";

type HorizontalWheelOptions = {
  speed?: number;
};

export function useHorizontalWheelScroll(
  scrollerRef: RefObject<HTMLElement | null>,
  options: HorizontalWheelOptions = {},
): void {
  const { speed = 1.1 } = options;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onWheel = (event: WheelEvent) => {
      const hasHorizontalOverflow = scroller.scrollWidth > scroller.clientWidth;
      if (!hasHorizontalOverflow) return;

      const intent = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (intent === 0) return;

      event.preventDefault();
      scroller.scrollLeft += intent * speed;
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      scroller.removeEventListener("wheel", onWheel);
    };
  }, [scrollerRef, speed]);
}
