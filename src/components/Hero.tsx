import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

const NAME = "Roberto Ventura";
const CURSOR_BLUE = "#0D99FF";
const DRAW_DELAY = 0.12;
const DRAW_DURATION = 1;
const LETTER_MS = 78;

function FigmaCursor() {
  return (
    <span className="relative block origin-top-left scale-50">
      <svg
        width="22"
        height="30"
        viewBox="0 0 13 18"
        fill="none"
        className="block overflow-visible drop-shadow-[0_2px_3px_rgba(0,0,0,0.18)]"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={CURSOR_BLUE}
          stroke="white"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function TypedName() {
  const reduced = useReducedMotion();
  const draw = useMotionValue(reduced ? 1 : 0);
  const [count, setCount] = useState(reduced ? NAME.length : 0);
  const boxWidth = useTransform(draw, (value) => `${value * 100}%`);
  const boxHeight = useTransform(draw, (value) => `${value * 100}%`);

  useEffect(() => {
    if (reduced) {
      draw.set(1);
      setCount(NAME.length);
      return;
    }

    let frame = 0;
    let cancelled = false;
    setCount(0);
    draw.set(0);

    const controls = animate(draw, 1, {
      delay: DRAW_DELAY,
      duration: DRAW_DURATION,
      ease: [0.22, 0.8, 0.2, 1],
      onComplete: () => {
        if (cancelled) return;
        const start = performance.now();
        let shown = 0;
        const tick = (now: number) => {
          const next = Math.min(NAME.length, Math.floor((now - start) / LETTER_MS));
          if (next !== shown) {
            shown = next;
            setCount(next);
          }
          if (next < NAME.length && !cancelled) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
    });

    return () => {
      cancelled = true;
      controls.stop();
      cancelAnimationFrame(frame);
    };
  }, [draw, reduced]);

  const handle = "absolute h-[6px] w-[6px] bg-white border border-[#8ecae6]";

  return (
    <span className="relative inline-block whitespace-nowrap align-baseline" aria-label={NAME}>
      <span className="invisible whitespace-pre" aria-hidden="true">
        {NAME}
      </span>
      <span className="absolute left-0 top-0 whitespace-pre" aria-hidden="true">
        {NAME.slice(0, count)}
      </span>
      <span className="pointer-events-none absolute -inset-x-2 -inset-y-[0.14em]" aria-hidden="true">
        <motion.span className="absolute left-0 top-0 border border-[#8ecae6]" style={{ width: boxWidth, height: boxHeight }}>
          <span className={`${handle} left-0 top-0 -translate-x-1/2 -translate-y-1/2`} />
          <span className={`${handle} right-0 top-0 translate-x-1/2 -translate-y-1/2`} />
          <span className={`${handle} left-0 bottom-0 -translate-x-1/2 translate-y-1/2`} />
          <span className={`${handle} right-0 bottom-0 translate-x-1/2 translate-y-1/2`} />
        </motion.span>
        <motion.span className="absolute z-20" style={{ left: boxWidth, top: boxHeight }}>
          <FigmaCursor />
        </motion.span>
      </span>
    </span>
  );
}

function renderLine(text: string) {
  return text.split(/(\*[^*]+\*|~[^~]+~)/g).map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={index} className="font-semibold tracking-[-0.03em]">
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith("~") && part.endsWith("~")) {
      return <TypedName key={index} />;
    }
    return <span key={index}>{part}</span>;
  });
}

function Headline({ compact }: { compact?: boolean }) {
  const size = compact
    ? "text-display-xs sm:text-display-sm md:text-display-md 3xl:text-display-lg leading-[1.05]"
    : "text-display-sm sm:text-display-sm md:text-display-lg 3xl:text-display-xl 4xl:text-[6rem] leading-[1.05]";

  return (
    <div className={`mx-auto w-fit max-w-full font-display tracking-tight transition-[font-size] duration-500 ${size}`}>
      <div className="h-0 overflow-hidden whitespace-nowrap" aria-hidden="true">
        {ORIGINAL_LINE}
      </div>
      <div className="w-0 min-w-full">
        {renderLine("I'm ~Roberto Ventura~ — a ")}
        <span className="hero-emphasis">human-centered</span>{" "}
        <span className="whitespace-nowrap">product designer based in Los Angeles.</span>
      </div>
    </div>
  );
}

const ORIGINAL_LINE = "I'm Roberto Ventura — a product designer";

export function Hero({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      className="w-fit"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Headline compact={compact} />
    </motion.div>
  );
}