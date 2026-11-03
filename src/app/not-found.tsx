import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cs_EmptySetArt from "@/components/shared/EmptySetArt";

export default function NotFound() {
  return (
    <section className="cs_container grid min-h-[70vh] items-center gap-10 py-16 md:grid-cols-2">
      <Cs_EmptySetArt className="w-full max-w-lg" />
      <div className="space-y-5">
        <p className="cs_display text-7xl text-primary sm:text-8xl">404</p>
        <h1 className="cs_section_title">This set is empty</h1>
        <p className="cs_prose">
          The page you&apos;re looking for isn&apos;t on the call sheet. The link may be broken, or the page
          may have moved.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/studios">Explore studios</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
