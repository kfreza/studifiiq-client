import type { Metadata } from "next";
import Cs_AuthShell from "@/components/auth/AuthShell";
import Cs_RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <Cs_AuthShell title="Create your account" text="One account to book creative spaces and to host your own.">
      <Cs_RegisterForm />
    </Cs_AuthShell>
  );
}
