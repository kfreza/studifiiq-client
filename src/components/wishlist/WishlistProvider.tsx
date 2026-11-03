"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, use, useEffect, useState } from "react";
import { toast } from "sonner";
import { cs_apiFetch } from "@/lib/api";
import { useCs_Session } from "@/lib/auth-client";

type CsWishlist = {
  ids: Set<string>;
  isSaved: (studioId: string) => boolean;
  toggle: (studioId: string, title: string) => Promise<void>;
};

const CsWishlistContext = createContext<CsWishlist | null>(null);

// wishlist hook
export function useCs_Wishlist() {
  const cs_context = use(CsWishlistContext);
  if (!cs_context) throw new Error("useCs_Wishlist must be used inside Cs_WishlistProvider");
  return cs_context;
}

export default function Cs_WishlistProvider({ children }: { children: React.ReactNode }) {
  const cs_router = useRouter();
  const cs_pathname = usePathname();
  const { data: cs_session } = useCs_Session();
  const cs_userId = cs_session?.user.id;
  const [cs_ids, cs_setIds] = useState<Set<string>>(new Set());

  // load saved ids for the signed-in user
  useEffect(() => {
    let cs_active = true;
    const cs_load = cs_userId ? cs_apiFetch<string[]>("/wishlist/ids") : Promise.resolve([]);
    cs_load.then((ids) => cs_active && cs_setIds(new Set(ids))).catch(() => cs_active && cs_setIds(new Set()));
    return () => {
      cs_active = false;
    };
  }, [cs_userId]);

  // save or remove
  const toggle = async (studioId: string, title: string) => {
    if (!cs_userId) {
      toast.info("Log in to save studios to your wishlist.");
      cs_router.push(`/login?redirect=${encodeURIComponent(cs_pathname)}`);
      return;
    }
    const cs_saved = cs_ids.has(studioId);
    const cs_next = new Set(cs_ids);
    if (cs_saved) cs_next.delete(studioId);
    else cs_next.add(studioId);
    cs_setIds(cs_next);

    try {
      if (cs_saved) await cs_apiFetch(`/wishlist/${studioId}`, { method: "DELETE" });
      else await cs_apiFetch("/wishlist", { method: "POST", body: JSON.stringify({ studioId }) });
      toast.success(cs_saved ? `Removed "${title}" from saved studios.` : `Saved "${title}".`);
    } catch (error) {
      cs_setIds(cs_ids);
      toast.error((error as Error).message);
    }
  };

  return (
    <CsWishlistContext value={{ ids: cs_ids, isSaved: (studioId) => cs_ids.has(studioId), toggle }}>
      {children}
    </CsWishlistContext>
  );
}
