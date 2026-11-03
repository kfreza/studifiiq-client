import type { Metadata } from "next";
import { Suspense } from "react";
import Cs_AuthShell from "@/components/auth/AuthShell";
import Cs_LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <Cs_AuthShell title="Login" text="Welcome back. Log in to book studios, manage your listings and track your bookings.">
      <Suspense>
        <Cs_LoginForm />
      </Suspense>
    </Cs_AuthShell>
  );
}
