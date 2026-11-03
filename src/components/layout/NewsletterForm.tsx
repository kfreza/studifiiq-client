"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Cs_NewsletterForm() {
  const [cs_email, cs_setEmail] = useState("");

  // subscribe
  const cs_handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cs_value = cs_email.trim();
    if (!cs_value.includes("@") || !cs_value.includes(".")) {
      toast.error("Enter a valid email address to subscribe.");
      return;
    }
    toast.success("Subscribed. New studios arrive in your inbox every Friday.");
    cs_setEmail("");
  };

  return (
    <form onSubmit={cs_handleSubmit} className="flex gap-2">
      <label htmlFor="cs_newsletter" className="sr-only">
        Email address
      </label>
      <Input
        id="cs_newsletter"
        type="email"
        placeholder="you@studio.com"
        value={cs_email}
        onChange={(event) => cs_setEmail(event.target.value)}
        className="bg-background"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
