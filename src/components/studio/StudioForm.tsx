"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Cs_ImageUploader from "@/components/studio/ImageUploader";
import { cs_apiFetch } from "@/lib/api";
import { CS_CATEGORIES } from "@/lib/constants";
import type { CsStudio, CsStudioInput } from "@/lib/types";

const CS_AMENITIES = [
  "Wi-Fi",
  "Air Conditioning",
  "Parking",
  "Natural Light",
  "Lighting Kit",
  "Backdrops",
  "Green Screen",
  "Soundproofing",
  "Microphones",
  "Mixing Desk",
  "Instruments",
  "Easels",
  "Changing Room",
  "Makeup Station",
  "Kitchenette",
  "Loading Dock",
  "Wheelchair Access",
];

type CsErrors = Partial<Record<keyof CsStudioInput, string>>;

// validate form values
const cs_validate = (values: Record<string, string>, images: string[], amenities: string[]) => {
  const cs_errors: CsErrors = {};
  const cs_num = (value: string) => Number(value);
  if (values.title.trim().length < 4 || values.title.trim().length > 80) cs_errors.title = "Use 4 to 80 characters.";
  if (!CS_CATEGORIES.includes(values.category as (typeof CS_CATEGORIES)[number])) cs_errors.category = "Choose a category.";
  if (!(cs_num(values.hourlyRate) >= 5 && cs_num(values.hourlyRate) <= 5000)) cs_errors.hourlyRate = "Enter $5 to $5,000.";
  if (!(cs_num(values.securityDeposit) >= 0 && cs_num(values.securityDeposit) <= 10000))
    cs_errors.securityDeposit = "Enter $0 to $10,000.";
  const cs_capacity = cs_num(values.maxCapacity);
  if (!(Number.isInteger(cs_capacity) && cs_capacity >= 1 && cs_capacity <= 500)) cs_errors.maxCapacity = "Enter 1 to 500 people.";
  if (values.location.trim().length < 3) cs_errors.location = "Enter a city or address.";
  if (images.length < 1) cs_errors.images = "Add at least one photo.";
  if (amenities.length < 1) cs_errors.amenities = "Choose at least one amenity.";
  if (values.overview.trim().length < 50) cs_errors.overview = `Write at least 50 characters (${values.overview.trim().length}/50).`;
  return cs_errors;
};

