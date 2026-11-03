import Link from "next/link";
import { Camera, Clapperboard, Mic, Music, Palette } from "lucide-react";
import { cs_apiFetch } from "@/lib/api";
import { CS_CATEGORIES, cs_categoryHref } from "@/lib/constants";

// category details
const CS_CATEGORY_INFO: Record<string, { icon: typeof Camera; text: string }> = {
  "Photo Studio": { icon: Camera, text: "Cyc walls, strobes and daylight lofts" },
  "Film Stage": { icon: Clapperboard, text: "Sound stages with grids and green screens" },
  "Podcast Lounge": { icon: Mic, text: "Mic'd-up sets for audio and video shows" },
  "Music Suite": { icon: Music, text: "Tracking, mixing and writing rooms" },
  "Art Workshop": { icon: Palette, text: "Ateliers, easels and makers' benches" },
};

export default async function Cs_CategoryGrid() {
  let cs_counts: Record<string, number> = {};
  try {
    const cs_data = await cs_apiFetch<{ name: string; count: number }[]>("/categories", { cache: "no-store" });
    cs_counts = Object.fromEntries(cs_data.map((item) => [item.name, item.count]));
  } catch {
    cs_counts = {};
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {CS_CATEGORIES.map((category) => {
        const { icon: Icon, text } = CS_CATEGORY_INFO[category];
        const cs_count = cs_counts[category] ?? 0;
        return (
          <li key={category}>
            <Link
              href={cs_categoryHref(category)}
              className="flex h-full flex-col rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="mb-6 grid size-11 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <span className="text-base font-semibold">{category}</span>
              <span className="mt-1 text-sm leading-6 text-muted-foreground">{text}</span>
              <span className="mt-auto pt-4 text-sm font-medium text-primary">
                {cs_count} {cs_count === 1 ? "space" : "spaces"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
