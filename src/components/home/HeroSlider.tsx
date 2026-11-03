"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type SwiperClass from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { Button } from "@/components/ui/button";

const cs_img = (id: string) => `https://images.unsplash.com/photo-${id}?w=2000&q=80&auto=format&fit=crop`;

// slides
const CS_SLIDES = [
  {
    image: cs_img("1471341971476-ae15ff5dd4ea"),
    alt: "A photo studio with a white cyclorama wall and softbox lights",
    title: "Book the room your next shoot needs.",
    text: "Cyc walls, daylight lofts and lit sets from independent hosts, bookable by the hour with lighting included.",
  },
  {
    image: cs_img("1612544409025-e1f6a56c1152"),
    alt: "A film crew working on a large soundstage",
    title: "Stages built for crews, priced for indie budgets.",
    text: "Soundproofed stages with lighting grids, green screens and drive-in loading for commercials and short films.",
  },
  {
    image: cs_img("1598488035139-bdbb2231ce04"),
    alt: "A music recording studio with a mixing console and guitars",
    title: "Treated rooms for every take.",
    text: "Podcast lounges, tracking suites and mix rooms with the gear already patched in and ready to record.",
  },
];

export default function Cs_HeroSlider() {
  const cs_swiperRef = useRef<SwiperClass | null>(null);
  const cs_barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // progress bars
  const cs_updateBars = (activeIndex: number, progress: number) => {
    cs_barRefs.current.forEach((bar, index) => {
      if (!bar) return;
      const cs_fill = index < activeIndex ? 1 : index === activeIndex ? progress : 0;
      bar.style.transform = `scaleX(${cs_fill})`;
    });
  };

  return (
    <section aria-label="Featured studio types" className="relative h-[78vh] max-h-[760px] min-h-[520px] bg-foreground">
      <Swiper
        modules={[A11y, Autoplay, EffectFade, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={900}
        keyboard={{ enabled: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        onSwiper={(swiper) => {
          cs_swiperRef.current = swiper;
        }}
        onAutoplayTimeLeft={(swiper, _timeLeft, percentage) => cs_updateBars(swiper.realIndex, 1 - percentage)}
        onSlideChange={(swiper) => cs_updateBars(swiper.realIndex, 0)}
        className="h-full"
      >
        {CS_SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.title} className="relative">
            <Image src={slide.image} alt={slide.alt} fill priority={index === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
            <div className="absolute inset-x-0 bottom-24">
              <div className="cs_container text-white">
                <h1 className="cs_display max-w-3xl text-4xl sm:text-6xl">{slide.title}</h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">{slide.text}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <Link href="/studios">Explore Studios</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white dark:border-white/40 dark:bg-white/10 dark:hover:bg-white/20"
                  >
                    <Link href="/add-studio">Host Your Space</Link>
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* slide controls */}
      <div className="absolute inset-x-0 bottom-8 z-10">
        <div className="cs_container flex gap-2">
          {CS_SLIDES.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => cs_swiperRef.current?.slideToLoop(index)}
              className="relative h-1.5 w-14 overflow-hidden rounded-full bg-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:w-20"
            >
              <span
                ref={(element) => {
                  cs_barRefs.current[index] = element;
                }}
                style={{ transform: "scaleX(0)" }}
                className="absolute inset-0 origin-left rounded-full bg-white"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
