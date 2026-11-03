import Image from "next/image";
import Link from "next/link";
import { Aperture, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CsStudio } from "@/lib/types";

export default function Cs_StudioCard({ studio }: { studio: CsStudio }) {
  const cs_cover = studio.images[0];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* cover */}
      <div className="relative aspect-[4/3] bg-muted">
        {cs_cover ? (
          <Image
            src={cs_cover}
            alt={studio.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Aperture className="absolute inset-0 m-auto size-10 text-muted-foreground" />
        )}
        <Badge className="absolute top-3 left-3">{studio.category}</Badge>
        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold">
          <Star className="size-3.5 fill-cs-tape text-cs-tape" />
          {studio.reviewCount ? studio.rating.toFixed(1) : "New"}
        </span>
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1.5">
          <h3 className="line-clamp-1 text-lg font-semibold">{studio.title}</h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="line-clamp-1">{studio.location}</span>
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <p>
            <span className="text-xl font-bold">${studio.hourlyRate}</span>
            <span className="text-sm text-muted-foreground"> / hr</span>
          </p>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/studios/${studio._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
