"use client";

import { useEffect } from "react";
import { cs_hasIssuedToken, cs_issueToken, useCs_Session } from "@/lib/auth-client";

export default function Cs_AuthSync() {
  const { data } = useCs_Session();
  const cs_userId = data?.user.id;

  // keep jwt cookie in sync with the session (covers google login)
  useEffect(() => {
    if (!cs_userId || cs_hasIssuedToken(cs_userId)) return;
    cs_issueToken(cs_userId);
  }, [cs_userId]);

  return null;
}
