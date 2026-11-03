import type { Metadata } from "next";
import Cs_DashboardView from "@/components/dashboard/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="cs_container py-14">
      <Cs_DashboardView />
    </div>
  );
}
