import type { Metadata } from "next";
import { Suspense } from "react";
import Cs_StudioFilters from "@/components/studio/StudioFilters";
import Cs_StudioResults from "@/components/studio/StudioResults";
import Cs_StudioGridSkeleton from "@/components/studio/StudioGridSkeleton";
import type { CsStudioQuery } from "@/lib/types";

export const metadata: Metadata = { title: "Explore Studios" };

const cs_pick = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function StudiosPage({ searchParams }: PageProps<"/studios">) {
  const cs_params = await searchParams;
  const cs_query: CsStudioQuery = {
    category: cs_pick(cs_params.category),
    search: cs_pick(cs_params.search),
    sort: cs_pick(cs_params.sort),
    page: cs_pick(cs_params.page),
  };

  return (
    <div className="cs_container py-14">
      <header className="mb-10 space-y-3">
        <h1 className="cs_display text-4xl sm:text-5xl">Explore studios</h1>
        <p className="cs_prose">
          Every space is listed by the person who runs it. Filter by type, search a city, and compare rates before you
          book.
        </p>
      </header>

      <div className="mb-10">
        <Suspense>
          <Cs_StudioFilters key={cs_query.search} category={cs_query.category} search={cs_query.search} sort={cs_query.sort} />
        </Suspense>
      </div>

      <Suspense key={JSON.stringify(cs_query)} fallback={<Cs_StudioGridSkeleton count={9} />}>
        <Cs_StudioResults query={cs_query} />
      </Suspense>
    </div>
  );
}
