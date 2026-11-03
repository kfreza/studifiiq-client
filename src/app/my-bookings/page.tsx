import type { Metadata } from "next";
import Cs_PageHeader from "@/components/shared/PageHeader";
import Cs_MyBookingsView from "@/components/booking/MyBookingsView";

export const metadata: Metadata = { title: "My Bookings" };

export default function MyBookingsPage() {
  return (
    <div className="cs_container py-14">
      <Cs_PageHeader
        title="My bookings"
        text="Every studio you've requested. Pending requests can be cancelled until the host confirms them."
      />
      <Cs_MyBookingsView />
    </div>
  );
}
