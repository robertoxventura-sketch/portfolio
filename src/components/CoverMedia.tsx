const videoExt = /\.(mov|mp4|webm)$/i;

export function CoverMedia({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  if (videoExt.test(src)) {
    return (
      <video
        src={src}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label={alt || undefined}
        ref={(node) => {
          if (!node) return;
          node.muted = true;
          void node.play().catch(() => {});
        }}
      />
    );
  }

  return <img src={src} alt={alt} className={className} />;
}
