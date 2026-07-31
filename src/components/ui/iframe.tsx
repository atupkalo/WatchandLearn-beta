'use client';

import { useEffect, useRef, type CSSProperties, type ElementRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import {
  LESSON_SEGMENT_PLAY_EVENT,
  type LessonSegmentPlayDetail,
} from "@/lib/lesson-media-events";

interface IframeProps {
  src?: string;
  title?: string;
}

interface ParsedMuxPlayerUrl {
  accentColor?: string;
  metadataVideoTitle?: string;
  playbackId: string;
  playbackToken?: string;
  primaryColor?: string;
  secondaryColor?: string;
  videoTitle?: string;
}

function isVideoSource(src: string) {
  return /\.(mp4|mov|webm|ogg)$/iu.test(src);
}

function parseMuxPlayerUrl(src: string): ParsedMuxPlayerUrl | null {
  try {
    const url = new URL(src);

    if (url.hostname !== "player.mux.com") {
      return null;
    }

    const playbackId = url.pathname.replace(/^\/+/u, "");

    if (!playbackId) {
      return null;
    }

    return {
      accentColor: url.searchParams.get("accent-color") ?? undefined,
      metadataVideoTitle:
        url.searchParams.get("metadata-video-title") ?? undefined,
      playbackId,
      playbackToken: url.searchParams.get("token") ?? undefined,
      primaryColor: url.searchParams.get("primary-color") ?? undefined,
      secondaryColor: url.searchParams.get("secondary-color") ?? undefined,
      videoTitle: url.searchParams.get("video-title") ?? undefined,
    };
  } catch {
    return null;
  }
}

export default function Iframe({ src = "", title = "Lesson media" }: IframeProps) {
  const muxPlayerRef = useRef<ElementRef<typeof MuxPlayer> | null>(null);
  const htmlVideoRef = useRef<HTMLVideoElement | null>(null);
  const segmentEndRef = useRef<number | null>(null);

  function getActivePlayer() {
    return (
      (muxPlayerRef.current as unknown as HTMLMediaElement | null) ??
      htmlVideoRef.current
    );
  }

  useEffect(() => {
    const player = getActivePlayer();

    if (!player) {
      return;
    }

    const handleTimeUpdate = () => {
      if (segmentEndRef.current == null) {
        return;
      }

      if (player.currentTime >= segmentEndRef.current) {
        player.pause();
        segmentEndRef.current = null;
      }
    };

    player.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      player.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [src]);

  useEffect(() => {
    const handleSegmentPlay = (event: Event) => {
      const player = getActivePlayer();

      if (!player) {
        return;
      }

      const customEvent = event as CustomEvent<LessonSegmentPlayDetail>;
      const detail = customEvent.detail;

      if (!detail) {
        return;
      }

      segmentEndRef.current = detail.endSec;
      player.currentTime = detail.startSec;
      void player.play();
    };

    window.addEventListener(LESSON_SEGMENT_PLAY_EVENT, handleSegmentPlay);

    return () => {
      window.removeEventListener(LESSON_SEGMENT_PLAY_EVENT, handleSegmentPlay);
    };
  }, [src]);

  useEffect(() => {
    const playerElement = muxPlayerRef.current;

    if (!playerElement?.shadowRoot) {
      return;
    }

    const shadowRoot = playerElement.shadowRoot as ShadowRoot;

    const collectShadowRoots = (root: ShadowRoot): ShadowRoot[] => {
      const roots = [root];
      const elements = root.querySelectorAll("*");

      for (const element of elements) {
        const nestedShadowRoot = (element as HTMLElement).shadowRoot;
        if (nestedShadowRoot) {
          roots.push(...collectShadowRoots(nestedShadowRoot));
        }
      }

      return roots;
    };

    const setImportantStyle = (element: HTMLElement, property: string, value: string) => {
      if (element.style.getPropertyValue(property) === value) {
        return;
      }

      element.style.setProperty(property, value, "important");
    };

    const applyShadowStyles = () => {
      for (const root of collectShadowRoots(shadowRoot)) {
        const mediaTheme = root.querySelector("media-theme") as HTMLElement | null;
        if (mediaTheme) {
          setImportantStyle(mediaTheme, "width", "106%");
          setImportantStyle(mediaTheme, "transform", "translateX(-3%)");
        }

        const controlBars = root.querySelectorAll("media-control-bar");
        for (const controlBar of controlBars) {
          const element = controlBar as HTMLElement;
          setImportantStyle(element, "padding", "0 32px 16px 32px");
        }

        const timeRanges = root.querySelectorAll("media-time-range");
        for (const timeRange of timeRanges) {
          const element = timeRange as HTMLElement;
          setImportantStyle(element, "padding", "0 32px 16px 32px");
        }
      }
    };

    applyShadowStyles();

    const frameId = requestAnimationFrame(() => {
      applyShadowStyles();
    });

    const timeoutId = window.setTimeout(() => {
      applyShadowStyles();
    }, 250);

    const observer = new MutationObserver(() => {
      applyShadowStyles();
    });

    observer.observe(shadowRoot, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [src]);

  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-[24px] bg-white/40 text-[var(--textBody)]">
        Video source is not available yet.
      </div>
    );
  }

  const muxPlayerConfig = parseMuxPlayerUrl(src);

  if (muxPlayerConfig) {
    const muxPlayerStyle = {
      "--airplay-button": "none",
      "--cast-button": "none",
      "--media-accent-color": "var(--accent)",
      "--media-airplay-button-display": "none",
      "--media-background-color": "transparent",
      "--media-cast-button-display": "none",
      "--media-control-background": "transparent",
      "--media-control-hover-background": "transparent",
      "--media-object-fit": "cover",
      "--media-pip-button-display": "none",
      "--media-rendition-menu-button-display": "none",
      "--pip-button": "none",
      "--rendition-menu-button": "none",
    } satisfies CSSProperties & Record<`--${string}`, string>;

    return (
      <div className="w-full overflow-hidden rounded-[24px]">
        <MuxPlayer
          ref={muxPlayerRef}
          playbackId={muxPlayerConfig.playbackId}
          className="media-theme block aspect-video w-full"
          style={muxPlayerStyle}
          playbackRates={[0.5, 0.75, 1, 1.25, 1.5]}
          backwardSeekOffset={10}
          forwardSeekOffset={10}
          disablePictureInPicture
          accentColor={muxPlayerConfig.accentColor}
          metadataVideoId={muxPlayerConfig.playbackId}
          primaryColor={muxPlayerConfig.primaryColor}
          secondaryColor={muxPlayerConfig.secondaryColor}
          tokens={
            muxPlayerConfig.playbackToken
              ? { playback: muxPlayerConfig.playbackToken }
              : undefined
          }
          aria-label={title}
          title={title}
        />
      </div>
    );
  }

  if (isVideoSource(src)) {
    return (
      <div className="w-full overflow-hidden rounded-[24px] bg-black/80">
        <video
          ref={htmlVideoRef}
          src={src}
          controls
          className="aspect-video w-full"
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-[24px]">
      <iframe
        src={src}
        title={title}
        className="aspect-video w-full border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
      />
    </div>
  );
}
