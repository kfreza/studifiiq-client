import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Privacy" };

const CS_SECTIONS = [
  {
    title: "Bookings",
    text: "A booking request is binding once the host confirms it. Creators may cancel a request while it is still pending. The security deposit covers damage to the space or equipment and is returned after the session.",
  },
  {
    title: "Listings",
    text: "Hosts must own or have the right to rent the spaces they list, and must describe equipment, capacity and prices accurately. Listings that mislead creators are removed.",
  },
  {
    title: "Conduct",
    text: "Treat every space and every person with care. Hosts may refuse entry to anyone who breaks the house rules shown on the listing.",
  },
  {
    title: "Privacy",
    text: "We store your name, email and profile photo to run your account, and your bookings and listings to run the service. We never sell your data. Authentication uses secure, HTTP-only cookies.",
  },
];

export default function TermsPage() {
  return (
    <div className="cs_container space-y-10 py-16">
      <h1 className="cs_display text-4xl sm:text-5xl">Terms &amp; Privacy</h1>
      <div className="space-y-8">
        {CS_SECTIONS.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="cs_prose">{section.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
