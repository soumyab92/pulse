import { useEffect, useRef, useState } from "react";

export function useCountUp(targetValue: number, duration = 500) {
  const [display, setDisplay] = useState<number>(() =>
    typeof targetValue === "number" && !isNaN(targetValue) ? targetValue : 0
  );
  const prevValue = useRef(targetValue);

  useEffect(() => {
    const startVal = prevValue.current;
    const endVal = typeof targetValue === "number" && !isNaN(targetValue) ? targetValue : 0;

    if (startVal === endVal) {
      setDisplay(endVal);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quad
      const easeOut = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startVal + (endVal - startVal) * easeOut);
      setDisplay(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        prevValue.current = endVal;
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, duration]);

  return display;
}
