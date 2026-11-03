import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cs_StarRating from "@/components/shared/StarRating";
import { cs_apiFetch } from "@/lib/api";
import { cs_formatDate } from "@/lib/format";
import type { CsReview } from "@/lib/types";

const cs_initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default async function Cs_ReviewList({ studioId }: { studioId: string }) {
  let cs_reviews: CsReview[] = [];
  try {
    cs_reviews = await cs_apiFetch<CsReview[]>(`/studios/${studioId}/reviews`, { cache: "no-store" });
  } catch {
    cs_reviews = [];
  }

  if (!cs_reviews.length) {
    return <p className="text-sm text-muted-foreground">No reviews yet. Creators who book this space can leave the first one.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {cs_reviews.map((review) => (
        <li key={review._id} className="py-6 first:pt-0">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={review.userPhoto || undefined} alt={review.userName} />
              <AvatarFallback>{cs_initials(review.userName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">{review.userName}</p>
              <p className="text-xs text-muted-foreground">{cs_formatDate(review.createdAt)}</p>
            </div>
            <Cs_StarRating value={review.rating} />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
