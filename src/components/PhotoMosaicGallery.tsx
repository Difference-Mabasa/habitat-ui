import { useState } from "react";
import Photo from "./Photo";
import Icon from "./Icon";
import PhotoLightbox from "./PhotoLightbox";

export interface PhotoMosaicGalleryProps {
  /** Every photo in the set. The mosaic shows the first five; the lightbox cycles through all. */
  photos: string[];
  /** Alt text reused for every tile + the lightbox image. */
  alt?: string;
  /** Empty-state placeholder text when photos.length is 0. */
  emptyLabel?: string;
  /**
   * Compact layout flag for small viewports — single 320px-high tile
   * instead of the 480px five-tile desktop mosaic. Callers typically pass
   * `useViewport().isSm`.
   */
  compact?: boolean;
}

/**
 * Five-tile hero photo mosaic used by /property/:id and /unit?id. Click
 * any tile to open the {@link PhotoLightbox} at that index; a "View all
 * N photos" pill anchors bottom-right when the set overflows the mosaic.
 *
 * Owns the lightbox state internally — callers don't need to manage it.
 * Outer padding / page chrome is the caller's job; this primitive renders
 * only the grid + the lightbox portal.
 */
export default function PhotoMosaicGallery({
  photos,
  alt,
  emptyLabel = "No photos",
  compact = false,
}: PhotoMosaicGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryPhotos = photos.slice(0, 5);
  const overflow = photos.length > galleryPhotos.length;

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: compact ? "1fr" : "2fr 1fr 1fr",
          gridTemplateRows: compact ? "320px" : "1fr 1fr",
          gap: 8,
          height: compact ? 320 : 480,
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {galleryPhotos.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setLightboxIndex(i)}
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
            style={{
              padding: 0,
              border: 0,
              background: "transparent",
              cursor: "pointer",
              ...(i === 0 && !compact ? { gridRow: "1 / 3" } : {}),
            }}
          >
            <Photo
              ratio="auto"
              src={src}
              label={alt ?? ""}
              style={{ borderRadius: 0, height: "100%" }}
            />
          </button>
        ))}
        {galleryPhotos.length === 0 ? (
          <Photo ratio="auto" label={emptyLabel} style={{ borderRadius: 0, height: "100%" }} />
        ) : null}

        {overflow ? (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            style={{
              position: "absolute",
              right: 16,
              bottom: 16,
              padding: "8px 14px",
              background: "var(--paper)",
              color: "var(--ink)",
              border: "1px solid var(--hairline)",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "var(--shadow-md)",
              fontFamily: "inherit",
            }}
          >
            <Icon name="grid" size={14} />
            View all {photos.length} photos
          </button>
        ) : null}
      </div>

      <PhotoLightbox photos={photos} index={lightboxIndex} onChange={setLightboxIndex} alt={alt} />
    </>
  );
}
