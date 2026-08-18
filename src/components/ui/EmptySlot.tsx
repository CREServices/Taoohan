import { cn } from "@/lib/cn";

/**
 * A clearly-marked placeholder for content the client has not supplied yet.
 *
 * This exists so blocked content is VISIBLE during review rather than silently
 * missing, and so nobody is tempted to invent data to fill the gap. Every
 * instance is a tracked blocker in the milestone report.
 */
export function EmptySlot({
  label,
  note,
  className,
}: {
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      data-empty-slot={label}
      className={cn(
        "rounded-card border border-dashed border-hairline bg-surface-muted p-6 text-center",
        className,
      )}
    >
      <p className="text-sm font-medium text-ink-muted">
        Awaiting client content: {label}
      </p>
      {note && <p className="mt-1 text-xs text-ink-muted/80">{note}</p>}
    </div>
  );
}
