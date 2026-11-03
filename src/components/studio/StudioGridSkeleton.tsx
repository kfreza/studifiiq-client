import { Skeleton } from "@/components/ui/skeleton";

export default function Cs_StudioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading studios" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-border bg-card">
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center justify-between border-t border-border pt-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
