"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cs_EmptyState from "@/components/shared/EmptyState";
import Cs_PageLoader from "@/components/shared/PageLoader";
import Cs_StudioForm from "@/components/studio/StudioForm";
import { useCs_Fetch } from "@/hooks/useCsFetch";
import { useCs_Session } from "@/lib/auth-client";
import type { CsStudio } from "@/lib/types";

export default function Cs_EditStudioView({ id }: { id: string }) {
  const { data: cs_session, isPending } = useCs_Session();
  const { data: cs_studio, loading, error } = useCs_Fetch<CsStudio>(`/studios/${id}`);

  if (isPending || loading) return <Cs_PageLoader label="Loading your listing" />;

  const cs_back = (
    <Button variant="outline" asChild>
      <Link href="/my-listings">Back to My Listings</Link>
    </Button>
  );

  if (error || !cs_studio) {
    return <Cs_EmptyState title="Listing not found" text={error || "This studio may have been deleted."} action={cs_back} />;
  }
  if (!cs_session || cs_studio.ownerEmail !== cs_session.user.email) {
    return <Cs_EmptyState title="You can't edit this listing" text="Only the host who listed this studio can update it." action={cs_back} />;
  }

  return <Cs_StudioForm owner={{ name: cs_studio.ownerName, email: cs_studio.ownerEmail }} studio={cs_studio} />;
}
