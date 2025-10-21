import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavButton from "@/components/buttons/nav-button";
import PublicMobileSidebar from "@/components/global/public-mobile-sidebar";
import { ModeToggle } from "@/components/ui/theme-switcher";
import { Button } from "@/components/ui/button";
import { NavButtonProps } from "@/components/buttons/nav-button";
import { Command } from "lucide-react";

export const NAV_ITEMS: NavButtonProps[] = [
  //   {
  //     label: "Dashboard",
  //     href: "/dashboard",
  //   },
  //   {
  //     label: "Orders",
  //     href: "/orders",
  //   },
  //   {
  //     label: "Products",
  //     href: "/products",
  //   },
  //   {
  //     label: "Customers",
  //     href: "/customers",
  //   },
  //   {
  //     label: "Settings",
  //     href: "/settings",
  //   },
];

const PublicHeader = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Command className="h-6 w-6" />
          <span className="sr-only">O2-Stack</span>
          <span className="hidden md:block whitespace-nowrap">O2-Stack</span>
        </Link>
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.href} href={item.href} label={item.label} />
        ))}
      </nav>
      <PublicMobileSidebar />
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial flex items-center gap-2">
          <SignedIn>
            <Button asChild size="sm">
              <Link href="/mail">Go to Mail</Link>
            </Button>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button asChild size="sm">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
