"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cs_PasswordInput from "@/components/auth/PasswordInput";
import Cs_GoogleButton from "@/components/auth/GoogleButton";
import Cs_OrDivider from "@/components/auth/OrDivider";
import { cs_authClient, cs_issueToken, cs_safeRedirect } from "@/lib/auth-client";

export default function Cs_LoginForm() {
  const cs_router = useRouter();
  const cs_redirect = cs_safeRedirect(useSearchParams().get("redirect"));
  const [cs_email, cs_setEmail] = useState("");
  const [cs_password, cs_setPassword] = useState("");
  const [cs_loading, cs_setLoading] = useState(false);

  // email login
  const cs_handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    cs_setLoading(true);

    const { data, error } = await cs_authClient.signIn.email({ email: cs_email.trim(), password: cs_password });
    if (error || !data) {
      toast.error(error?.message || "Invalid email or password.");
      cs_setLoading(false);
      return;
    }

    await cs_issueToken(data.user.id);
    toast.success(`Welcome back, ${data.user.name}.`);
    cs_router.replace(cs_redirect);
    cs_router.refresh();
  };

  return (
    <>
      <form onSubmit={cs_handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="cs_email">Email</Label>
          <Input
            id="cs_email"
            type="email"
            autoComplete="email"
            required
            value={cs_email}
            onChange={(event) => cs_setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cs_password">Password</Label>
            <button
              type="button"
              onClick={() => toast.info("Password reset isn't available yet. Log in with Google or contact support.")}
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Cs_PasswordInput
            id="cs_password"
            autoComplete="current-password"
            required
            value={cs_password}
            onChange={(event) => cs_setPassword(event.target.value)}
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={cs_loading}>
          {cs_loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <Cs_OrDivider />
      <Cs_GoogleButton callbackURL={cs_redirect} />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to StudioSpace?{" "}
        <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
