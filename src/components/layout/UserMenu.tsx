"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarCheck, Heart, LayoutDashboard, LogOut, PlusSquare, Warehouse } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cs_logout } from "@/lib/auth-client";
import { CS_USER_LINKS } from "@/lib/constants";

const CS_LINK_ICONS = [LayoutDashboard, PlusSquare, Warehouse, CalendarCheck, Heart];

export const cs_initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function Cs_UserMenu({ user }: { user: { name: string; email: string; image?: string | null } }) {
  const cs_router = useRouter();

  // logout
  const cs_handleLogout = async () => {
    await cs_logout();
    toast.success("Logged out. See you on set soon.");
    cs_router.push("/");
    cs_router.refresh();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <Avatar className="size-9 border-2 border-primary">
          <AvatarImage src={user.image || undefined} alt={user.name} referrerPolicy="no-referrer" />
          <AvatarFallback>{cs_initials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="space-y-0.5">
          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {CS_USER_LINKS.map((link, index) => {
          const Icon = CS_LINK_ICONS[index];
          return (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href}>
                <Icon />
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={cs_handleLogout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
