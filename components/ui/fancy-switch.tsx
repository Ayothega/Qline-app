"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function FancySwitch({ checked, onCheckedChange, className }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors duration-300",
        checked ? "bg-purple-600" : "bg-gray-300",
        "focus:outline-none active:scale-[0.97]",
        className
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
