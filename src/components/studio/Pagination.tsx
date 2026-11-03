import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cs_buildQuery } from "@/lib/format";
import type { CsStudioQuery } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Cs_Pagination({ query, page, totalPages }: { query: CsStudioQuery; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  const cs_href = (target: number) => {
    const cs_query = cs_buildQuery({ ...query, page: target > 1 ? target : undefined });
    return cs_query ? `/studios?${cs_query}` : "/studios";
  };

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      <Button variant="outline" size="icon" asChild={page > 1} disabled={page <= 1} aria-label="Previous page">
        {page > 1 ? (
          <Link href={cs_href(page - 1)} scroll={false}>
            <ChevronLeft />
          </Link>
        ) : (
          <ChevronLeft />
        )}
      </Button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <Link
          key={number}
          href={cs_href(number)}
          scroll={false}
          aria-current={number === page ? "page" : undefined}
          className={cn(
            "grid size-9 place-items-center rounded-md border text-sm font-medium",
            number === page ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"
          )}
        >
          {number}
        </Link>
      ))}
      <Button variant="outline" size="icon" asChild={page < totalPages} disabled={page >= totalPages} aria-label="Next page">
        {page < totalPages ? (
          <Link href={cs_href(page + 1)} scroll={false}>
            <ChevronRight />
          </Link>
        ) : (
          <ChevronRight />
        )}
      </Button>
    </nav>
  );
}
