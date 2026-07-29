"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type Props = {
  afterAlt: string;
  afterBlurDataUrl?: string;
  afterImageUrl: string;
  beforeAlt: string;
  beforeBlurDataUrl?: string;
  beforeImageUrl: string;
  showLabels: boolean;
  split: number;
  onSplitChange: (value: number) => void;
};

export function BeforeAfterSlider({
  afterAlt,
  afterBlurDataUrl,
  afterImageUrl,
  beforeAlt,
  beforeBlurDataUrl,
  beforeImageUrl,
  showLabels,
  split,
  onSplitChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const next = ((clientX - rect.left) / rect.width) * 100;
      onSplitChange(Math.max(0, Math.min(100, next)));
    },
    [onSplitChange],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      updateFromPointer(event.clientX);
    },
    [updateFromPointer],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      updateFromPointer(event.clientX);
    },
    [dragging, updateFromPointer],
  );

  const onPointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const clipStyle = useMemo(
    () => ({
      clipPath: `inset(0 ${100 - split}% 0 0)`,
    }),
    [split],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-[28px] bg-black"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => onSplitChange(50)}
    >
      <div className="absolute inset-0">
        <Image
          src={beforeImageUrl}
          alt={beforeAlt}
          fill
          className="object-contain"
          placeholder={beforeBlurDataUrl ? "blur" : undefined}
          blurDataURL={beforeBlurDataUrl}
          sizes="100vw"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0" style={clipStyle}>
        <Image
          src={afterImageUrl}
          alt={afterAlt}
          fill
          className="object-contain"
          placeholder={afterBlurDataUrl ? "blur" : undefined}
          blurDataURL={afterBlurDataUrl}
          sizes="100vw"
          loading="lazy"
        />
      </div>

      {showLabels ? (
        <>
          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
            Before
          </span>
          <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
            After
          </span>
        </>
      ) : null}

      <div
        className="absolute inset-y-0 flex w-[2px] -translate-x-1/2 items-center justify-center bg-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
        style={{ left: `${split}%` }}
      >
        <div
          className={`size-10 rounded-full border border-white/20 bg-black/70 backdrop-blur transition ${
            dragging ? "scale-105" : ""
          }`}
        />
      </div>
    </div>
  );
}
