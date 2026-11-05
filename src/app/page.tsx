import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Cs_SectionHeading from "@/components/shared/SectionHeading";
import Cs_HeroSlider from "@/components/home/HeroSlider";
import Cs_FeaturedStudios from "@/components/home/FeaturedStudios";
import Cs_CategoryGrid from "@/components/home/CategoryGrid";
import Cs_BookingSteps from "@/components/home/BookingSteps";
import Cs_HostGuarantee from "@/components/home/HostGuarantee";
import Cs_StudioGridSkeleton from "@/components/studio/StudioGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <>
      <Cs_HeroSlider />

      {/* featured */}
      <section className="cs_container py-20">
        <Cs_SectionHeading
          title="Featured studios"
          text="The highest-rated spaces on Studifiiq right now, chosen by the creators who booked them."
          action={
            <Button variant="outline" asChild>
              <Link href="/studios">View all studios</Link>
            </Button>
          }
        />
        <Suspense fallback={<Cs_StudioGridSkeleton />}>
          <Cs_FeaturedStudios />
        </Suspense>
      </section>

      {/* categories */}
      <section className="border-y border-border bg-card py-20">
        <div className="cs_container">
          <Cs_SectionHeading
            title="Browse by studio type"
            text="Every kind of creative room, from a single podcast mic to a full sound stage."
          />
          <Suspense fallback={<Skeleton className="h-52 w-full rounded-xl" />}>
            <Cs_CategoryGrid />
          </Suspense>
        </div>
      </section>

      {/* booking steps */}
      <section className="cs_container py-20">
        <Cs_SectionHeading
          title="How booking works"
          text="From first search to first frame in four steps."
        />
        <Cs_BookingSteps />
      </section>

      {/* host guarantee */}
      <section className="border-t border-border bg-card py-20">
        <div className="cs_container">
          <Cs_HostGuarantee />
        </div>
      </section>
    </>
  );
}
