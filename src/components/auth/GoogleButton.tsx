"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cs_authClient } from "@/lib/auth-client";

export default function Cs_GoogleButton({ callbackURL = "/" }: { callbackURL?: string }) {
  const [cs_loading, cs_setLoading] = useState(false);

  // google sign in
  const cs_handleClick = async () => {
    cs_setLoading(true);
    const { error } = await cs_authClient.signIn.social({
      provider: "google",
      callbackURL,
      errorCallbackURL: "/login",
    });
    if (error) {
      toast.error(error.message || "Google sign-in failed. Please try again.");
      cs_setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="lg" className="w-full" onClick={cs_handleClick} disabled={cs_loading}>
      <FcGoogle className="size-5" />
      {cs_loading ? "Opening Google..." : "Continue with Google"}
    </Button>
  );
}
