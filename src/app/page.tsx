import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="cs_container py-24">
      <h1 className="cs_display max-w-3xl text-5xl sm:text-6xl">Book the room your next project needs.</h1>
      <p className="cs_prose mt-6">
        Photo studios, film stages, podcast lounges, music suites and art workshops, listed by the people who
        run them and bookable by the hour.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" asChild>
          <Link href="/studios">Explore Studios</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/add-studio">Host Your Space</Link>
        </Button>
      </div>
    </section>
  );
}
