import Link from "next/link";
import { Aperture } from "lucide-react";

export default function Cs_Logo() {
  return (
    <Link href="/" aria-label="Studifiiq home" className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Aperture className="size-5" strokeWidth={2.25} />
      </span>
      <span className="cs_display text-xl">Studifiiq</span>
    </Link>
  );
}
