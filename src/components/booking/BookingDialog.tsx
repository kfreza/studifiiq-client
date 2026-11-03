"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cs_apiFetch } from "@/lib/api";
import { useCs_Session } from "@/lib/auth-client";
import { cs_formatBookingDate, cs_formatMoney, cs_todayString } from "@/lib/format";

// hourly slots 06:00 to 23:00
const CS_HOURS = Array.from({ length: 18 }, (_, index) => `${String(index + 6).padStart(2, "0")}:00`);
const cs_hourOf = (time: string) => Number(time.split(":")[0]);

type CsSlot = { startTime: string; endTime: string; status: "Pending" | "Confirmed" };

export default function Cs_BookingDialog({
  studio,
}: {
  studio: { _id: string; title: string; hourlyRate: number; securityDeposit: number; ownerEmail: string };
}) {
  const cs_router = useRouter();
  const cs_pathname = usePathname();
  const { data: cs_session, isPending } = useCs_Session();
  const [cs_open, cs_setOpen] = useState(false);
  const [cs_date, cs_setDate] = useState("");
  const [cs_start, cs_setStart] = useState("");
  const [cs_end, cs_setEnd] = useState("");
  const [cs_slots, cs_setSlots] = useState<CsSlot[]>([]);
  const [cs_saving, cs_setSaving] = useState(false);

  const cs_hours = cs_start && cs_end ? cs_hourOf(cs_end) - cs_hourOf(cs_start) : 0;
  const cs_subtotal = cs_hours * studio.hourlyRate;
  const cs_endOptions = CS_HOURS.filter(
    (time) => cs_start && cs_hourOf(time) > cs_hourOf(cs_start) && cs_hourOf(time) - cs_hourOf(cs_start) <= 12
  );
  const cs_clash = cs_slots.find(
    (slot) =>
      slot.status === "Confirmed" && cs_start && cs_end && slot.startTime < cs_end && slot.endTime > cs_start
  );

  // load booked slots for the chosen date
  const cs_pickDate = async (value: string) => {
    cs_setDate(value);
    cs_setSlots([]);
    if (!value) return;
    try {
      cs_setSlots(await cs_apiFetch<CsSlot[]>(`/studios/${studio._id}/availability?date=${value}`));
    } catch {
      cs_setSlots([]);
    }
  };

  // open or send to login
  const cs_handleOpen = (open: boolean) => {
    if (open && !cs_session) {
      toast.info("Log in to book this studio.");
      cs_router.push(`/login?redirect=${encodeURIComponent(cs_pathname)}`);
      return;
    }
    cs_setOpen(open);
  };

  // submit booking
  const cs_handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cs_date || !cs_start || !cs_end) return void toast.error("Choose a date, start time and end time.");
    if (cs_clash) return void toast.error(`Those hours overlap a confirmed booking (${cs_clash.startTime} to ${cs_clash.endTime}).`);

    cs_setSaving(true);
    try {
      await cs_apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({ studioId: studio._id, date: cs_date, startTime: cs_start, endTime: cs_end }),
      });
      toast.success("Booking request sent. You'll see it as Pending until the host confirms.");
      cs_setOpen(false);
      cs_router.push("/my-bookings");
    } catch (error) {
      toast.error((error as Error).message);
      cs_setSaving(false);
    }
  };

  if (!isPending && cs_session?.user.email === studio.ownerEmail) {
    return (
      <Button size="lg" variant="secondary" className="mt-6 w-full" disabled>
        You host this studio
      </Button>
    );
  }

  return (
    <Dialog open={cs_open} onOpenChange={cs_handleOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="mt-6 w-full" disabled={isPending}>
          <CalendarClock />
          Book Workspace Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {studio.title}</DialogTitle>
          <DialogDescription>Pick a date and your hours. The host confirms each request.</DialogDescription>
        </DialogHeader>

        <form id="cs_booking_form" onSubmit={cs_handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="cs_booking_date">Date</Label>
            <Input
              id="cs_booking_date"
              type="date"
              min={cs_todayString()}
              value={cs_date}
              onChange={(event) => cs_pickDate(event.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cs_booking_start">Start</Label>
              <Select
                value={cs_start}
                onValueChange={(value) => {
                  cs_setStart(value);
                  if (cs_end && cs_hourOf(cs_end) <= cs_hourOf(value)) cs_setEnd("");
                }}
              >
                <SelectTrigger id="cs_booking_start" className="w-full">
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent>
                  {CS_HOURS.slice(0, -1).map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs_booking_end">End</Label>
              <Select value={cs_end} onValueChange={cs_setEnd} disabled={!cs_start}>
                <SelectTrigger id="cs_booking_end" className="w-full">
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent>
                  {cs_endOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* availability */}
          {cs_date && (
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
              <p className="font-medium">{cs_formatBookingDate(cs_date)}</p>
              {cs_slots.length ? (
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  {cs_slots.map((slot) => (
                    <li key={`${slot.startTime}-${slot.endTime}-${slot.status}`}>
                      {slot.startTime} to {slot.endTime}: {slot.status === "Confirmed" ? "booked" : "requested by another creator"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-muted-foreground">No bookings yet. Every hour is open.</p>
              )}
              {cs_clash && (
                <p className="mt-2 font-medium text-destructive">
                  Your hours overlap the confirmed booking from {cs_clash.startTime} to {cs_clash.endTime}.
                </p>
              )}
            </div>
          )}

          {/* price */}
          <dl className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {cs_formatMoney(studio.hourlyRate)} x {cs_hours} {cs_hours === 1 ? "hour" : "hours"}
              </dt>
              <dd>{cs_formatMoney(cs_subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Refundable security deposit</dt>
              <dd>{cs_formatMoney(studio.securityDeposit)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd>{cs_formatMoney(cs_hours ? cs_subtotal + studio.securityDeposit : 0)}</dd>
            </div>
          </dl>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => cs_setOpen(false)} disabled={cs_saving}>
            Cancel
          </Button>
          <Button type="submit" form="cs_booking_form" disabled={cs_saving || !cs_hours || Boolean(cs_clash)}>
            {cs_saving ? "Sending..." : "Request booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
