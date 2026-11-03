"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Clock, MapPin, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Cs_ConfirmDialog from "@/components/shared/ConfirmDialog";
import Cs_EmptyState from "@/components/shared/EmptyState";
import Cs_StatusBadge from "@/components/shared/StatusBadge";
import { useCs_Fetch } from "@/hooks/useCsFetch";
import { cs_apiFetch } from "@/lib/api";
import { cs_formatBookingDate, cs_formatMoney } from "@/lib/format";
import type { CsBooking, CsBookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const CS_FILTERS: ("All" | CsBookingStatus)[] = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function Cs_MyBookingsView() {
  const { data, loading, error, reload, setData } = useCs_Fetch<CsBooking[]>("/my-bookings");
  const [cs_filter, cs_setFilter] = useState<(typeof CS_FILTERS)[number]>("All");

  // cancel pending booking
  const cs_cancel = async (booking: CsBooking) => {
    try {
      const cs_updated = await cs_apiFetch<CsBooking>(`/bookings/${booking._id}/cancel`, { method: "PATCH" });
      setData((current) => (current ?? []).map((item) => (item._id === booking._id ? cs_updated : item)));
      toast.success("Booking cancelled.");
      return true;
    } catch (cs_error) {
      toast.error((cs_error as Error).message);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading your bookings">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <Cs_EmptyState title="Your bookings didn't load" text={error} action={<Button onClick={reload}>Try again</Button>} />;
  }

  if (!data?.length) {
    return (
      <Cs_EmptyState
        title="No bookings yet"
        text="When you request a studio, it shows up here with its status, from pending to completed."
        action={
          <Button asChild>
            <Link href="/studios">Explore Studios</Link>
          </Button>
        }
      />
    );
  }

  const cs_visible = cs_filter === "All" ? data : data.filter((booking) => booking.status === cs_filter);

  return (
    <div className="space-y-6">
      {/* status filter */}
      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {CS_FILTERS.map((item) => {
          const cs_count = item === "All" ? data.length : data.filter((booking) => booking.status === item).length;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={cs_filter === item}
              onClick={() => cs_setFilter(item)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                cs_filter === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
              )}
            >
              {item} ({cs_count})
            </button>
          );
        })}
      </div>

      {cs_visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No {cs_filter.toLowerCase()} bookings.</p>
      ) : (
        <ul className="space-y-4">
          {cs_visible.map((booking) => (
            <li key={booking._id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-40">
                {booking.studioImage && (
                  <Image src={booking.studioImage} alt={booking.studioTitle} fill sizes="160px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/studios/${booking.studioId}`} className="truncate text-lg font-semibold hover:text-primary">
                    {booking.studioTitle}
                  </Link>
                  <Cs_StatusBadge status={booking.status} />
                </div>
                <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    {cs_formatBookingDate(booking.date)}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {booking.startTime} to {booking.endTime} ({booking.hours} {booking.hours === 1 ? "hour" : "hours"})
                  </li>
                  <li className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {booking.studioLocation}
                  </li>
                </ul>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <p className="text-sm">
                    <span className="font-semibold">{cs_formatMoney(booking.totalPrice)}</span>
                    <span className="text-muted-foreground"> total, incl. {cs_formatMoney(booking.securityDeposit)} deposit</span>
                  </p>
                  {booking.status === "Pending" && (
                    <Cs_ConfirmDialog
                      trigger={
                        <Button variant="destructive" size="sm">
                          <XCircle />
                          Cancel Booking
                        </Button>
                      }
                      title="Cancel this booking request?"
                      description={`Your request for ${booking.studioTitle} on ${cs_formatBookingDate(booking.date)} will be withdrawn. You can book again any time.`}
                      confirmLabel="Cancel booking"
                      onConfirm={() => cs_cancel(booking)}
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
