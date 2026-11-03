"use client";

import { Heart } from "lucide-react";
import { useCs_Wishlist } from "@/components/wishlist/WishlistProvider";
import { cn } from "@/lib/utils";

export default function Cs_WishlistButton({ studioId, title, className }: { studioId: string; title: string; className?: string }) {
  const { isSaved, toggle } = useCs_Wishlist();
  const cs_saved = isSaved(studioId);

  return (
    <button
      type="button"
      aria-pressed={cs_saved}
      aria-label={cs_saved ? `Remove ${title} from saved studios` : `Save ${title}`}
      onClick={() => toggle(studioId, title)}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-background/90 transition-colors hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className
      )}
    >
      <Heart className={cn("size-4.5", cs_saved ? "fill-destructive text-destructive" : "text-foreground")} />
    </button>
  );
}
