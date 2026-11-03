"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import Cs_UserMenu from "@/components/layout/UserMenu";
import { cs_logout, useCs_Session } from "@/lib/auth-client";
import { CS_NAV_LINKS, CS_USER_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Cs_Navbar() {
  const cs_pathname = usePathname();
  const cs_router = useRouter();
  const { data: cs_session, isPending } = useCs_Session();
  const cs_user = cs_session?.user;

  // active route check
  const cs_isActive = (href: string) =>
    href === "/" ? cs_pathname === "/" : cs_pathname.startsWith(href);

  // mobile logout
  const cs_handleLogout = async () => {
    await cs_logout();
    toast.success("Logged out. See you on set soon.");
    cs_router.push("/");
    cs_router.refresh();
  };

  const cs_mobileLink = (href: string, label: string) => (
    <li key={href}>
      <SheetClose asChild>
        <Link
          href={href}
          aria-current={cs_isActive(href) ? "page" : undefined}
          className={cn(
            "block rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
            cs_isActive(href) && "bg-accent text-accent-foreground"
          )}
        >
          {label}
        </Link>
      </SheetClose>
    </li>
  );

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
          {isPending ? (
            <Skeleton className="size-9 rounded-full" />
          ) : cs_user ? (
            <Cs_UserMenu user={cs_user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-4">
                {CS_NAV_LINKS.map((link) => cs_mobileLink(link.href, link.label))}
              </ul>

              {cs_user ? (
                <div className="mt-4 border-t border-border px-4 pt-4">
                  <p className="truncate px-3 text-sm font-semibold">{cs_user.name}</p>
                  <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{cs_user.email}</p>
                  <ul className="flex flex-col gap-1">
                    {CS_USER_LINKS.map((link) => cs_mobileLink(link.href, link.label))}
                  </ul>
                  <SheetClose asChild>
                    <Button variant="destructive" className="mt-3 w-full" onClick={cs_handleLogout}>
                      <LogOut />
                      Logout
                    </Button>
                  </SheetClose>
                </div>
              ) : (
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
              )}
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
