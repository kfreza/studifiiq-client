"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type SwiperClass from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Cs_StudioGallery({ images, title }: { images: string[]; title: string }) {
  const cs_swiperRef = useRef<SwiperClass | null>(null);
  const [cs_active, cs_setActive] = useState(0);
  const cs_multiple = images.length > 1;

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <Swiper
          modules={[A11y, Keyboard, Navigation]}
          keyboard={{ enabled: true }}
          onSwiper={(swiper) => {
            cs_swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => cs_setActive(swiper.activeIndex)}
          className="aspect-[16/10]"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image} className="relative">
              <Image
                src={image}
                alt={`${title}, photo ${index + 1} of ${images.length}`}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* arrows */}
        {cs_multiple && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => cs_swiperRef.current?.slidePrev()}
              disabled={cs_active === 0}
              className="absolute top-1/2 left-3 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow disabled:opacity-0"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => cs_swiperRef.current?.slideNext()}
              disabled={cs_active === images.length - 1}
              className="absolute top-1/2 right-3 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow disabled:opacity-0"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute right-3 bottom-3 z-10 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold">
              {cs_active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* thumbnails */}
      {cs_multiple && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Show photo ${index + 1}`}
              aria-current={cs_active === index}
              onClick={() => cs_swiperRef.current?.slideTo(index)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-opacity",
                cs_active === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={image} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
