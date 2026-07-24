import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export function useCountUp(value: number, duration = 0.6) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const from = prevValue.current;
    const controls = animate(from, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return display;
}
