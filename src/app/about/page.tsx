import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "About Us" };

const CS_COMMITMENTS = [
  { title: "Verified hosts", text: "Every host signs in with a real account, and every listing shows who runs it." },
  { title: "Prices up front", text: "Hourly rate and security deposit are shown before you book, with no fees added at the end." },
  { title: "Fair to both sides", text: "Hosts confirm each request, and confirmed hours are protected from double booking." },
];

export default function AboutPage() {
  return (
    <div className="cs_container space-y-16 py-16">
      <header className="space-y-5">
        <h1 className="cs_display max-w-3xl text-4xl sm:text-5xl">Creative spaces should be easy to find and fair to book.</h1>
        <p className="cs_prose">
          Most great studios are run by independent owners: a photographer with a cyc wall, a producer with a
          treated room, a painter with good north light. They have hours to spare. Creators need those hours
          and have no simple way to find them.
        </p>
        <p className="cs_prose">
          StudioSpace puts both sides in one place. Hosts list their rooms with honest photos and prices, and
          creators book exactly the hours they need, without long contracts or back-and-forth emails.
        </p>
      </header>

      <section className="space-y-8">
        <h2 className="cs_section_title">What we commit to</h2>
        <dl className="grid gap-8 md:grid-cols-3">
          {CS_COMMITMENTS.map((item) => (
            <div key={item.title} className="border-t-2 border-primary pt-4">
              <dt className="text-lg font-semibold">{item.title}</dt>
              <dd className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Button size="lg" asChild>
        <Link href="/studios">Explore Studios</Link>
      </Button>
    </div>
  );
}
