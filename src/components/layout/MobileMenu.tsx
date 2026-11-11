"use client";

import type { RefObject } from "react";
import { Menu, X } from "lucide-react";

export function MobileMenu({
  open,
  onToggle,
  buttonRef,
}: {
  open: boolean;
  onToggle: () => void;
  buttonRef?: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="icon-button mobile-menu-toggle"
      aria-label={open ? "Close shopping menu" : "Open shopping menu"}
      aria-expanded={open}
      aria-controls="navigation-drawer"
      onClick={onToggle}
    >
      {open ? <X size={21} /> : <Menu size={21} />}
    </button>
  );
}
