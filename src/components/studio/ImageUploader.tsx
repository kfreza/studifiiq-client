"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cs_apiFetch } from "@/lib/api";

const CS_MAX_IMAGES = 6;
const CS_MAX_BYTES = 3 * 1024 * 1024;

const cs_isUrl = (value: string) => {
  try {
    const cs_url = new URL(value);
    return cs_url.protocol === "http:" || cs_url.protocol === "https:";
  } catch {
    return false;
  }
};

// file to base64 without the data: prefix
const cs_toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const cs_reader = new FileReader();
    cs_reader.onload = () => resolve(String(cs_reader.result).split(",")[1] || "");
    cs_reader.onerror = () => reject(new Error("This file couldn't be read."));
    cs_reader.readAsDataURL(file);
  });

export default function Cs_ImageUploader({
  images,
  onChange,
  invalid,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  invalid?: boolean;
}) {
  const cs_fileRef = useRef<HTMLInputElement>(null);
  const [cs_uploading, cs_setUploading] = useState(false);
  const [cs_url, cs_setUrl] = useState("");
  const cs_full = images.length >= CS_MAX_IMAGES;

  // upload to imgbb via server
  const cs_handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const cs_file = event.target.files?.[0];
    event.target.value = "";
    if (!cs_file) return;
    if (!cs_file.type.startsWith("image/")) return void toast.error("Choose an image file (JPG, PNG or WebP).");
    if (cs_file.size > CS_MAX_BYTES) return void toast.error("Images must be 3 MB or smaller.");

    cs_setUploading(true);
    try {
      const { url } = await cs_apiFetch<{ url: string }>("/upload", {
        method: "POST",
        body: JSON.stringify({ image: await cs_toBase64(cs_file) }),
      });
      onChange([...images, url]);
      toast.success("Photo uploaded.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      cs_setUploading(false);
    }
  };

  // add pasted url
  const cs_addUrl = () => {
    const cs_value = cs_url.trim();
    if (!cs_isUrl(cs_value)) return void toast.error("Enter a valid image URL starting with http or https.");
    if (images.includes(cs_value)) return void toast.error("That photo is already added.");
    onChange([...images, cs_value]);
    cs_setUrl("");
  };

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <li key={image} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
              <Image src={image} alt={`Studio photo ${index + 1}`} fill sizes="200px" className="object-cover" />
              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold">Cover</span>
              )}
              <button
                type="button"
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => onChange(images.filter((item) => item !== image))}
                className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-background/90 hover:bg-background"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input ref={cs_fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={cs_handleFile} />
        <Button
          type="button"
          variant="outline"
          onClick={() => cs_fileRef.current?.click()}
          disabled={cs_uploading || cs_full}
          aria-invalid={invalid}
        >
          {cs_uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          {cs_uploading ? "Uploading..." : "Upload photo"}
        </Button>
        <div className="flex flex-1 gap-2">
          <label htmlFor="cs_image_url" className="sr-only">
            Image URL
          </label>
          <Input
            id="cs_image_url"
            type="url"
            placeholder="Or paste an image URL"
            value={cs_url}
            disabled={cs_full}
            onChange={(event) => cs_setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                cs_addUrl();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={cs_addUrl} disabled={cs_full || !cs_url.trim()}>
            Add
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {images.length}/{CS_MAX_IMAGES} photos. The first photo is the cover. JPG, PNG or WebP up to 3 MB.
      </p>
    </div>
  );
}
