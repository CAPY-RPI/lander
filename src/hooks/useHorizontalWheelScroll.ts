import { useEffect } from "react";
import type { RefObject } from "react";

type HorizontalWheelOptions = {
  speed?: number;
  endCutoffPx?: number;
};

export function useHorizontalWheelScroll(
  scrollerRef: RefObject<HTMLElement | null>,
  options: HorizontalWheelOptions = {},
): void {
  const { speed = 1.1, endCutoffPx = 180 } = options;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const getMaxScrollLeft = () =>
      Math.max(0, scroller.scrollWidth - scroller.clientWidth - endCutoffPx);

    const clampScrollPosition = () => {
      const maxScrollLeft = getMaxScrollLeft();
      if (scroller.scrollLeft > maxScrollLeft) {
        scroller.scrollLeft = maxScrollLeft;
      }

      if (scroller.scrollLeft < 0) {
        scroller.scrollLeft = 0;
      }
    };

    const onWheel = (event: WheelEvent) => {
      const hasHorizontalOverflow = scroller.scrollWidth > scroller.clientWidth;
      if (!hasHorizontalOverflow) return;

      const intent = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (intent === 0) return;

      event.preventDefault();
      const next = scroller.scrollLeft + intent * speed;
      const maxScrollLeft = getMaxScrollLeft();
      scroller.scrollLeft = Math.min(maxScrollLeft, Math.max(0, next));
    };

    const onScroll = () => {
      clampScrollPosition();
    };

    clampScrollPosition();

    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [scrollerRef, speed, endCutoffPx]);
}
