import Image from "next/image";
import { hasImage, type ImageSlot } from "@/config/images";
import { cn } from "@/lib/cn";

/**
 * A photography slot that renders the real image once one is supplied, and the
 * standard dashed placeholder until then — Developer 2 scope.
 *
 * This keeps image slots on the same footing as every other blocked item on the
 * site (contact details, manpower categories, stats, testimonials): the gap is
 * VISIBLE during review, never a broken image and never silently missing, and
 * filling it is a config edit rather than a JSX edit.
 *
 * The wrapper holds the aspect ratio either way, so dropping a photo in cannot
 * change the page's layout or shift anything below it.
 */
export function SiteImage({
  slot,
  /** Tailwind aspect-ratio class — must match between both states. */
  aspect = "aspect-4/3",
  /** Passed to next/image so the right size is served per breakpoint. */
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className,
}: {
  slot: ImageSlot;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!hasImage(slot)) {
    return (
      <div
        data-empty-slot={slot.label}
        data-testid={`image-slot-${slot.key}`}
        className={cn(
          "flex items-center justify-center rounded-card border border-dashed border-hairline bg-surface-muted",
          aspect,
          className,
        )}
      >
        <p className="px-6 text-center text-sm text-ink-muted">
          Awaiting client content: {slot.label}
          {slot.note && (
            <span className="mt-1 block text-xs text-ink-muted">
              {slot.note}
            </span>
          )}
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid={`image-slot-${slot.key}`}
      className={cn(
        "relative overflow-hidden rounded-card bg-surface-muted",
        aspect,
        className,
      )}
    >
      <Image
        src={slot.src}
        alt={slot.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
