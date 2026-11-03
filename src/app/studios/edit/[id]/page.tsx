import type { Metadata } from "next";
import Cs_PageHeader from "@/components/shared/PageHeader";
import Cs_EditStudioView from "@/components/studio/EditStudioView";

export const metadata: Metadata = { title: "Update Studio" };

export default async function EditStudioPage({ params }: PageProps<"/studios/edit/[id]">) {
  const { id } = await params;
  return (
    <div className="cs_container py-14">
      <Cs_PageHeader title="Update your studio" text="Changes are saved to your live listing right away." />
      <Cs_EditStudioView id={id} />
    </div>
  );
}
