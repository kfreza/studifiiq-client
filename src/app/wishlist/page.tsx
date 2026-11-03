import type { Metadata } from "next";
import Cs_PageHeader from "@/components/shared/PageHeader";
import Cs_WishlistView from "@/components/wishlist/WishlistView";

export const metadata: Metadata = { title: "Saved Studios" };

export default function WishlistPage() {
  return (
    <div className="cs_container py-14">
      <Cs_PageHeader title="Saved studios" text="Spaces you've saved with the heart. Remove one any time by tapping it again." />
      <Cs_WishlistView />
    </div>
  );
}
