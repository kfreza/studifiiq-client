"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cs_PasswordInput from "@/components/auth/PasswordInput";
import Cs_GoogleButton from "@/components/auth/GoogleButton";
import Cs_OrDivider from "@/components/auth/OrDivider";
import { cs_authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

// password rules
const cs_passwordRules = (password: string) => [
  { label: "One uppercase letter", passed: [...password].some((char) => char !== char.toLowerCase()) },
  { label: "One lowercase letter", passed: [...password].some((char) => char !== char.toUpperCase()) },
  { label: "At least 6 characters", passed: password.length >= 6 },
];

// photo url check
const cs_isValidUrl = (value: string) => {
  try {
    const cs_url = new URL(value);
    return cs_url.protocol === "http:" || cs_url.protocol === "https:";
  } catch {
    return false;
  }
};

export default function Cs_RegisterForm() {
  const cs_router = useRouter();
  const [cs_form, cs_setForm] = useState({ name: "", email: "", photo: "", password: "" });
  const [cs_loading, cs_setLoading] = useState(false);
  const [cs_touched, cs_setTouched] = useState(false);

  const cs_rules = cs_passwordRules(cs_form.password);
  const cs_passwordValid = cs_rules.every((rule) => rule.passed);

  const cs_update = (field: keyof typeof cs_form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    cs_setForm((current) => ({ ...current, [field]: event.target.value }));

  // register
  const cs_handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    cs_setTouched(true);

    if (!cs_passwordValid) {
      toast.error("Your password doesn't meet all the requirements.");
      return;
    }
    if (!cs_isValidUrl(cs_form.photo.trim())) {
      toast.error("Enter a valid photo URL starting with http or https.");
      return;
    }

    cs_setLoading(true);
    const { error } = await cs_authClient.signUp.email({
      name: cs_form.name.trim(),
      email: cs_form.email.trim(),
      password: cs_form.password,
      image: cs_form.photo.trim(),
    });

    if (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      cs_setLoading(false);
      return;
    }

    toast.success("Account created. Log in to continue.");
    cs_router.push("/login");
  };

  return (
    <>
      <form onSubmit={cs_handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="cs_name">Name</Label>
          <Input id="cs_name" autoComplete="name" required value={cs_form.name} onChange={cs_update("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cs_email">Email</Label>
          <Input id="cs_email" type="email" autoComplete="email" required value={cs_form.email} onChange={cs_update("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cs_photo">Photo URL</Label>
          <Input
            id="cs_photo"
            type="url"
            placeholder="https://i.ibb.co/your-photo.jpg"
            required
            value={cs_form.photo}
            onChange={cs_update("photo")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cs_password">Password</Label>
          <Cs_PasswordInput
            id="cs_password"
            autoComplete="new-password"
            required
            aria-invalid={cs_touched && !cs_passwordValid}
            aria-describedby="cs_password_rules"
            value={cs_form.password}
            onChange={cs_update("password")}
          />
          <ul id="cs_password_rules" className="grid gap-1 pt-1 text-sm">
            {cs_rules.map((rule) => (
              <li
                key={rule.label}
                className={cn(
                  "flex items-center gap-2",
                  rule.passed ? "text-foreground" : cs_touched ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {rule.passed ? <Check className="size-4 text-primary" /> : <X className="size-4" />}
                {rule.label}
              </li>
            ))}
          </ul>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={cs_loading}>
          {cs_loading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <Cs_OrDivider />
      <Cs_GoogleButton callbackURL="/" />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}
