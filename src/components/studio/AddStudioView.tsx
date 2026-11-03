"use client";

import Cs_PageLoader from "@/components/shared/PageLoader";
import Cs_StudioForm from "@/components/studio/StudioForm";
import { useCs_Session } from "@/lib/auth-client";

export default function Cs_AddStudioView() {
  const { data, isPending } = useCs_Session();
  if (isPending || !data) return <Cs_PageLoader label="Loading your account" />;
  return <Cs_StudioForm owner={{ name: data.user.name, email: data.user.email }} />;
}
