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

    let isMouseDragging = false;
    let hasActivatedDrag = false;
    let suppressNextClick = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    const dragThresholdPx = 6;

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("button, input, textarea, select, label")) return;

      isMouseDragging = true;
      hasActivatedDrag = false;
      dragStartX = event.clientX;
      dragStartScrollLeft = scroller.scrollLeft;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isMouseDragging) return;

      const deltaX = event.clientX - dragStartX;
      if (!hasActivatedDrag && Math.abs(deltaX) < dragThresholdPx) {
        return;
      }

      if (!hasActivatedDrag) {
        hasActivatedDrag = true;
        scroller.classList.add("is-dragging");
      }

      const maxScrollLeft = getMaxScrollLeft();
      const next = dragStartScrollLeft - deltaX;
      scroller.scrollLeft = Math.min(maxScrollLeft, Math.max(0, next));
      event.preventDefault();
    };

    const endMouseDrag = () => {
      if (!isMouseDragging) return;

      if (hasActivatedDrag) {
        suppressNextClick = true;
      }

      isMouseDragging = false;
      hasActivatedDrag = false;
      scroller.classList.remove("is-dragging");
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressNextClick) return;

      event.preventDefault();
      event.stopPropagation();
      suppressNextClick = false;
    };

    const onNativeDragStart = (event: DragEvent) => {
      if (isMouseDragging) {
        event.preventDefault();
      }
    };

    clampScrollPosition();

    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("mousedown", onMouseDown);
    scroller.addEventListener("dragstart", onNativeDragStart);
    scroller.addEventListener("click", onClickCapture, true);
    window.addEventListener("mousemove", onMouseMove, { passive: false });
    window.addEventListener("mouseup", endMouseDrag);
    return () => {
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("mousedown", onMouseDown);
      scroller.removeEventListener("dragstart", onNativeDragStart);
      scroller.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endMouseDrag);
      scroller.classList.remove("is-dragging");
    };
  }, [scrollerRef, speed, endCutoffPx]);
}
