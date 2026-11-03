"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cs_apiFetch } from "@/lib/api";
import { useCs_Session } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const CS_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function Cs_ReviewForm({ studioId, ownerEmail }: { studioId: string; ownerEmail: string }) {
  const cs_router = useRouter();
  const cs_pathname = usePathname();
  const { data: cs_session, isPending } = useCs_Session();
  const [cs_rating, cs_setRating] = useState(0);
  const [cs_hover, cs_setHover] = useState(0);
  const [cs_comment, cs_setComment] = useState("");
  const [cs_saving, cs_setSaving] = useState(false);

  if (isPending || cs_session?.user.email === ownerEmail) return null;

  if (!cs_session) {
    return (
      <p className="rounded-xl border border-dashed border-border px-5 py-4 text-sm text-muted-foreground">
        Booked this studio?{" "}
        <Link href={`/login?redirect=${encodeURIComponent(cs_pathname)}`} className="font-medium text-primary underline-offset-4 hover:underline">
          Log in
        </Link>{" "}
        to leave a review.
      </p>
    );
  }

  // submit review
  const cs_handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cs_rating) return void toast.error("Choose a star rating.");
    if (cs_comment.trim().length < 10) return void toast.error("Write at least 10 characters about your session.");

    cs_setSaving(true);
    try {
      await cs_apiFetch(`/studios/${studioId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating: cs_rating, comment: cs_comment.trim() }),
      });
      toast.success("Review posted. Thanks for helping other creators choose.");
      cs_setRating(0);
      cs_setComment("");
      cs_router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      cs_setSaving(false);
    }
  };

  const cs_shown = cs_hover || cs_rating;

  return (
    <form onSubmit={cs_handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold">Review your session</h3>
      <fieldset>
        <legend className="mb-2 text-sm text-muted-foreground">Your rating</legend>
        <div className="flex items-center gap-1" onMouseLeave={() => cs_setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
              aria-pressed={cs_rating === star}
              onClick={() => cs_setRating(star)}
              onMouseEnter={() => cs_setHover(star)}
              className="rounded p-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Star className={cn("size-6", star <= cs_shown ? "fill-cs-tape text-cs-tape" : "text-border")} />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">{CS_LABELS[cs_shown]}</span>
        </div>
      </fieldset>
      <div className="space-y-2">
        <Label htmlFor="cs_review_comment">Your review</Label>
        <Textarea
          id="cs_review_comment"
          rows={4}
          maxLength={600}
          placeholder="How was the space, the light, the gear and the host?"
          value={cs_comment}
          onChange={(event) => cs_setComment(event.target.value)}
        />
      </div>
      <Button type="submit" disabled={cs_saving}>
        {cs_saving ? "Posting..." : "Post review"}
      </Button>
    </form>
  );
}
