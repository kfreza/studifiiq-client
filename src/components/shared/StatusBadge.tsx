import type { CsBookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const CS_STATUS_STYLES: Record<CsBookingStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Confirmed: "bg-primary/15 text-primary",
  Completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Cancelled: "bg-muted text-muted-foreground",
};

export default function Cs_StatusBadge({ status }: { status: CsBookingStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", CS_STATUS_STYLES[status])}>
      {status}
    </span>
  );
}
