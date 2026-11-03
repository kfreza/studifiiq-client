"use client";

import { useEffect, useState } from "react";
import { cs_apiFetch } from "@/lib/api";

// client fetch with loading, error and reload
export function useCs_Fetch<T>(path: string) {
  const [cs_state, cs_setState] = useState<{ data: T | null; error: string; loading: boolean }>({
    data: null,
    error: "",
    loading: true,
  });
  const [cs_version, cs_setVersion] = useState(0);

  useEffect(() => {
    let cs_active = true;
    cs_apiFetch<T>(path)
      .then((data) => cs_active && cs_setState({ data, error: "", loading: false }))
      .catch((error: Error) => cs_active && cs_setState({ data: null, error: error.message, loading: false }));
    return () => {
      cs_active = false;
    };
  }, [path, cs_version]);

  const reload = () => {
    cs_setState((current) => ({ ...current, loading: true }));
    cs_setVersion((version) => version + 1);
  };

  const setData = (updater: (data: T | null) => T | null) =>
    cs_setState((current) => ({ ...current, data: updater(current.data) }));

  return { ...cs_state, reload, setData };
}
