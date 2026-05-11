interface IframeProps {
  src?: string;
  title?: string;
}

function isVideoSource(src: string) {
  return /\.(mp4|mov|webm|ogg)$/iu.test(src);
}

function sanitizePlayerUrl(src: string) {
  try {
    const url = new URL(src);
    url.searchParams.delete("metadata-video-title");
    url.searchParams.delete("video-title");
    return url.toString();
  } catch {
    return src;
  }
}

export default function Iframe({ src = "", title = "Lesson media" }: IframeProps) {
  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-[24px] bg-white/40 text-[var(--textBody)]">
        Video source is not available yet.
      </div>
    );
  }

  if (isVideoSource(src)) {
    return (
      <div className="w-full overflow-hidden rounded-[24px] bg-black/80">
        <video
          src={src}
          controls
          className="aspect-video w-full"
          preload="metadata"
        />
      </div>
    );
  }

  const sanitizedSrc = sanitizePlayerUrl(src);

  return (
    <div className="relative w-full overflow-hidden rounded-[24px]">
      <iframe
        src={sanitizedSrc}
        title={title}
        className="aspect-video w-full border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
      />
    </div>
  );
}
