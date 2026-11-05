import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cs_EmptyState from "@/components/shared/EmptyState";
import Cs_StudioCard from "@/components/studio/StudioCard";
import { cs_apiFetch } from "@/lib/api";
import type { CsStudio } from "@/lib/types";

export default async function Cs_FeaturedStudios() {
  let cs_studios: CsStudio[] = [];
  try {
    cs_studios = await cs_apiFetch<CsStudio[]>("/featured", { cache: "no-store" });
  } catch {
    cs_studios = [];
  }

  if (!cs_studios.length) {
    return (
      <Cs_EmptyState
        title="No studios listed yet"
        text="Be the first host on Studifiiq. List your space and it will appear here for creators to book."
        action={
          <Button asChild>
            <Link href="/add-studio">Host Your Space</Link>
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
