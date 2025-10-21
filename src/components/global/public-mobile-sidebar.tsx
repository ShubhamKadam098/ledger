"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./public-header";
import { NavButtonProps } from "@/components/buttons/nav-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Command, Menu } from "lucide-react";

const SidebarNavButton = ({ href, label, className }: NavButtonProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "hover:text-foreground",
        !isActive && "text-muted-foreground",
        className
      )}
    >
      {label}
    </Link>
  );
};

const PublicMobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base shrink-0 md:hidden"
      >
        <Command className="h-6 w-6" />
        <span className="sr-only">O2-Stack</span>
        <span className="hidden md:block whitespace-nowrap">O2-Stack</span>
      </Link>
      <SheetContent side="left">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Command className="h-6 w-6" />
            <span className="sr-only">O2-Stack</span>
            <span className="whitespace-nowrap">O2-Stack</span>
          </Link>
          {NAV_ITEMS.map((item) => (
            <SidebarNavButton
              key={item.href}
              href={item.href}
              label={item.label}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default PublicMobileSidebar;
