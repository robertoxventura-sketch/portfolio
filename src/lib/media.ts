import { useEffect, useRef, useState } from "react";

const videoExt = /\.(mov|mp4|webm|m4v)(\?.*)?$/i;

export function isVideoSrc(src: string) {
  return videoExt.test(src);
}

export function posterSrc(src: string) {
  const path = src.split("?")[0] ?? src;
  return path.replace(/\.(mov|mp4|webm|m4v)$/i, "-poster.webp");
}

export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduce;
}

export function useNearViewport<T extends Element>(rootMargin = "360px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, near] as const;
}
