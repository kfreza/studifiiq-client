import type { Metadata } from "next";
import Cs_PageHeader from "@/components/shared/PageHeader";
import Cs_AddStudioView from "@/components/studio/AddStudioView";

export const metadata: Metadata = { title: "Add New Studio" };

export default function AddStudioPage() {
  return (
    <div className="cs_container py-14">
      <Cs_PageHeader
        title="List your studio"
        text="Add clear photos, an honest hourly rate and the gear that comes with the room. Your listing goes live as soon as you publish."
      />
      <Cs_AddStudioView />
    </div>
  );
}
