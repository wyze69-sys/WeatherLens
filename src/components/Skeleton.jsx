import { cn } from "../lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("rounded-md border border-border bg-elevated", className)}
      {...props}
    />
  );
}
