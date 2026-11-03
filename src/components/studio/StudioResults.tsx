import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cs_EmptyState from "@/components/shared/EmptyState";
import Cs_StudioCard from "@/components/studio/StudioCard";
import Cs_Pagination from "@/components/studio/Pagination";
import { cs_apiFetch } from "@/lib/api";
import { cs_buildQuery } from "@/lib/format";
import type { CsStudioList, CsStudioQuery } from "@/lib/types";

export default async function Cs_StudioResults({ query }: { query: CsStudioQuery }) {
  let cs_data: CsStudioList | null = null;
  try {
    cs_data = await cs_apiFetch<CsStudioList>(`/studios?${cs_buildQuery({ ...query, limit: 9 })}`, { cache: "no-store" });
  } catch {
    cs_data = null;
  }

  if (!cs_data) {
    return (
      <Cs_EmptyState
        title="Studios couldn't load"
        text="The studio list isn't available right now. Check your connection and try again in a moment."
        action={
          <Button variant="outline" asChild>
            <Link href="/studios">Reload studios</Link>
          </Button>
        }
      />
    );
  }

  if (!cs_data.studios.length) {
    return (
      <Cs_EmptyState
        title="No studios match your filters"
        text="Try a different search term or category, or clear the filters to see every space."
        action={
          <Button variant="outline" asChild>
            <Link href="/studios">Clear filters</Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted-foreground">
        {cs_data.total} {cs_data.total === 1 ? "studio" : "studios"}
        {query.category ? ` in ${query.category}` : ""}
        {query.search ? ` matching "${query.search}"` : ""}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cs_data.studios.map((studio) => (
          <Cs_StudioCard key={studio._id} studio={studio} />
        ))}
      </div>
      <Cs_Pagination query={query} page={cs_data.page} totalPages={cs_data.totalPages} />
    </>
  );
}