export default function Cs_StudioForm({
  owner,
  studio,
}: {
  owner: { name: string; email: string };
  studio?: CsStudio;
}) {
  const cs_router = useRouter();
  const cs_isEdit = Boolean(studio);
  const [cs_values, cs_setValues] = useState({
    title: studio?.title ?? "",
    category: studio?.category ?? "",
    hourlyRate: studio ? String(studio.hourlyRate) : "",
    securityDeposit: studio ? String(studio.securityDeposit) : "",
    maxCapacity: studio ? String(studio.maxCapacity) : "",
    location: studio?.location ?? "",
    overview: studio?.overview ?? "",
  });
  const [cs_images, cs_setImages] = useState<string[]>(studio?.images ?? []);
  const [cs_amenities, cs_setAmenities] = useState<string[]>(studio?.amenities ?? []);
  const [cs_custom, cs_setCustom] = useState("");
  const [cs_errors, cs_setErrors] = useState<CsErrors>({});
  const [cs_saving, cs_setSaving] = useState(false);

  const cs_field = (name: keyof typeof cs_values) => ({
    id: `cs_${name}`,
    value: cs_values[name],
    "aria-invalid": Boolean(cs_errors[name]),
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      cs_setValues((current) => ({ ...current, [name]: event.target.value })),
  });

  const cs_toggleAmenity = (amenity: string, checked: boolean) =>
    cs_setAmenities((current) => (checked ? [...current, amenity] : current.filter((item) => item !== amenity)));

  // custom amenity
  const cs_addCustom = () => {
    const cs_value = cs_custom.trim();
    if (!cs_value) return;
    if (cs_value.length > 40) return void toast.error("Keep each amenity under 40 characters.");
    if (!cs_amenities.some((item) => item.toLowerCase() === cs_value.toLowerCase())) cs_setAmenities([...cs_amenities, cs_value]);
    cs_setCustom("");
  };

  // submit
  const cs_handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cs_found = cs_validate(cs_values, cs_images, cs_amenities);
    cs_setErrors(cs_found);
    if (Object.keys(cs_found).length) {
      toast.error("Check the highlighted fields and try again.");
      return;
    }

    const cs_payload: CsStudioInput = {
      title: cs_values.title.trim(),
      category: cs_values.category,
      hourlyRate: Number(cs_values.hourlyRate),
      securityDeposit: Number(cs_values.securityDeposit),
      maxCapacity: Number(cs_values.maxCapacity),
      location: cs_values.location.trim(),
      images: cs_images,
      amenities: cs_amenities,
      overview: cs_values.overview.trim(),
    };

    cs_setSaving(true);
    try {
      if (studio) {
        await cs_apiFetch(`/studios/${studio._id}`, { method: "PATCH", body: JSON.stringify(cs_payload) });
        toast.success("Changes saved.");
      } else {
        await cs_apiFetch("/studios", { method: "POST", body: JSON.stringify(cs_payload) });
        toast.success("Studio published. It's now live on Explore Studios.");
      }
      cs_router.push("/my-listings");
      cs_router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
      cs_setSaving(false);
    }
  };

  const cs_error = (name: keyof CsStudioInput) =>
    cs_errors[name] ? <p className="text-sm text-destructive">{cs_errors[name]}</p> : null;

  const cs_customAmenities = cs_amenities.filter((item) => !CS_AMENITIES.includes(item));

  return (
    <form onSubmit={cs_handleSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-10">
        {/* basics */}
        <fieldset className="space-y-5">
          <legend className="mb-5 text-xl font-semibold">The basics</legend>
          <div className="space-y-2">
            <Label htmlFor="cs_title">Title</Label>
            <Input {...cs_field("title")} placeholder="Northlight Cyc Wall Studio" />
            {cs_error("title")}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cs_category">Category</Label>
              <Select value={cs_values.category} onValueChange={(value) => cs_setValues((current) => ({ ...current, category: value }))}>
                <SelectTrigger id="cs_category" aria-invalid={Boolean(cs_errors.category)} className="w-full">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {CS_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {cs_error("category")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs_location">Location / address</Label>
              <Input {...cs_field("location")} placeholder="Brooklyn, New York" />
              {cs_error("location")}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="cs_hourlyRate">Hourly rate ($)</Label>
              <Input {...cs_field("hourlyRate")} type="number" min={5} inputMode="decimal" placeholder="60" />
              {cs_error("hourlyRate")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs_securityDeposit">Security deposit ($)</Label>
              <Input {...cs_field("securityDeposit")} type="number" min={0} inputMode="decimal" placeholder="150" />
              {cs_error("securityDeposit")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs_maxCapacity">Max capacity</Label>
              <Input {...cs_field("maxCapacity")} type="number" min={1} inputMode="numeric" placeholder="10" />
              {cs_error("maxCapacity")}
            </div>
          </div>
        </fieldset>

        {/* photos */}
        <fieldset className="space-y-3">
          <legend className="mb-3 text-xl font-semibold">Photos</legend>
          <Cs_ImageUploader images={cs_images} onChange={cs_setImages} invalid={Boolean(cs_errors.images)} />
          {cs_error("images")}
        </fieldset>

        {/* amenities */}
        <fieldset className="space-y-4">
          <legend className="mb-4 text-xl font-semibold">Amenities</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {CS_AMENITIES.map((amenity) => (
              <label key={amenity} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <Checkbox
                  checked={cs_amenities.includes(amenity)}
                  onCheckedChange={(checked) => cs_toggleAmenity(amenity, checked === true)}
                />
                {amenity}
              </label>
            ))}
          </div>
          {cs_customAmenities.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {cs_customAmenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-1 rounded-full bg-accent py-1 pr-1.5 pl-3 text-sm text-accent-foreground">
                  {amenity}
                  <button type="button" aria-label={`Remove ${amenity}`} onClick={() => cs_toggleAmenity(amenity, false)}>
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex max-w-md gap-2">
            <label htmlFor="cs_custom_amenity" className="sr-only">
              Add another amenity
            </label>
            <Input
              id="cs_custom_amenity"
              placeholder="Add another amenity"
              value={cs_custom}
              onChange={(event) => cs_setCustom(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  cs_addCustom();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={cs_addCustom} disabled={!cs_custom.trim()}>
              <Plus />
              Add
            </Button>
          </div>
          {cs_error("amenities")}
        </fieldset>

        {/* overview */}
        <fieldset className="space-y-2">
          <legend className="mb-3 text-xl font-semibold">Detailed overview</legend>
          <Label htmlFor="cs_overview" className="sr-only">
            Detailed overview
          </Label>
          <Textarea
            {...cs_field("overview")}
            rows={6}
            placeholder="Describe the space, the light, the equipment included and what it's best for."
          />
          {cs_error("overview")}
        </fieldset>
      </div>

      {/* host + submit */}
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold">Host details</h2>
          <div className="space-y-2">
            <Label htmlFor="cs_owner_name">Name</Label>
            <Input id="cs_owner_name" value={owner.name} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cs_owner_email">Email</Label>
            <Input id="cs_owner_email" value={owner.email} readOnly disabled />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={cs_saving}>
          {cs_saving ? "Saving..." : cs_isEdit ? "Save changes" : "Publish studio"}
        </Button>
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => cs_router.back()} disabled={cs_saving}>
          Cancel
        </Button>
      </aside>
    </form>
  );
}
