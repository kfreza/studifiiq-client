"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Cs_ConfirmDialog from "@/components/shared/ConfirmDialog";
import Cs_EmptyState from "@/components/shared/EmptyState";
import { useCs_Fetch } from "@/hooks/useCsFetch";
import { cs_apiFetch } from "@/lib/api";
import { cs_formatMoney } from "@/lib/format";
import type { CsStudio } from "@/lib/types";

export default function Cs_MyListingsView() {
  const { data, loading, error, reload, setData } = useCs_Fetch<CsStudio[]>("/my-listings");

  // delete listing
  const cs_delete = async (studio: CsStudio) => {
    try {
      await cs_apiFetch(`/studios/${studio._id}`, { method: "DELETE" });
      setData((current) => (current ?? []).filter((item) => item._id !== studio._id));
      toast.success(`"${studio.title}" was deleted.`);
      return true;
    } catch (cs_error) {
      toast.error((cs_error as Error).message);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading your listings">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <Cs_EmptyState title="Your listings didn't load" text={error} action={<Button onClick={reload}>Try again</Button>} />;
  }

  if (!data?.length) {
    return (
      <Cs_EmptyState
        title="You haven't listed a studio yet"
        text="List your space with photos, a rate and the gear included. It goes live on Explore Studios right away."
        action={
          <Button asChild>
            <Link href="/add-studio">
              <Plus />
              Add New Studio
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="space-y-4">
      {data.map((studio) => (
        <li
          key={studio._id}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
        >
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-36">
            {studio.images[0] && <Image src={studio.images[0]} alt={studio.title} fill sizes="160px" className="object-cover" />}
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{studio.category}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3.5 fill-cs-tape text-cs-tape" />
                {studio.reviewCount ? `${studio.rating.toFixed(1)} (${studio.reviewCount})` : "No reviews yet"}
              </span>
            </div>
            <h2 className="truncate text-lg font-semibold">{studio.title}</h2>
            <p className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
              <span>{studio.location}</span>
              <span>{cs_formatMoney(studio.hourlyRate)} / hr</span>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/studios/${studio._id}`}>
                <Eye />
                View
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/studios/edit/${studio._id}`}>
                <Pencil />
                Update
              </Link>
            </Button>
            <Cs_ConfirmDialog
              trigger={
                <Button variant="destructive" size="sm">
                  <Trash2 />
                  Delete
                </Button>
              }
              title={`Delete "${studio.title}"?`}
              description="The listing and its reviews will be removed for good, and any pending booking requests will be cancelled. This can't be undone."
              confirmLabel="Delete studio"
              onConfirm={() => cs_delete(studio)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
