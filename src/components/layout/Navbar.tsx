"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Cs_Logo from "@/components/shared/Logo";
import Cs_ThemeToggle from "@/components/shared/ThemeToggle";
import { CS_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Cs_Navbar() {
  const cs_pathname = usePathname();

  // active route check
  const cs_isActive = (href: string) =>
    href === "/" ? cs_pathname === "/" : cs_pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <nav aria-label="Main" className="cs_container flex h-16 items-center justify-between gap-4">
        <Cs_Logo />

        {/* desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {CS_NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={cs_isActive(link.href) ? "page" : undefined}
                className={cn("cs_nav_link", cs_isActive(link.href) && "cs_nav_link_active")}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* actions */}
        <div className="flex items-center gap-1.5">
          <Cs_ThemeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>

          {/* mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-4">
                {CS_NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        aria-current={cs_isActive(link.href) ? "page" : undefined}
                        className={cn(
                          "block rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                          cs_isActive(link.href) && "bg-accent text-accent-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-2 px-4 sm:hidden">
                <SheetClose asChild>
                  <Button variant="outline" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
