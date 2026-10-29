import { useEffect } from "react";
import { isVideoSrc, posterSrc, useNearViewport, usePrefersReducedMotion } from "../lib/media";

export function CoverMedia({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const [ref, near] = useNearViewport<HTMLVideoElement>();
  const reduce = usePrefersReducedMotion();
  const loadVideo = near && !reduce;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!loadVideo) {
      if (video.dataset.src) {
        delete video.dataset.src;
        video.removeAttribute("src");
        video.load();
      }
      return;
    }
    video.preload = "auto";
    video.muted = true;
    if (video.dataset.src !== src) {
      video.dataset.src = src;
      video.src = src;
    }
    const play = () => void video.play().catch(() => {});
    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });
    return () => video.removeEventListener("loadeddata", play);
  }, [loadVideo, ref, src]);

  if (isVideoSrc(src)) {
    return (
      <video
        ref={ref}
        poster={posterSrc(src)}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-label={alt || undefined}
      />
    );
  }

  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />;
}
