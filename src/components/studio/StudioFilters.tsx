"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CS_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CS_SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export default function Cs_StudioFilters({ category, search, sort }: { category: string; search: string; sort: string }) {
  const cs_router = useRouter();
  const cs_pathname = usePathname();
  const cs_params = useSearchParams();
  const [cs_search, cs_setSearch] = useState(search);

  // update url params
  const cs_update = (changes: Record<string, string>) => {
    const cs_next = new URLSearchParams(cs_params.toString());
    Object.entries(changes).forEach(([key, value]) => (value ? cs_next.set(key, value) : cs_next.delete(key)));
    cs_next.delete("page");
    const cs_query = cs_next.toString();
    cs_router.push(cs_query ? `${cs_pathname}?${cs_query}` : cs_pathname, { scroll: false });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* search */}
        <form
          role="search"
          className="relative flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            cs_update({ search: cs_search.trim() });
          }}
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="cs_search" className="sr-only">
            Search studios
          </label>
          <Input
            id="cs_search"
            type="search"
            placeholder="Search by name, city or type"
            value={cs_search}
            onChange={(event) => cs_setSearch(event.target.value)}
            className="h-10 bg-card pr-24 pl-9"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                cs_setSearch("");
                cs_update({ search: "" });
              }}
              className="absolute top-1/2 right-20 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
          <Button type="submit" size="sm" className="absolute top-1/2 right-1 -translate-y-1/2">
            Search
          </Button>
        </form>

        {/* sort */}
        <Select value={sort || "newest"} onValueChange={(value) => cs_update({ sort: value === "newest" ? "" : value })}>
          <SelectTrigger aria-label="Sort studios" className="h-10 w-full bg-card sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CS_SORTS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* categories */}
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {["All", ...CS_CATEGORIES].map((item) => {
          const cs_active = item === "All" ? !category : category === item;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={cs_active}
              onClick={() => cs_update({ category: item === "All" ? "" : item })}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                cs_active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
