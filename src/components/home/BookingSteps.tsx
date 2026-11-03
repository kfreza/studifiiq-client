import { CalendarClock, Clapperboard, Search, Zap } from "lucide-react";

const CS_STEPS = [
  { icon: Search, title: "Discover spaces", text: "Filter by category and compare rates, amenities and reviews." },
  { icon: CalendarClock, title: "Select shoot hours", text: "Pick the date and exact hours. The total updates as you choose." },
  { icon: Zap, title: "Book instantly", text: "Send your request in one step and track it in My Bookings." },
  { icon: Clapperboard, title: "Create & produce", text: "Arrive, set up and make the work. The room is yours for the slot." },
];

export default function Cs_BookingSteps() {
  return (
    <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {CS_STEPS.map(({ icon: Icon, title, text }, index) => (
        <li key={title} className="relative">
          <div className="flex items-center gap-3">
            <span className="cs_display grid size-11 shrink-0 place-items-center rounded-full bg-primary text-lg text-primary-foreground">
              {index + 1}
            </span>
            {index < CS_STEPS.length - 1 && <span aria-hidden className="hidden h-px flex-1 bg-border lg:block" />}
          </div>
          <Icon className="mt-5 size-5 text-primary" />
          <h3 className="mt-2 text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
        </li>
      ))}
    </ol>
  );
}
