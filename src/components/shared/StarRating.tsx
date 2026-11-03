import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Cs_StarRating({ value, className }: { value: number; className?: string }) {
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn("size-4", star <= Math.round(value) ? "fill-cs-tape text-cs-tape" : "text-border")}
        />
      ))}
    </span>
  );
}
