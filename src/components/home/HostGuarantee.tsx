import Link from "next/link";
import { BadgeCheck, Headset, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const CS_ASSURANCES = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    text: "A security deposit is held on every booking to cover accidental damage to the space.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    text: "Hosts and creators sign in with real accounts, and every listing shows who runs it.",
  },
  {
    icon: Wrench,
    title: "Equipment safety",
    text: "Hosts list what is included and in what condition, so nothing on set comes as a surprise.",
  },
  {
    icon: Headset,
    title: "24/7 host support",
    text: "Reach the support team any time, before a booking or in the middle of a session.",
  },
];

export default function Cs_HostGuarantee() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
      <div className="space-y-5">
        <h2 className="cs_section_title">Host with confidence. Create with support.</h2>
        <p className="cs_prose">
          Opening your studio to other creators should feel as safe as working in it yourself. These protections
          apply to every booking on StudioSpace.
        </p>
        <Button size="lg" asChild>
          <Link href="/add-studio">Host Your Space</Link>
        </Button>
      </div>
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        {CS_ASSURANCES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="border-t border-border pt-5">
            <Icon className="size-6 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
