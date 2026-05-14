import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

export interface PhotoLightboxProps {
  /** All photos to cycle through. Lightbox is closed when index is null. */
  photos: string[];
  /** Currently-shown index. Null closes the overlay. */
  index: number | null;
  /** Called with the new index when the user navigates; null when closing. */
  onChange: (index: number | null) => void;
  /** Optional alt text — the same string is applied to whichever photo is shown (we don't track per-image alts). */
  alt?: string;
}

/**
 * Full-screen photo browser with prev/next + keyboard navigation. Used
 * by the property-detail gallery's "View all photos" flow and by any
 * other surface that wants a Lightroom-style overlay.
 *
 * Behaviour:
 *   - Esc closes.
 *   - ← / → navigate within the set, with wraparound — pressing → on the
 *     last photo lands on photo 0, and vice versa.
 *   - Clicking the dimmed background closes; clicking the photo itself
 *     does nothing.
 *   - Body scroll is locked while the overlay is open.
 */
export default function PhotoLightbox({ photos, index, onChange, alt }: PhotoLightboxProps) {
  const isOpen = index !== null;
  const trackedIndex = useRef(index);
  trackedIndex.current = index;

  const close = useCallback(() => onChange(null), [onChange]);

  const next = useCallback(() => {
    const i = trackedIndex.current;
    if (i === null || photos.length === 0) return;
    onChange((i + 1) % photos.length);
  }, [onChange, photos.length]);

  const prev = useCallback(() => {
    const i = trackedIndex.current;
    if (i === null || photos.length === 0) return;
    onChange((i - 1 + photos.length) % photos.length);
  }, [onChange, photos.length]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, next, prev]);

  if (!isOpen || index === null || index < 0 || index >= photos.length) return null;
  const src = photos[index];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11,13,18,0.94)",
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Counter — top-left */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 24,
          color: "var(--paper)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.02em",
          fontFamily: "var(--font-mono)",
        }}
      >
        {index + 1} / {photos.length}
      </div>

      {/* Close — top-right */}
      <button
        type="button"
        aria-label="Close photo viewer"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        style={lightboxButtonStyle({ top: 16, right: 16 })}
      >
        <Icon name="x" size={18} />
      </button>

      {/* Prev — left edge */}
      {photos.length > 1 ? (
        <button
          type="button"
          aria-label="Previous photo"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          style={lightboxButtonStyle({ left: 16, top: "50%" })}
        >
          <Icon name="chevL" size={20} />
        </button>
      ) : null}

      {/* Next — right edge */}
      {photos.length > 1 ? (
        <button
          type="button"
          aria-label="Next photo"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          style={lightboxButtonStyle({ right: 16, top: "50%" })}
        >
          <Icon name="chevR" size={20} />
        </button>
      ) : null}

      {/* The photo itself */}
      <img
        src={src}
        alt={alt ?? ""}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "92vw",
          maxHeight: "86vh",
          objectFit: "contain",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          borderRadius: "var(--r-md)",
        }}
      />
    </div>,
    document.body,
  );
}

/** Shared dark-circle button styling for the lightbox controls. */
function lightboxButtonStyle(pos: {
  top?: number | string;
  left?: number;
  right?: number;
  bottom?: number;
}): React.CSSProperties {
  return {
    position: "absolute",
    ...pos,
    transform: pos.top === "50%" ? "translateY(-50%)" : undefined,
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "rgba(11,13,18,0.7)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "var(--paper)",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    fontFamily: "inherit",
  };
}
