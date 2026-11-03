import Cs_Loader from "@/components/shared/Loader";

export default function Loading() {
  return (
    <div className="cs_container grid min-h-[60vh] place-items-center">
      <Cs_Loader />
    </div>
  );
}
