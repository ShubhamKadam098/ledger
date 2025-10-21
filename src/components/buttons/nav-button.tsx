"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

export type NavButtonProps = { label: string; href: string, className?: string };

const NavButton = ({
  href,
  label,
  className,
}: NavButtonProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      key={href}
      className={cn(
        isActive && "text-primary",
        "text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      {label}
    </Link>
  );
};

export default NavButton;
