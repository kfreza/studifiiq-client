"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cs_EmptyState from "@/components/shared/EmptyState";
import Cs_StudioCard from "@/components/studio/StudioCard";
import Cs_StudioGridSkeleton from "@/components/studio/StudioGridSkeleton";
import { useCs_Wishlist } from "@/components/wishlist/WishlistProvider";
import { useCs_Fetch } from "@/hooks/useCsFetch";
import type { CsStudio } from "@/lib/types";

export default function Cs_WishlistView() {
  const { data, loading, error, reload } = useCs_Fetch<CsStudio[]>("/wishlist");
  const { ids } = useCs_Wishlist();

  if (loading) return <Cs_StudioGridSkeleton count={3} />;
  if (error) {
    return <Cs_EmptyState title="Saved studios didn't load" text={error} action={<Button onClick={reload}>Try again</Button>} />;
  }

  // hide studios unsaved on this page
  const cs_studios = (data ?? []).filter((studio) => ids.has(studio._id));

  if (!cs_studios.length) {
    return (
      <Cs_EmptyState
        title="No saved studios yet"
        text="Tap the heart on any studio to keep it here while you compare options."
        action={
          <Button asChild>
            <Link href="/studios">Explore Studios</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cs_studios.map((studio) => (
        <Cs_StudioCard key={studio._id} studio={studio} />
      ))}
    </div>
  );
}
