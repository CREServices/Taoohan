import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** Narrower measure for long-form reading columns. */
  size?: "default" | "narrow";
};

/**
 * The single horizontal gutter for the whole site. Padding is intentionally
 * generous at 360px so nothing ever touches the edge of a small phone.
 */
export function Container({ children, className, size = "default" }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "narrow" ? "max-w-3xl" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
