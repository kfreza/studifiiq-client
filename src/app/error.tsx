"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="cs_container grid min-h-[60vh] place-items-center py-16 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="cs_section_title">This page didn&apos;t load</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          The server didn&apos;t respond as expected. Try again, or head back home and come back in a moment.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
