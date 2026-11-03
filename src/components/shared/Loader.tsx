import { Aperture } from "lucide-react";

export default function Cs_Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 text-muted-foreground">
      <Aperture className="size-10 text-primary motion-safe:animate-spin motion-safe:[animation-duration:2.4s]" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
