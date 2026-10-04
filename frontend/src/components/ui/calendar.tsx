import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export function Calendar({
  className,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={cn("rounded-md border border-border bg-surface p-3 shadow-sm", className)}
      mode="single"
      showOutsideDays
      {...props}
    />
  );
}

export function CalendarWithInput({
  value,
  onChange,
  placeholder,
  className,
  ...props
}: {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <input
        type="date"
        className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        value={value ? value.toISOString().split("T")[0] : ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value ? new Date(e.target.value) : undefined)}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}