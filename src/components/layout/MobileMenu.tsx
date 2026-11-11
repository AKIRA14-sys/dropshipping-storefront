"use client";

import { Menu, X } from "lucide-react";

export function MobileMenu({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="icon-button mobile-menu-toggle"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="main-navigation"
      onClick={onToggle}
    >
      {open ? <X size={21} /> : <Menu size={21} />}
    </button>
  );
}
