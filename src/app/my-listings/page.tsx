import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cs_PageHeader from "@/components/shared/PageHeader";
import Cs_MyListingsView from "@/components/studio/MyListingsView";

export const metadata: Metadata = { title: "My Studio Listings" };

export default function MyListingsPage() {
  return (
    <div className="cs_container py-14">
      <Cs_PageHeader
        title="My studio listings"
        text="Every space you host. Update the details or remove a listing you no longer offer."
        action={
          <Button asChild>
            <Link href="/add-studio">
              <Plus />
              Add New Studio
            </Link>
          </Button>
        }
      />
      <Cs_MyListingsView />
    </div>
  );
}
