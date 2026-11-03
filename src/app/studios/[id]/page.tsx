import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { Check, MapPin, Star, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Cs_StudioGallery from "@/components/studio/StudioGallery";
import Cs_ReviewList from "@/components/studio/ReviewList";
import Cs_ReviewForm from "@/components/studio/ReviewForm";
import Cs_BookingDialog from "@/components/booking/BookingDialog";
import Cs_WishlistButton from "@/components/wishlist/WishlistButton";
import { cs_apiFetch } from "@/lib/api";
import { cs_formatDate, cs_formatMoney } from "@/lib/format";
import type { CsStudio } from "@/lib/types";

// shared fetch for page + metadata
const cs_getStudio = cache(async (id: string) => {
  try {
    return await cs_apiFetch<CsStudio>(`/studios/${id}`, { cache: "no-store" });
  } catch (error) {
    if ((error as { status?: number }).status === 404) return null;
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps<"/studios/[id]">): Promise<Metadata> {
  const { id } = await params;
  const cs_studio = await cs_getStudio(id);
  return cs_studio ? { title: cs_studio.title, description: cs_studio.overview.slice(0, 155) } : { title: "Studio not found" };
}

export default async function StudioDetailsPage({ params }: PageProps<"/studios/[id]">) {
  const { id } = await params;
  const cs_studio = await cs_getStudio(id);
  if (!cs_studio) notFound();

  const cs_specs = [
    { label: "Category", value: cs_studio.category },
    { label: "Hourly rate", value: `${cs_formatMoney(cs_studio.hourlyRate)} / hr` },
    { label: "Security deposit", value: `${cs_formatMoney(cs_studio.securityDeposit)}, refundable` },
    { label: "Max capacity", value: `${cs_studio.maxCapacity} people` },
    { label: "Location", value: cs_studio.location },
    { label: "Listed", value: cs_formatDate(cs_studio.createdAt) },
  ];

  return (
    <div className="cs_container py-12">
      {/* header */}
      <header className="mb-8 space-y-4">
        <Badge>{cs_studio.category}</Badge>
        <div className="flex items-start justify-between gap-4">
          <h1 className="cs_display text-4xl sm:text-5xl">{cs_studio.title}</h1>
          <Cs_WishlistButton studioId={cs_studio._id} title={cs_studio.title} className="mt-1 shrink-0 border border-border" />
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {cs_studio.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="size-4 fill-cs-tape text-cs-tape" />
            {cs_studio.reviewCount
              ? `${cs_studio.rating.toFixed(1)} from ${cs_studio.reviewCount} ${cs_studio.reviewCount === 1 ? "review" : "reviews"}`
              : "No reviews yet"}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4" />
            Up to {cs_studio.maxCapacity} people
          </span>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-12">
          <Cs_StudioGallery images={cs_studio.images} title={cs_studio.title} />

          {/* overview */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">About this space</h2>
            <p className="cs_prose">{cs_studio.overview}</p>
          </section>

          {/* specs */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Specifications</h2>
            <dl className="grid overflow-hidden rounded-xl border border-border sm:grid-cols-2">
              {cs_specs.map((spec) => (
                <div key={spec.label} className="border-b border-border bg-card px-5 py-4 sm:odd:border-r">
                  <dt className="text-xs text-muted-foreground">{spec.label}</dt>
                  <dd className="mt-1 font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* amenities */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Amenities</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {cs_studio.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2.5 text-sm">
                  <span className="grid size-6 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Check className="size-3.5" />
                  </span>
                  {amenity}
                </li>
              ))}
            </ul>
          </section>

          {/* reviews */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <Cs_ReviewForm studioId={cs_studio._id} ownerEmail={cs_studio.ownerEmail} />
            <Suspense fallback={<Skeleton className="h-40 w-full" />}>
              <Cs_ReviewList studioId={cs_studio._id} />
            </Suspense>
          </section>
        </div>

        {/* booking + host */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p>
              <span className="cs_display text-3xl">{cs_formatMoney(cs_studio.hourlyRate)}</span>
              <span className="text-muted-foreground"> / hour</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Plus a {cs_formatMoney(cs_studio.securityDeposit)} refundable security deposit per booking.
            </p>
            <Cs_BookingDialog
              studio={{
                _id: cs_studio._id,
                title: cs_studio.title,
                hourlyRate: cs_studio.hourlyRate,
                securityDeposit: cs_studio.securityDeposit,
                ownerEmail: cs_studio.ownerEmail,
              }}
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-semibold">Hosted by</h2>
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage src={cs_studio.ownerPhoto || undefined} alt={cs_studio.ownerName} />
                <AvatarFallback>{cs_studio.ownerName.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold">{cs_studio.ownerName}</p>
                <p className="truncate text-sm text-muted-foreground">{cs_studio.ownerEmail}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
