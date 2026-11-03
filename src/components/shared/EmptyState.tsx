import { Aperture } from "lucide-react";

export default function Cs_EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-muted text-primary">
        <Aperture className="size-6" />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
