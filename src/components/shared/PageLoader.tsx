import Cs_Loader from "@/components/shared/Loader";

export default function Cs_PageLoader({ label }: { label?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <Cs_Loader label={label} />
    </div>
  );
}
