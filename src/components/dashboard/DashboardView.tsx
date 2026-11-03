"use client";

import Link from "next/link";
import { CalendarCheck, Check, DollarSign, Inbox, Plus, Warehouse, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Cs_EmptyState from "@/components/shared/EmptyState";
import Cs_StatusBadge from "@/components/shared/StatusBadge";
import { useCs_Fetch } from "@/hooks/useCsFetch";
import { cs_apiFetch } from "@/lib/api";
import { useCs_Session } from "@/lib/auth-client";
import { cs_formatBookingDate, cs_formatMoney } from "@/lib/format";
import type { CsBooking, CsDashboard } from "@/lib/types";

export default function Cs_DashboardView() {
  const { data: cs_session } = useCs_Session();
  const cs_stats = useCs_Fetch<CsDashboard>("/dashboard");
  const cs_requests = useCs_Fetch<CsBooking[]>("/incoming-bookings");

  // host response
  const cs_respond = async (booking: CsBooking, status: "Confirmed" | "Cancelled") => {
    try {
      const cs_updated = await cs_apiFetch<CsBooking>(`/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      cs_requests.setData((current) => (current ?? []).map((item) => (item._id === booking._id ? cs_updated : item)));
      cs_stats.reload();
      toast.success(status === "Confirmed" ? `Confirmed ${booking.userName}'s booking.` : `Declined ${booking.userName}'s request.`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const cs_cards = cs_stats.data
    ? [
        { label: "My listings", value: cs_stats.data.listings, icon: Warehouse, href: "/my-listings" },
        { label: "My bookings", value: cs_stats.data.bookings.total, icon: CalendarCheck, href: "/my-bookings" },
        { label: "Requests to review", value: cs_stats.data.requests.pending, icon: Inbox, href: "#requests" },
        { label: "Earned from bookings", value: cs_formatMoney(cs_stats.data.earnings), icon: DollarSign, href: "#requests" },
      ]
    : [];

  return (
    <div className="space-y-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <h1 className="cs_display text-4xl sm:text-5xl">
            {cs_session ? `Hi, ${cs_session.user.name.split(" ")[0]}` : "Dashboard"}
          </h1>
          <p className="cs_prose">Your listings, your bookings and the requests waiting for your answer.</p>
        </div>
        <Button asChild>
          <Link href="/add-studio">
            <Plus />
            Add New Studio
          </Link>
        </Button>
      </header>

      {/* stats */}
      {cs_stats.loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cs_cards.map(({ label, value, icon: Icon, href }) => (
            <li key={label}>
              <Link href={href} className="flex h-full flex-col rounded-xl border border-border bg-card p-5 hover:border-primary">
                <Icon className="size-5 text-primary" />
                <span className="cs_display mt-4 text-3xl">{value}</span>
                <span className="mt-1 text-sm text-muted-foreground">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* incoming requests */}
      <section id="requests" className="scroll-mt-24 space-y-5">
        <div className="space-y-2">
          <h2 className="cs_section_title">Booking requests</h2>
          <p className="cs_prose">
            Creators who want to book your studios. Confirming a request locks those hours, so overlapping requests can&apos;t
            be confirmed.
          </p>
        </div>

        {cs_requests.loading ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : !cs_requests.data?.length ? (
          <Cs_EmptyState
            title="No requests yet"
            text="When creators book one of your studios, their requests appear here for you to confirm or decline."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Studio</th>
                  <th className="px-4 py-3 font-medium">Creator</th>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Earns</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cs_requests.data.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-4 py-3 font-medium">{booking.studioTitle}</td>
                    <td className="px-4 py-3">
                      <p>{booking.userName}</p>
                      <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{cs_formatBookingDate(booking.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.startTime} to {booking.endTime}
                      </p>
                    </td>
                    <td className="px-4 py-3">{cs_formatMoney(booking.subtotal)}</td>
                    <td className="px-4 py-3">
                      <Cs_StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3">
                      {booking.status === "Pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => cs_respond(booking, "Confirmed")}>
                            <Check />
                            Confirm
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => cs_respond(booking, "Cancelled")}>
                            <X />
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <p className="text-right text-xs text-muted-foreground">No action needed</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
