// navigation
export const CS_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

// categories
export const CS_CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
] as const;

export type CsCategory = (typeof CS_CATEGORIES)[number];

export const cs_categoryHref = (category: string) =>
  `/studios?category=${encodeURIComponent(category)}`;
