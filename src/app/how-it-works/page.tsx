import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "How It Works" };

const CS_CREATOR_STEPS = [
  { title: "Discover spaces", text: "Browse by category, city or price and compare amenities, capacity and reviews side by side." },
  { title: "Select shoot hours", text: "Pick a date and the exact hours you need. The total, including the refundable deposit, updates as you go." },
  { title: "Book instantly", text: "Send your request in one step. The host confirms it, and you can follow its status in My Bookings." },
  { title: "Create and produce", text: "Arrive, set up and make the work. Leave a review afterwards to help the next creator choose." },
];

const CS_HOST_STEPS = [
  { title: "List your studio", text: "Add photos, an hourly rate, a security deposit, capacity and the equipment included." },
  { title: "Review requests", text: "Every booking arrives as a request on your dashboard. Confirm it or decline it in one click." },
  { title: "Welcome creators", text: "Confirmed slots are locked, so no one else can book the same hours. Double bookings can't happen." },
];

function Cs_StepList({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-8 sm:grid-cols-2">
      {steps.map((step, index) => (
        <li key={step.title} className="border-l-2 border-primary pl-5">
          <span className="cs_display text-3xl text-primary">{index + 1}</span>
          <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="cs_container space-y-20 py-16">
      <header className="space-y-4">
        <h1 className="cs_display text-4xl sm:text-5xl">How StudioSpace works</h1>
        <p className="cs_prose">
          Creators book spaces by the hour. Hosts earn from rooms that would otherwise sit empty. Here is what
          each side of a booking looks like.
        </p>
      </header>

      <section className="space-y-8">
        <h2 className="cs_section_title">For creators</h2>
        <Cs_StepList steps={CS_CREATOR_STEPS} />
        <Button size="lg" asChild>
          <Link href="/studios">Explore Studios</Link>
        </Button>
      </section>

      <section className="space-y-8">
        <h2 className="cs_section_title">For hosts</h2>
        <Cs_StepList steps={CS_HOST_STEPS} />
        <Button size="lg" variant="outline" asChild>
          <Link href="/add-studio">Host Your Space</Link>
        </Button>
      </section>
    </div>
  );
}
