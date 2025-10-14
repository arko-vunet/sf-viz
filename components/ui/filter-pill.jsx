"use client";

import React from "react";
import { cn } from "@/lib/utils";

function FilterPill({
  checked = false,
  disabled = false,
  onCheckedChange,
  className,
  as = "button",
  children,
  ...props
}, ref) {
  const Comp = as;

  const handleClick = (e) => {
    if (disabled) return;
    if (typeof onCheckedChange === "function") onCheckedChange(!checked, e);
  };

  return (
    <Comp
      ref={ref}
      type={Comp === "button" ? "button" : undefined}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={Comp === "button" ? disabled : undefined}
      data-state={checked ? "checked" : "unchecked"}
      className={cn(
        "filter-pill inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-sm border border-gray-300 text-gray-800 bg-[--fp-bg] select-none transition-[background-image,box-shadow] outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        disabled ? "pointer-events-none opacity-50" : "cursor-pointer hover:no-underline",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Comp>
  );
}

const _FilterPill = React.forwardRef(FilterPill);

export { _FilterPill as FilterPill };


